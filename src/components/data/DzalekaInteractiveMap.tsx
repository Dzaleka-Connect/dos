import { useEffect, useRef, useState } from 'react';
import type { Map as LeafletMap, Marker as LeafletMarker, Polyline as LeafletPolyline, TileLayer } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Modal from '../ui/Modal';
import { parseMapRoute, type MapRoute } from '../../utils/mapRoute';
import rawOsmPoints from '../../data/dzalekaOsmPoints.json';

export interface MapPoint {
  id: string;
  osmId: string;
  osmType: string;
  type: 'health' | 'education' | 'culture' | 'service' | 'market';
  lat: number;
  lng: number;
  name: string;
  categoryLabel: string;
  description: string;
  zone: string;
  operator?: string;
  openingHours?: string;
  encyclopediaUrl?: string;
}

// Zoom level at or above which marker name labels are shown. Below this the
// 90+ labels overlap each other and obscure the map.
const LABEL_ZOOM_THRESHOLD = 17;

const MAP_POINTS: MapPoint[] = (rawOsmPoints as MapPoint[]).map((pt) => {
  const lower = pt.name.toLowerCase();
  let encyclopediaUrl: string | undefined;

  if (lower.includes('refugee site') || lower.includes('dzaleka camp')) {
    encyclopediaUrl = '/encyclopedia/dzaleka-refugee-camp';
  } else if (lower.includes('healthcare') || lower.includes('hospital') || lower.includes('clinic')) {
    encyclopediaUrl = '/encyclopedia/health-nutrition-and-population';
  } else if (lower.includes('secondary school') || lower.includes('higher education') || lower.includes('jesuit')) {
    encyclopediaUrl = '/encyclopedia/dzaleka-higher-education-thesis';
  } else if (lower.includes('takenolab') || lower.includes('appfactory')) {
    encyclopediaUrl = '/encyclopedia/takenolab';
  } else if (lower.includes('market')) {
    encyclopediaUrl = '/encyclopedia/livelihoods-and-local-economy';
  } else if (lower.includes('police')) {
    encyclopediaUrl = '/encyclopedia/law-and-encampment-policy';
  }

  return { ...pt, encyclopediaUrl };
});

const DEFAULT_ORIGINS = [
  { name: 'Lilongwe City Center', lat: -13.9626, lng: 33.7741 },
  { name: 'Dowa Boma Center', lat: -13.6542, lng: 33.9378 },
  { name: 'Dzaleka Main South Gate', lat: -13.6637, lng: 33.8689 },
  { name: 'Dzaleka Central Market', lat: -13.6592, lng: 33.8704 },
];

export function DzalekaInteractiveMap() {
  const mapRef = useRef<LeafletMap | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<Map<string, LeafletMarker>>(new Map());
  const tileLayerRef = useRef<TileLayer | null>(null);
  const routePolylineRef = useRef<LeafletPolyline | null>(null);

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeLayer, setActiveLayer] = useState<'satellite' | 'streets' | 'humanitarian'>('satellite');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchFocused, setSearchFocused] = useState<boolean>(false);
  const [selectedPoint, setSelectedPoint] = useState<MapPoint | null>(null);
  const [copiedCoords, setCopiedCoords] = useState<boolean>(false);
  const [sharedLink, setSharedLink] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);

  // DIRECTIONS & NAVIGATION STATE
  const [directionsMode, setDirectionsMode] = useState<boolean>(false);
  const [originPoint, setOriginPoint] = useState<{ name: string; lat: number; lng: number }>(DEFAULT_ORIGINS[0]);
  const [destinationPoint, setDestinationPoint] = useState<MapPoint | null>(MAP_POINTS[0]);
  const [travelMode, setTravelMode] = useState<'driving' | 'walking' | 'transit'>('driving');
  const [locatingUser, setLocatingUser] = useState<boolean>(false);

  const appRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [mapError, setMapError] = useState(false);
  useEffect(() => {
    const update = () => { setIsFullscreen(document.fullscreenElement === appRef.current); mapRef.current?.invalidateSize(); };
    document.addEventListener('fullscreenchange', update);
    return () => document.removeEventListener('fullscreenchange', update);
  }, []);
  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (appRef.current?.requestFullscreen) await appRef.current.requestFullscreen();
      else setFeedback('Fullscreen is unavailable in this browser. You can still pan and zoom the map.');
    } catch { setFeedback('Fullscreen could not open. You can still pan and zoom the map.'); }
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    let isMounted = true;
    let resize: ResizeObserver | undefined;

    const initMap = async () => {
      if (!mapContainerRef.current || mapRef.current) return;

      const L = (await import('leaflet')).default;

      if (!isMounted) return;

      try {
        const map = L.map(mapContainerRef.current, {
          center: [-13.6592, 33.8705],
          zoom: 16,
          zoomControl: false,
        });

        const getTileUrl = (layer: string) => {
          if (layer === 'satellite') {
            return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
          } else if (layer === 'humanitarian') {
            return 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png';
          }
          return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        };

        const getAttribution = (layer: string) => {
          if (layer === 'satellite') {
            return 'Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics';
          }
          return '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors';
        };

        const tileLayer = L.tileLayer(getTileUrl(activeLayer), {
          attribution: getAttribution(activeLayer),
          maxZoom: 20,
          maxNativeZoom: activeLayer === 'satellite' ? 18 : 19,
        }).addTo(map);

        tileLayerRef.current = tileLayer;
        mapRef.current = map;
        resize = new ResizeObserver(() => map.invalidateSize());
        resize.observe(mapContainerRef.current);
        setReady(true);

        setTimeout(() => {
          if (mapRef.current) {
            try {
              mapRef.current.invalidateSize();
            } catch (e) {
              // Ignore resize teardown errors
            }
          }
        }, 250);

        const markersMap = new Map<string, LeafletMarker>();

        // Name labels only appear once the map is zoomed in far enough that they
        // do not overlap each other. Below the threshold we render the pin alone,
        // which also keeps the clickable area to the pin itself.
        const buildIcon = (pt: MapPoint, withLabel: boolean) =>
          L.divIcon({
            className: 'custom-map-pin',
            html: withLabel ? getPinSvgWithName(pt.type, pt.name) : getPinSvgOnly(pt.type),
            iconSize: withLabel ? [240, 36] : [32, 32],
            iconAnchor: [16, 16],
          });

        MAP_POINTS.forEach((pt) => {
          const customIcon = buildIcon(pt, map.getZoom() >= LABEL_ZOOM_THRESHOLD);

          const popupHtml = `
            <div style="font-family: system-ui, -apple-system, sans-serif; padding: 4px; max-width: 250px;">
              <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #0284c7; margin-bottom: 3px;">
                ${pt.categoryLabel} ${pt.zone ? `• ${pt.zone}` : ''}
              </div>
              <h4 style="margin: 0 0 6px 0; font-size: 14px; font-weight: 700; color: #0f172a; line-height: 1.3;">${pt.name}</h4>
              <p style="margin: 0 0 8px 0; font-size: 11px; color: #475569; line-height: 1.4;">${pt.description}</p>
              ${pt.operator ? `<div style="font-size: 10px; color: #64748b; margin-bottom: 6px;"><strong>Operator:</strong> ${pt.operator}</div>` : ''}
              ${/^\d+$/.test(String(pt.osmId)) ? `<div style="font-size: 10px; font-family: monospace; color: #94a3b8; margin-bottom: 8px;">OSM ${pt.osmType.toUpperCase()} #${pt.osmId}</div>` : `<div style="font-size: 10px; color: #94a3b8; margin-bottom: 8px;">Dzaleka Heritage Site Register</div>`}
              <div style="display: flex; gap: 8px; flex-wrap: wrap; font-size: 11px; border-top: 1px solid #f1f5f9; padding-top: 6px;">
                ${/^\d+$/.test(String(pt.osmId)) ? `<a href="https://www.openstreetmap.org/${pt.osmType}/${pt.osmId}" target="_blank" rel="noopener" style="font-weight: 600; color: #0284c7; text-decoration: none;">OpenStreetMap &rarr;</a>` : ''}
                ${pt.encyclopediaUrl ? `<a href="${pt.encyclopediaUrl}" style="font-weight: 600; color: #0f172a; text-decoration: none;">Encyclopedia &rarr;</a>` : ''}
              </div>
            </div>
          `;

          const marker = L.marker([pt.lat, pt.lng], { icon: customIcon, title: pt.name, alt: pt.name, keyboard: true })
            .bindPopup(popupHtml)
            .addTo(map);

          marker.on('click', () => selectAndFly(pt));

          markersMap.set(pt.id, marker);
        });

        markersRef.current = markersMap;

        // Open focused on a shared place: /map?place=<id>, or ?lat=&lng=
        try {
          const params = new URLSearchParams(window.location.search);
          const placeId = params.get('place');
          const shared = placeId ? MAP_POINTS.find((p) => p.id === placeId) : undefined;
          if (shared) {
            map.setView([shared.lat, shared.lng], 18);
            setSelectedPoint(shared);
            setDestinationPoint(shared);
            setSidebarOpen(true);
            markersMap.get(shared.id)?.openPopup();
          } else {
            const lat = parseFloat(params.get('lat') || '');
            const lng = parseFloat(params.get('lng') || '');
            if (Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180) {
              map.setView([lat, lng], 18);
            }
          }
        } catch {
          // Malformed query string: fall back to the default camp view.
        }

        // Swap pin-only and labelled icons when crossing the zoom threshold.
        let labelsVisible = map.getZoom() >= LABEL_ZOOM_THRESHOLD;
        map.on('zoomend', () => {
          const shouldShow = map.getZoom() >= LABEL_ZOOM_THRESHOLD;
          if (shouldShow === labelsVisible) return;
          labelsVisible = shouldShow;
          MAP_POINTS.forEach((pt) => {
            markersMap.get(pt.id)?.setIcon(buildIcon(pt, shouldShow));
          });
        });
      } catch (err) {
        if (isMounted) setMapError(true);
      }
    };

    initMap();

    return () => {
      isMounted = false;
      resize?.disconnect();
      markersRef.current.clear();
      if (mapRef.current) {
        try {
          mapRef.current.remove();
        } catch (e) {
          // Safe node cleanup
        }
        mapRef.current = null;
      }
    };
  }, []);

  const [route, setRoute] = useState<MapRoute | null>(null);
  const [routeStatus, setRouteStatus] = useState<'idle' | 'loading' | 'ready' | 'error' | 'external'>('idle');
  useEffect(() => {
    routePolylineRef.current?.remove();
    routePolylineRef.current = null;
    setRoute(null);
    setRouteStatus('idle');
    if (!ready || !directionsMode || !destinationPoint) return;
    if (travelMode !== 'driving') { setRouteStatus('external'); return; }
    const controller = new AbortController();
    setRouteStatus('loading');
    const loadRoute = async () => {
      try {
        const response = await fetch(`https://router.project-osrm.org/route/v1/driving/${originPoint.lng},${originPoint.lat};${destinationPoint.lng},${destinationPoint.lat}?overview=full&geometries=geojson&steps=true`, { signal: controller.signal });
        if (!response.ok) throw new Error('Route unavailable');
        const result = parseMapRoute(await response.json());
        if (!result) throw new Error('No road route found');
        const L = (await import('leaflet')).default;
        if (controller.signal.aborted || !mapRef.current) return;
        const line = L.polyline(result.coordinates, { color: '#0284c7', weight: 5, opacity: 0.9 }).addTo(mapRef.current);
        routePolylineRef.current = line;
        mapRef.current.fitBounds(line.getBounds(), { paddingTopLeft: window.innerWidth >= 768 ? [410, 130] : [30, 130], paddingBottomRight: [45, window.innerWidth >= 768 ? 50 : 260] });
        setRoute(result);
        setRouteStatus('ready');
      } catch {
        if (!controller.signal.aborted) setRouteStatus('error');
      }
    };
    loadRoute();
    return () => { controller.abort(); routePolylineRef.current?.remove(); routePolylineRef.current = null; };
  }, [ready, directionsMode, originPoint, destinationPoint, travelMode]);

  const changeTileLayer = async (newLayer: 'satellite' | 'streets' | 'humanitarian') => {
    setActiveLayer(newLayer);
    if (mapRef.current && tileLayerRef.current) {
      const L = (await import('leaflet')).default;
      try {
        mapRef.current.removeLayer(tileLayerRef.current);
      } catch (e) {
        // Safe layer remove
      }

      let url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      let attr = '&copy; OpenStreetMap contributors';

      if (newLayer === 'satellite') {
        url = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
        attr = 'Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics';
      } else if (newLayer === 'humanitarian') {
        url = 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png';
        attr = '&copy; OpenStreetMap contributors | HOT';
      }

      const maxNativeZoom = newLayer === 'satellite' ? 18 : 19;
      const layer = L.tileLayer(url, { attribution: attr, maxZoom: 20, maxNativeZoom }).addTo(mapRef.current);
      tileLayerRef.current = layer;
    }
  };

  const filteredPoints = filterMapPoints(MAP_POINTS, searchQuery, activeCategory);
  const filteredIds = filteredPoints.map((point) => point.id).join('|');
  useEffect(() => {
    if (!ready || !mapRef.current) return;
    const visible = new Set(filteredPoints.map((point) => point.id));
    markersRef.current.forEach((marker, id) => {
      if (visible.has(id)) marker.addTo(mapRef.current!); else marker.remove();
    });
  }, [ready, filteredIds]);

  const suggestions = searchQuery.trim() === ''
    ? filteredPoints.slice(0, 5)
    : filteredPoints.slice(0, 8);

  const selectAndFly = (pt: MapPoint) => {
    setSelectedPoint(pt);
    setDestinationPoint(pt);
    setSearchFocused(false);
    window.history.replaceState(null, '', shareUrlFor(pt));
    setSidebarOpen(true);
    if (mapRef.current) {
      mapRef.current.flyTo([pt.lat, pt.lng], 18, { duration: 1.2 });
      const marker = markersRef.current.get(pt.id);
      if (marker) {
        try {
          marker.openPopup();
        } catch (e) {
          // Safe popup open
        }
      }
    }
  };

  const startDirectionsToPoint = (pt: MapPoint) => {
    setDestinationPoint(pt);
    setSelectedPoint(pt);
    setDirectionsMode(true);
    setSidebarOpen(true);
  };

  const handleGetUserLocation = () => {
    if (!navigator.geolocation) {
      setFeedback('Your browser does not support location access. Choose a start point instead.');
      return;
    }
    setLocatingUser(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userLoc = {
          name: 'My GPS Location',
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setOriginPoint(userLoc);
        setLocatingUser(false);
      },
      () => {
        setFeedback('Your location could not be retrieved. Choose a start point instead.');
        setLocatingUser(false);
      },
      { timeout: 10000, maximumAge: 60000 }
    );
  };

  const handleZoomIn = () => {
    if (mapRef.current) mapRef.current.zoomIn();
  };

  const handleZoomOut = () => {
    if (mapRef.current) mapRef.current.zoomOut();
  };

  const handleRecenter = () => {
    if (mapRef.current) {
      mapRef.current.flyTo([-13.6592, 33.8705], 16, { duration: 1.2 });
    }
  };

  const copyCoordinates = async (lat: number, lng: number) => {
    try { await navigator.clipboard.writeText(`${lat.toFixed(6)}, ${lng.toFixed(6)}`); setCopiedCoords(true); setTimeout(() => setCopiedCoords(false), 2000); }
    catch { setFeedback('Could not copy. Select the displayed coordinates to copy them.'); }
  };

  // Build a link that reopens the map focused on this place.
  const shareUrlFor = (pt: MapPoint) => {
    const base = typeof window !== 'undefined'
      ? `${window.location.origin}${window.location.pathname}`
      : 'https://services.dzaleka.com/map';
    return `${base}?place=${encodeURIComponent(pt.id)}`;
  };

  // Share a place: use the native share sheet where available (mobile),
  // otherwise copy the link to the clipboard.
  const sharePoint = async (pt: MapPoint) => {
    const url = shareUrlFor(pt);
    const shareData = {
      title: pt.name,
      text: `${pt.name} — Dzaleka Refugee Camp (${pt.lat.toFixed(5)}, ${pt.lng.toFixed(5)})`,
      url,
    };
    try {
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share(shareData);
        return;
      }
      await navigator.clipboard.writeText(url);
      setSharedLink(true);
      setTimeout(() => setSharedLink(false), 2000);
    } catch (err) {
      // User dismissed the share sheet, or clipboard was blocked.
      if ((err as Error)?.name === 'AbortError') return;
      try {
        await navigator.clipboard.writeText(url);
        setSharedLink(true);
        setTimeout(() => setSharedLink(false), 2000);
      } catch {
        setFeedback('Could not share. Copy the place link from your address bar.');
      }
    }
  };

  const handlePrintSheet = () => {
    window.print();
  };

  return (
    <div ref={appRef} className="map-browser relative w-full h-full bg-slate-900 overflow-hidden">
      {feedback && <div role="status" className="absolute top-32 right-3 left-3 md:left-auto md:max-w-sm z-40 rounded-lg bg-white p-3 text-sm text-slate-800 shadow-md">{feedback}<button type="button" aria-label="Dismiss message" onClick={() => setFeedback('')} className="ml-2 px-2">×</button></div>}
      {mapError && <p role="alert" className="absolute inset-x-3 top-32 z-40 rounded-lg bg-white p-4 text-sm">The map could not load. Open the places menu or browse the directory below.</p>}
      {/* GLOBAL PRINT STYLES FOR CLEAN PDF OUTPUT */}
      {showPrintModal && <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          .printable-sheet-modal, .printable-sheet-modal * {
            visibility: visible !important;
          }
          .printable-sheet-modal {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            box-shadow: none !important;
            border: none !important;
          }
          dialog:has(.printable-sheet-modal), .printable-sheet-modal * {
            max-height: none !important;
            overflow: visible !important;
          }
          dialog:has(.printable-sheet-modal) {
            position: absolute !important;
            inset: 0 auto auto 0 !important;
            width: 100% !important;
            margin: 0 !important;
          }
          dialog:has(.printable-sheet-modal)::backdrop { display: none; }
          .print-hidden {
            display: none !important;
          }
        }
      `}</style>}

      {/* MAP CANVAS CONTAINER */}
      <div ref={mapContainerRef} role="region" aria-label="Interactive map of Dzaleka: drag to explore or use the zoom controls" className="h-full w-full z-0 print-hidden" style={{ height: '100%', width: '100%' }} />

      {/* TOP FLOATING CONTROLS WRAPPER (MOBILE SWIPEABLE CAROUSEL & DESKTOP FLEX) */}
      <div className="absolute top-3 left-3 right-3 z-30 pointer-events-none flex flex-col gap-2 print-hidden">

        {/* FLOATING PILL SEARCH BAR */}
        <div className="pointer-events-auto relative w-full md:max-w-md">
          <div className="rounded-full bg-white  shadow-md border border-slate-200 focus-within:ring-2 focus-within:ring-primary-800 h-14 px-2 flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
              <svg className="h-3.5 w-3.5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="search"
              aria-label="Search Dzaleka places"
              onKeyDown={(event) => { if (event.key === 'Escape') setSearchFocused(false); }}
              placeholder="Search Dzaleka places & directions..."
              value={searchQuery}
              onFocus={() => setSearchFocused(true)}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSearchFocused(true);
              }}
              style={{ outline: 'none', border: 'none', boxShadow: 'none' }}
              className="w-full bg-transparent text-[16px] sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-0 font-medium border-0 outline-none"
            />
            {searchQuery && (
              <button
                aria-label="Clear search" onClick={() => setSearchQuery('')}
                className="w-11 h-11 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 flex items-center justify-center text-xs font-bold shrink-0"
              >
                ✕
              </button>
            )}
            <button
              onClick={() => {
                setDirectionsMode(!directionsMode);
                setSidebarOpen(true);
              }}
              className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-colors shrink-0 flex items-center gap-1 ${
                directionsMode ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
              title="Get Directions"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
              <span className="hidden sm:inline">Directions</span>
            </button>
            <div className="h-5 w-px bg-slate-200 shrink-0"></div>
            <button
              aria-expanded={sidebarOpen} aria-controls="map-place-panel" onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`w-11 h-11 rounded-full flex items-center justify-center transition-colors shrink-0 ${
                sidebarOpen ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
              title="Toggle Directory Sidebar"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Autocomplete Suggestions Dropdown */}
          {searchFocused && (
            <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden z-50 max-h-80 overflow-y-auto">
              <div className="px-3.5 py-2 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-500 uppercase tracking-wider">
                  {searchQuery ? `Matching Places (${filteredPoints.length})` : 'Popular Locations'}
                </span>
                <button
                  onClick={() => setSearchFocused(false)}
                  className="text-slate-400 hover:text-slate-600 font-bold"
                >
                  Close ✕
                </button>
              </div>
              <div className="divide-y divide-slate-100">
                {suggestions.length === 0 ? (
                  <div className="p-4 text-xs text-slate-400 text-center">
                    No matching places found for "{searchQuery}"
                  </div>
                ) : (
                  suggestions.map((pt) => (
                    <button type="button"
                      key={pt.id}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => selectAndFly(pt)}
                      className="w-full text-left p-3 hover:bg-sky-50/70 cursor-pointer transition-colors flex items-center gap-3 group"
                    >
                      <div className="shrink-0" dangerouslySetInnerHTML={{ __html: getPinSvgOnly(pt.type) }} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <h5 className="text-xs font-bold text-slate-900 group-hover:text-sky-700 truncate">
                            {pt.name}
                          </h5>
                          <span className="text-xs text-slate-400 font-mono shrink-0">#{pt.osmId}</span>
                        </div>
                        <p className="text-xs text-slate-500 truncate mt-0.5">
                          {pt.categoryLabel} {pt.zone ? `• ${pt.zone}` : ''}
                        </p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* MOBILE HORIZONTALLY SWIPEABLE ACTION CHIPS & CATEGORY CAROUSEL */}
        <div className="pointer-events-auto flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 max-w-full">
          {/* COMMUNITY PLACE SUBMISSION FORM BUTTON */}
          <a href="/map/submit"
            className="flex items-center gap-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 text-sm font-semibold shadow-md ring-1 ring-slate-900/10 shrink-0"
            title="Suggest a place or update its details"
          >
            <span className="font-bold text-sm">+</span>
            <span>Suggest a place</span>
          </a>

          {/* PRINTABLE PDF BUTTON */}
          <button
            onClick={() => setShowPrintModal(true)}
            className="flex items-center gap-1.5 rounded-full bg-white hover:bg-slate-50 text-slate-800 px-4 py-2 text-sm font-semibold shadow-md ring-1 ring-slate-200 shrink-0"
          >
            <svg className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            <span>Print directory</span>
          </button>

          {/* EMERGENCY CONTACTS BUTTON */}
          <a href="/get-help-now"
            className="flex items-center gap-1.5 rounded-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 text-sm font-semibold shadow-md ring-1 ring-red-700/20 shrink-0 cursor-pointer"
          >
            <span>Emergency</span>
          </a>

          <div className="h-4 w-px bg-slate-300/60 shrink-0 mx-0.5"></div>

          {/* CATEGORY CHIPS */}
          <button
            aria-pressed={activeCategory === 'all'} onClick={() => setActiveCategory('all')}
            className={`px-3.5 py-1.5 text-sm font-semibold rounded-full shrink-0 ${
              activeCategory === 'all' ? 'bg-slate-900 text-white shadow-2xs' : 'bg-white text-slate-700 border border-slate-200'
            }`}
          >
            All ({MAP_POINTS.length})
          </button>
          <button
            aria-pressed={activeCategory === 'health'} onClick={() => setActiveCategory('health')}
            className={`px-3.5 py-1.5 text-sm font-semibold rounded-full shrink-0 flex items-center gap-1 ${
              activeCategory === 'health' ? 'bg-red-600 text-white shadow-2xs' : 'bg-white text-slate-700 border border-slate-200'
            }`}
          >
            <span className="inline-block w-2 h-2 rounded-full bg-red-500"></span>
            Healthcare
          </button>
          <button
            aria-pressed={activeCategory === 'education'} onClick={() => setActiveCategory('education')}
            className={`px-3.5 py-1.5 text-sm font-semibold rounded-full shrink-0 flex items-center gap-1 ${
              activeCategory === 'education' ? 'bg-sky-600 text-white shadow-2xs' : 'bg-white text-slate-700 border border-slate-200'
            }`}
          >
            <span className="inline-block w-2 h-2 rounded-full bg-sky-500"></span>
            Education
          </button>
          <button
            aria-pressed={activeCategory === 'market'} onClick={() => setActiveCategory('market')}
            className={`px-3.5 py-1.5 text-sm font-semibold rounded-full shrink-0 flex items-center gap-1 ${
              activeCategory === 'market' ? 'bg-green-600 text-white shadow-2xs' : 'bg-white text-slate-700 border border-slate-200'
            }`}
          >
            <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
            Commerce
          </button>
          <button
            aria-pressed={activeCategory === 'service'} onClick={() => setActiveCategory('service')}
            className={`px-3.5 py-1.5 text-sm font-semibold rounded-full shrink-0 flex items-center gap-1 ${
              activeCategory === 'service' ? 'bg-slate-800 text-white shadow-2xs' : 'bg-white text-slate-700 border border-slate-200'
            }`}
          >
            <span className="inline-block w-2 h-2 rounded-full bg-slate-400"></span>
            Services
          </button>
          <button
            aria-pressed={activeCategory === 'culture'} onClick={() => setActiveCategory('culture')}
            className={`px-3.5 py-1.5 text-sm font-semibold rounded-full shrink-0 flex items-center gap-1 ${
              activeCategory === 'culture' ? 'bg-amber-600 text-white shadow-2xs' : 'bg-white text-slate-700 border border-slate-200'
            }`}
          >
            <span className="inline-block w-2 h-2 rounded-full bg-amber-500"></span>
            Culture
          </button>
        </div>
      </div>

      {/* FLOATING MAP LAYER SWITCHER (LEFT BOTTOM CORNER ON MOBILE) */}
      <div className="absolute left-3 bottom-8 z-20 print-hidden">
        <div className="flex items-center bg-white  rounded-full shadow-lg border border-slate-200 p-1 text-xs font-semibold">
          <button
            aria-pressed={activeLayer === 'satellite'} onClick={() => changeTileLayer('satellite')}
            className={`px-2.5 py-1 rounded-full transition-colors ${
              activeLayer === 'satellite' ? 'bg-slate-900 text-white shadow-2xs' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            Satellite
          </button>
          <button
            aria-pressed={activeLayer === 'streets'} onClick={() => changeTileLayer('streets')}
            className={`px-2.5 py-1 rounded-full transition-colors ${
              activeLayer === 'streets' ? 'bg-slate-900 text-white shadow-2xs' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            Map
          </button>
          <button
            aria-pressed={activeLayer === 'humanitarian'} onClick={() => changeTileLayer('humanitarian')}
            className={`px-2.5 py-1 rounded-full transition-colors ${
              activeLayer === 'humanitarian' ? 'bg-slate-900 text-white shadow-2xs' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            Humanitarian
          </button>
        </div>
      </div>

      {/* RIGHT SIDE NAVIGATION CONTROLS */}
      <div className="absolute right-3 bottom-8 z-20 flex flex-col gap-2 print-hidden">
        <button
          onClick={handleRecenter}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white  text-slate-800 shadow-lg border border-slate-200 hover:bg-slate-100 transition-colors"
          title="Center Map on Dzaleka"
        >
          <svg className="h-5 w-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle cx="12" cy="12" r="3" strokeWidth={2} />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v3m0 14v3m10-10h-3M5 12H2" />
          </svg>
        </button>
        <button
          onClick={handleZoomIn}
          className="flex h-11 w-11 items-center justify-center rounded-t-xl bg-white  text-slate-800 shadow-lg border border-slate-200 hover:bg-slate-100 transition-colors font-bold text-lg"
          title="Zoom In"
        >
          +
        </button>
        <button
          onClick={handleZoomOut}
          className="flex h-11 w-11 items-center justify-center rounded-b-xl bg-white  text-slate-800 shadow-lg border border-slate-200 border-t-0 hover:bg-slate-100 transition-colors font-bold text-lg"
          title="Zoom Out"
        >
          −
        </button>
        <button
          onClick={toggleFullscreen}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white  text-slate-800 shadow-lg border border-slate-200 hover:bg-slate-100 transition-colors mt-1"
          title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Map'}
        >
          <svg className="h-4 w-4 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4h4M20 8V4h-4M4 16v4h4M20 16v4h-4" />
          </svg>
        </button>
      </div>

      {/* RESPONSIVE SIDEBAR / MOBILE BOTTOM DRAWER */}
      {sidebarOpen && (
        <div id="map-place-panel" className="absolute inset-x-3 bottom-3 top-auto max-h-[55%] md:max-h-none md:top-32 md:bottom-8 md:left-3 md:right-auto md:w-96 rounded-2xl bg-white shadow-lg border border-slate-200/90 flex flex-col overflow-hidden z-20 print-hidden">

          {/* Mobile Handle Drag Line */}
          <div className="w-12 h-1 bg-slate-300 rounded-full mx-auto my-2 md:hidden"></div>

          {/* DIRECTIONS MODE PANEL */}
          {directionsMode ? (
            <div className="flex-1 overflow-y-auto flex flex-col justify-between p-4">
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-sky-600 "></span>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                      Directions
                    </h3>
                  </div>
                  <button
                    onClick={() => { setDirectionsMode(false); setSidebarOpen(false); }}
                    className="text-xs font-semibold text-slate-400 hover:text-slate-700"
                  >
                    Close ✕
                  </button>
                </div>

                {/* Travel Mode Pills */}
                <div className="mt-3 grid grid-cols-3 gap-1 rounded-xl bg-slate-100 p-1 text-xs font-semibold">
                  <button
                    aria-pressed={travelMode === 'driving'} onClick={() => setTravelMode('driving')}
                    className={`py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                      travelMode === 'driving' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 114 0" />
                    </svg>
                    Driving
                  </button>
                  <button
                    aria-pressed={travelMode === 'walking'} onClick={() => setTravelMode('walking')}
                    className={`py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                      travelMode === 'walking' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6h12a6 6 0 00-6-6z" />
                    </svg>
                    Walking
                  </button>
                  <button
                    aria-pressed={travelMode === 'transit'} onClick={() => setTravelMode('transit')}
                    className={`py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                      travelMode === 'transit' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                    Transit
                  </button>
                </div>

                {/* Origin & Destination Inputs */}
                <div className="mt-4 space-y-2.5">
                  {/* Origin A */}
                  <div className="rounded-xl border border-slate-200 p-2.5 bg-slate-50/70">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1">
                      <span className="flex items-center gap-1.5 text-green-700 font-bold">
                        <span className="w-2.5 h-2.5 rounded-full bg-green-600 inline-block"></span>
                        START POINT (A)
                      </span>
                      <button
                        onClick={handleGetUserLocation}
                        className="text-sky-700 hover:underline flex items-center gap-1 text-xs"
                      >
                        {locatingUser ? 'Locating...' : '📍 My GPS'}
                      </button>
                    </div>
                    <select
                      aria-label="Start point"
                      value={originPoint.name}
                      onChange={(e) => {
                        const allOptions = [
                          ...DEFAULT_ORIGINS,
                          ...MAP_POINTS.map((pt) => ({ name: pt.name, lat: pt.lat, lng: pt.lng }))
                        ];
                        const found = allOptions.find((o) => o.name === e.target.value);
                        if (found) setOriginPoint(found);
                      }}
                      className="w-full bg-white rounded-lg border border-slate-300 p-1.5 text-[16px] sm:text-sm text-slate-900 font-semibold focus:outline-none focus:border-sky-500"
                    >
                      {!DEFAULT_ORIGINS.some((point) => point.name === originPoint.name) && !MAP_POINTS.some((point) => point.name === originPoint.name) && <option value={originPoint.name}>{originPoint.name}</option>}
                      <optgroup label="Primary Gates & Centers">
                        {DEFAULT_ORIGINS.map((orig) => (
                          <option key={orig.name} value={orig.name}>
                            {orig.name} ({orig.lat.toFixed(3)}, {orig.lng.toFixed(3)})
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="Community Facilities & Places in Camp">
                        {MAP_POINTS.map((pt) => (
                          <option key={`orig-${pt.id}`} value={pt.name}>
                            {pt.name} ({pt.categoryLabel})
                          </option>
                        ))}
                      </optgroup>
                    </select>
                  </div>

                  {/* Swap A <-> B Button */}
                  <div className="flex justify-center -my-1">
                    <button
                      type="button"
                      onClick={() => {
                        if (!destinationPoint) return;
                        const prevOriginName = originPoint.name;
                        const prevOriginLat = originPoint.lat;
                        const prevOriginLng = originPoint.lng;

                        setOriginPoint({
                          name: destinationPoint.name,
                          lat: destinationPoint.lat,
                          lng: destinationPoint.lng
                        });

                        const matchingDest = MAP_POINTS.find(p => p.name === prevOriginName || (p.lat === prevOriginLat && p.lng === prevOriginLng));
                        setDestinationPoint(matchingDest || { id: 'custom-origin', name: prevOriginName, lat: prevOriginLat, lng: prevOriginLng, type: 'service', categoryLabel: 'Start point', description: '', zone: '', osmId: '', osmType: '' });
                      }}
                      className="rounded-full bg-white border border-slate-300 p-1.5 text-slate-600 hover:text-sky-600 hover:bg-slate-50 shadow-xs transition-colors flex items-center gap-1 text-xs font-bold px-3"
                      title="Swap Start (A) and Destination (B)"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                      </svg>
                      <span>Swap A ⇄ B</span>
                    </button>
                  </div>

                  {/* Destination B */}
                  <div className="rounded-xl border border-slate-200 p-2.5 bg-slate-50/70">
                    <div className="text-xs font-semibold text-red-700 flex items-center gap-1.5 mb-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block"></span>
                      DESTINATION (B)
                    </div>
                    <select
                      aria-label="Destination"
                      value={destinationPoint?.id || ''}
                      onChange={(e) => {
                        const found = MAP_POINTS.find((p) => p.id === e.target.value);
                        if (found) {
                          setDestinationPoint(found);
                          setSelectedPoint(found);
                        }
                      }}
                      className="w-full bg-white rounded-lg border border-slate-300 p-1.5 text-[16px] sm:text-sm text-slate-900 font-semibold focus:outline-none focus:border-sky-500"
                    >
                      {destinationPoint?.id === 'custom-origin' && <option value="custom-origin">{destinationPoint.name}</option>}
                      {MAP_POINTS.map((pt) => (
                        <option key={`dest-${pt.id}`} value={pt.id}>
                          {pt.name} ({pt.categoryLabel})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700" role="status">
                  {routeStatus === 'loading' && <p>Finding a road route…</p>}
                  {routeStatus === 'error' && <p>A road route could not be loaded. Open Google Maps below to check directions.</p>}
                  {routeStatus === 'external' && <p>Open Google Maps below for {travelMode === 'walking' ? 'walking directions' : 'available transit options'}.</p>}
                  {routeStatus === 'ready' && route && <>
                    <p className="text-lg font-semibold text-slate-900">{Math.ceil(route.duration / 60)} min <span className="font-normal text-slate-600">· {(route.distance / 1000).toFixed(1)} km</span></p>
                    <p className="mt-1">Estimated driving route · OSRM / OpenStreetMap</p>
                    <ol className="mt-4 space-y-3 list-decimal pl-5">{route.steps.map((step, index) => <li key={index}><span className="capitalize">{step.maneuver.type} {step.maneuver.modifier || ''}</span>{step.name ? ` on ${step.name}` : ''}{step.distance > 0 ? ` · ${Math.round(step.distance)} m` : ''}</li>)}</ol>
                  </>}
                </div>
              </div>

              {/* Navigation Launch Action Buttons */}
              {destinationPoint && (
                <div className="mt-4 flex flex-col gap-2">
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&origin=${originPoint.lat},${originPoint.lng}&destination=${destinationPoint.lat},${destinationPoint.lng}&travelmode=${travelMode}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-slate-800 transition-colors w-full"
                  >
                    <svg className="h-4 w-4 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                    <span>Open in Google Maps</span>
                  </a>
                  {travelMode === 'driving' && <div className="grid grid-cols-2 gap-2 text-xs">
                    <a
                      href={`https://maps.apple.com/?saddr=${originPoint.lat},${originPoint.lng}&daddr=${destinationPoint.lat},${destinationPoint.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1 rounded-lg border border-slate-300 bg-white py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50 transition-colors"
                    >
                      <span>Apple Maps</span>
                    </a>
                    <a
                      href={`https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${originPoint.lat}%2C${originPoint.lng}%3B${destinationPoint.lat}%2C${destinationPoint.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1 rounded-lg border border-slate-300 bg-white py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50 transition-colors"
                    >
                      <span>OpenStreetMap</span>
                    </a>
                  </div>}
                </div>
              )}
            </div>
          ) : selectedPoint ? (
            /* PLACE DETAILS CARD */
            <div className="flex-1 overflow-y-auto p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    {selectedPoint.categoryLabel}
                  </span>
                  <button
                    onClick={() => setSelectedPoint(null)}
                    className="text-xs text-sky-700 font-semibold hover:underline"
                  >
                    &larr; All places
                  </button>
                </div>

                <h3 className="mt-3 text-base font-bold text-slate-950 leading-snug">
                  {selectedPoint.name}
                </h3>
                <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                  {selectedPoint.description}
                </p>

                <div className="mt-4 space-y-2 rounded-xl bg-slate-50 p-3 text-xs border border-slate-200/80">
                  <div className="flex flex-wrap justify-between gap-x-4 gap-y-1 text-slate-600">
                    <span className="font-semibold text-slate-500">Zone / Sector:</span>
                    <span>{selectedPoint.zone || 'Dzaleka Sector'}</span>
                  </div>
                  {selectedPoint.operator && (
                    <div className="flex flex-wrap justify-between gap-x-4 gap-y-1 text-slate-600">
                      <span className="font-semibold text-slate-500">Operator:</span>
                      <span>{selectedPoint.operator}</span>
                    </div>
                  )}
                  <div className="flex flex-wrap justify-between items-center gap-x-4 gap-y-1 text-slate-600">
                    <span className="font-semibold text-slate-500">GPS Coordinates:</span>
                    <button
                      onClick={() => copyCoordinates(selectedPoint.lat, selectedPoint.lng)}
                      className="font-mono text-xs text-sky-700 hover:underline flex items-center gap-1"
                    >
                      {selectedPoint.lat.toFixed(5)}, {selectedPoint.lng.toFixed(5)}
                      <span>{copiedCoords ? '(Copied)' : '📋'}</span>
                    </button>
                  </div>
                  <div className="flex flex-wrap justify-between gap-x-4 gap-y-1 text-slate-600">
                    <span className="font-semibold text-slate-500">Source:</span>
                    {/^\d+$/.test(String(selectedPoint.osmId)) ? (
                      <span className="font-mono text-[0.9em]">OpenStreetMap {selectedPoint.osmType.toUpperCase()} #{selectedPoint.osmId}</span>
                    ) : (
                      <span>Dzaleka Heritage Site Register</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col gap-2">
                <button
                  onClick={() => startDirectionsToPoint(selectedPoint)}
                  className="flex items-center justify-center gap-2 rounded-lg bg-sky-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-sky-500 transition-colors w-full"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                  <span>Get directions</span>
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => sharePoint(selectedPoint)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50 transition-colors"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342a3 3 0 100-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684zm0-12a3 3 0 105.368-2.684 3 3 0 00-5.368 2.684z" />
                    </svg>
                    <span>{sharedLink ? 'Link copied' : 'Share location'}</span>
                  </button>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${selectedPoint.lat},${selectedPoint.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50 transition-colors"
                  >
                    <span>Open in Google Maps</span>
                  </a>
                </div>
                {/^\d+$/.test(String(selectedPoint.osmId)) && (
                  <a
                    href={`https://www.openstreetmap.org/${selectedPoint.osmType}/${selectedPoint.osmId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 w-full"
                  >
                    <span>View on OpenStreetMap</span>
                  </a>
                )}
                {selectedPoint.encyclopediaUrl && (
                  <a
                    href={selectedPoint.encyclopediaUrl}
                    className="flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-900 hover:bg-slate-50 transition-colors w-full"
                  >
                    <span>Read the history entry</span>
                  </a>
                )}
              </div>
            </div>
          ) : (
            /* LIST OF ALL FACILITIES */
            <div className="flex-1 overflow-y-auto p-2 divide-y divide-slate-100 space-y-1">
              <div className="p-2 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-500 uppercase tracking-wider">
                  Dzaleka Infrastructure
                </span>
                <div className="flex items-center gap-2">
                  <a href="/map/submit"
                    className="px-2 py-0.5 rounded bg-green-600 text-white font-bold text-xs hover:bg-green-700"
                  >
                    + Suggest Place
                  </a>
                  <span className="font-mono text-slate-400">{filteredPoints.length}</span>
                </div>
              </div>
              {filteredPoints.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400">
                  No places found matching "{searchQuery}".
                </div>
              ) : (
                filteredPoints.map((pt) => (
                  <div
                    key={pt.id}
                    className="p-2.5 rounded-lg cursor-pointer transition-colors hover:bg-slate-50 flex items-start justify-between gap-2"
                  >
                    <button type="button" onClick={() => selectAndFly(pt)} className="min-w-0 flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                          {pt.categoryLabel}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">#{pt.osmId}</span>
                      </div>
                      <h4 className="mt-1 font-bold text-slate-900 text-xs hover:text-sky-700 truncate">
                        {pt.name}
                      </h4>
                      <p className="mt-0.5 text-xs leading-4 text-slate-600 line-clamp-1">
                        {pt.description}
                      </p>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        startDirectionsToPoint(pt);
                      }}
                      className="p-1.5 text-sky-700 hover:bg-sky-50 rounded-lg shrink-0 mt-1"
                      title="Directions"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}

      {/* PRINTABLE PDF MAP SHEET GENERATOR MODAL */}
      {showPrintModal && (
        <Modal label="Printable place directory" onClose={() => setShowPrintModal(false)}><div className="printable-sheet-modal">
          <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[95vh] flex flex-col">

            {/* Modal Header Bar (Hidden in Print) */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between print-hidden shrink-0 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                <h3 className="font-bold text-sm tracking-tight text-white">
                  Printable place directory
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrintSheet}
                  className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 shadow-2xs transition-colors"
                >
                  Print / Save as PDF
                </button>
                <button
                  aria-label="Close print directory" onClick={() => setShowPrintModal(false)}
                  className="text-slate-400 hover:text-white p-1 rounded font-bold text-xs"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Printable Map Sheet Document Content */}
            <div className="p-6 md:p-8 space-y-6 text-slate-900 bg-white overflow-y-auto flex-1">

              {/* Document Title Header */}
              <div className="border-b-2 border-slate-900 pb-4 flex flex-col md:flex-row justify-between items-start md:items-end gap-2">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                    Dzaleka Online Services
                  </span>
                  <h2 className="text-2xl font-bold tracking-tight text-slate-950 mt-1">
                    Dzaleka place directory
                  </h2>
                  <p className="text-xs text-slate-600 mt-1">
                    Places and coordinates from OpenStreetMap and the heritage register.
                  </p>
                </div>
                <div className="text-left md:text-right font-mono text-xs text-slate-600">
                  <div><strong>GPS Center:</strong> 13.6592° S, 33.8705° E</div>
                  <div><strong>Location:</strong> Dowa District, Central Region, Malawi</div>

                </div>
              </div>

              {/* Key Facilities Table */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
                  Places ({MAP_POINTS.length})
                </h3>
                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 border-b border-slate-200 font-semibold text-slate-700">
                      <tr>
                        <th className="py-2.5 px-3">Facility Name</th>
                        <th className="py-2.5 px-3">Category</th>
                        <th className="py-2.5 px-3">Zone / Sector</th>
                        <th className="py-2.5 px-3">GPS Coordinates</th>
                        <th className="py-2.5 px-3">OSM Record</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {MAP_POINTS.map((pt) => (
                        <tr key={pt.id} className="hover:bg-slate-50">
                          <td className="py-2 px-3 font-semibold text-slate-900">{pt.name}</td>
                          <td className="py-2 px-3">
                            <span className="px-2 py-0.5 rounded text-xs font-semibold uppercase bg-slate-100 border border-slate-200 text-slate-700">
                              {pt.categoryLabel}
                            </span>
                          </td>
                          <td className="py-2 px-3 text-slate-600">{pt.zone || 'Dzaleka Sector'}</td>
                          <td className="py-2 px-3 font-mono text-xs text-slate-700">
                            {pt.lat.toFixed(4)}, {pt.lng.toFixed(4)}
                          </td>
                          <td className="py-2 px-3 font-mono text-xs text-slate-600">
                            #{pt.osmId}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Footer Stamp */}
              <div className="pt-4 border-t border-slate-200 flex justify-between items-center text-xs text-slate-400">
                <span>services.dzaleka.com/map</span>
                <span>OpenStreetMap &copy; Contributors | Esri World Imagery</span>
              </div>
            </div>

          </div>
        </div></Modal>
      )}


    </div>
  );
}

// HAVERSINE DISTANCE CALCULATOR IN KM
// GOOGLE MAPS STYLE PIN WITH SVG BADGE + LOCATION NAME PILL
function getPinSvgWithName(type: MapPoint['type'], name: string): string {
  const badgeHtml = getPinSvgOnly(type);
  return `<div style="
    display: flex;
    align-items: center;
    gap: 6px;
    white-space: nowrap;
    pointer-events: auto;
    cursor: pointer;
  ">
    ${badgeHtml}
    <span style="
      background-color: rgba(255, 255, 255, 0.98);
      color: #0f172a;
      font-weight: 700;
      font-size: 11px;
      padding: 3px 8px;
      border-radius: 9999px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.12);
      border: 1px solid rgba(226, 232, 240, 0.9);
      letter-spacing: -0.01em;
    ">${name}</span>
  </div>`;
}

function getPinSvgOnly(type: MapPoint['type']): string {
  switch (type) {
    case 'health':
      return `<div style="
        background-color: #dc2626;
        width: 32px;
        height: 32px;
        min-width: 32px;
        min-height: 32px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 1px 3px rgba(0,0,0,0.12);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        flex-shrink: 0;
        box-sizing: border-box;
      ">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
      </div>`;
    case 'education':
      return `<div style="
        background-color: #0284c7;
        width: 32px;
        height: 32px;
        min-width: 32px;
        min-height: 32px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 1px 3px rgba(0,0,0,0.12);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        flex-shrink: 0;
        box-sizing: border-box;
      ">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
          <path d="M6 12v5c3 3 9 3 12 0v-5"/>
        </svg>
      </div>`;
    case 'market':
      return `<div style="
        background-color: #059669;
        width: 32px;
        height: 32px;
        min-width: 32px;
        min-height: 32px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 1px 3px rgba(0,0,0,0.12);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        flex-shrink: 0;
        box-sizing: border-box;
      ">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <path d="M16 10a4 4 0 0 1-8 0"/>
        </svg>
      </div>`;
    case 'service':
      return `<div style="
        background-color: #0f172a;
        width: 32px;
        height: 32px;
        min-width: 32px;
        min-height: 32px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 1px 3px rgba(0,0,0,0.12);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        flex-shrink: 0;
        box-sizing: border-box;
      ">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="4" y="2" width="16" height="20" rx="2"/>
          <line x1="9" y1="6" x2="9" y2="6.01"/>
          <line x1="15" y1="6" x2="15" y2="6.01"/>
          <line x1="9" y1="10" x2="9" y2="10.01"/>
          <line x1="15" y1="10" x2="15" y2="10.01"/>
          <path d="M10 22v-4h4v4"/>
        </svg>
      </div>`;
    case 'culture':
      return `<div style="
        background-color: #7c3aed;
        width: 32px;
        height: 32px;
        min-width: 32px;
        min-height: 32px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 1px 3px rgba(0,0,0,0.12);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        flex-shrink: 0;
        box-sizing: border-box;
      ">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 21h18M3 10h18M5 10v11M9 10v11M15 10v11M19 10v11M12 3l9 7H3z"/>
        </svg>
      </div>`;
    default:
      return `<div style="
        background-color: #475569;
        width: 32px;
        height: 32px;
        min-width: 32px;
        min-height: 32px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 3px 8px rgba(0,0,0,0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        flex-shrink: 0;
        box-sizing: border-box;
      ">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
      </div>`;
  }
}

export function filterMapPoints(points: MapPoint[], query: string, category: string) {
  const text = query.trim().toLowerCase();
  return points.filter((point) => (category === 'all' || point.type === category)
    && (!text || [point.name, point.categoryLabel, point.description, point.zone, point.osmId].join(' ').toLowerCase().includes(text)));
}
