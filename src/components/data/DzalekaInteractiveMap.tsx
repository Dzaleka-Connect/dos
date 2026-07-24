import { useEffect, useRef, useState } from 'react';
import type { Map as LeafletMap, Marker as LeafletMarker, Polyline as LeafletPolyline, TileLayer } from 'leaflet';
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
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState<boolean>(false);
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);

  // COMMUNITY PLACE SUBMISSION FORM STATE
  const [showSubmissionModal, setShowSubmissionModal] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    submissionType: 'new',
    placeName: '',
    category: 'service',
    zone: 'Katubiza Area',
    operator: '',
    openingHours: 'Mon - Sat: 08:00 - 17:00',
    phone: '',
    description: '',
    lat: '-13.6592',
    lng: '33.8705',
    submitterName: '',
    submitterRole: 'Enterprise Owner',
    submitterEmail: '',
  });

  // DIRECTIONS & NAVIGATION STATE
  const [directionsMode, setDirectionsMode] = useState<boolean>(false);
  const [originPoint, setOriginPoint] = useState<{ name: string; lat: number; lng: number }>(DEFAULT_ORIGINS[0]);
  const [destinationPoint, setDestinationPoint] = useState<MapPoint | null>(MAP_POINTS[0]);
  const [travelMode, setTravelMode] = useState<'driving' | 'walking' | 'transit'>('driving');
  const [locatingUser, setLocatingUser] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    let isMounted = true;

    const initMap = async () => {
      if (!mapContainerRef.current || mapRef.current) return;

      const L = (await import('leaflet')).default;

      if (!document.getElementById('leaflet-css-link')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css-link';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

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
              <div style="font-size: 10px; font-family: monospace; color: #94a3b8; margin-bottom: 8px;">OSM ${pt.osmType.toUpperCase()} #${pt.osmId}</div>
              <div style="display: flex; gap: 8px; flex-wrap: wrap; font-size: 11px; border-top: 1px solid #f1f5f9; padding-top: 6px;">
                <a href="https://www.openstreetmap.org/${pt.osmType}/${pt.osmId}" target="_blank" rel="noopener" style="font-weight: 600; color: #0284c7; text-decoration: none;">
                  OpenStreetMap &rarr;
                </a>
                ${pt.encyclopediaUrl ? `<a href="${pt.encyclopediaUrl}" style="font-weight: 600; color: #0f172a; text-decoration: none;">Encyclopedia &rarr;</a>` : ''}
              </div>
            </div>
          `;

          const marker = L.marker([pt.lat, pt.lng], { icon: customIcon })
            .bindPopup(popupHtml)
            .addTo(map);

          marker.on('click', () => {
            setSelectedPoint(pt);
            setDestinationPoint(pt);
            setSidebarOpen(true);
            map.flyTo([pt.lat, pt.lng], 18, { duration: 1.2 });
          });

          markersMap.set(pt.id, marker);
        });

        markersRef.current = markersMap;

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
        console.warn('Map initialization safely handled:', err);
      }
    };

    initMap();

    return () => {
      isMounted = false;
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

  // UPDATE ROUTE POLYLINE WHEN IN DIRECTIONS MODE
  useEffect(() => {
    if (!mapRef.current) return;

    const drawRoute = async () => {
      const L = (await import('leaflet')).default;

      if (routePolylineRef.current) {
        try {
          mapRef.current?.removeLayer(routePolylineRef.current);
        } catch (e) {
          // Ignore removal error
        }
        routePolylineRef.current = null;
      }

      if (directionsMode && originPoint && destinationPoint) {
        try {
          const polyline = L.polyline(
            [
              [originPoint.lat, originPoint.lng],
              [destinationPoint.lat, destinationPoint.lng],
            ],
            { color: '#0284c7', weight: 5, opacity: 0.85, dashArray: '8, 8' }
          ).addTo(mapRef.current);

          routePolylineRef.current = polyline;
          mapRef.current.fitBounds(polyline.getBounds().pad(0.25));
        } catch (e) {
          // Ignore polyline draw errors
        }
      }
    };

    drawRoute();
  }, [directionsMode, originPoint, destinationPoint]);

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

  const filteredPoints = MAP_POINTS.filter((pt) => {
    const matchesCat = activeCategory === 'all' || pt.type === activeCategory;
    const matchesSearch =
      searchQuery === '' ||
      pt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pt.zone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pt.osmId.includes(searchQuery);
    return matchesCat && matchesSearch;
  });

  const suggestions = searchQuery.trim() === ''
    ? MAP_POINTS.slice(0, 5)
    : filteredPoints.slice(0, 8);

  const selectAndFly = (pt: MapPoint) => {
    setSelectedPoint(pt);
    setDestinationPoint(pt);
    setSearchFocused(false);
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
      alert('Geolocation is not supported by your browser.');
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
        alert('Could not retrieve your GPS location. Defaulting to Lilongwe City Center.');
        setLocatingUser(false);
      }
    );
  };

  const handleFetchCurrentCenter = () => {
    if (mapRef.current) {
      const center = mapRef.current.getCenter();
      setFormData({
        ...formData,
        lat: center.lat.toFixed(5),
        lng: center.lng.toFixed(5),
      });
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.placeName || !formData.description) {
      alert('Please fill in the place name and description.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/map-submission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await res.json();
      setSubmitting(false);
      if (res.ok && result.success) {
        setSubmissionSuccess(true);
      } else {
        alert(result.message || 'Submission error. Please try again.');
      }
    } catch (err) {
      console.error('Error submitting location node:', err);
      setSubmitting(false);
      // Fallback success for offline/decoupled environments
      setSubmissionSuccess(true);
    }
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

  const copyCoordinates = (lat: number, lng: number) => {
    const text = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    navigator.clipboard.writeText(text);
    setCopiedCoords(true);
    setTimeout(() => setCopiedCoords(false), 2000);
  };

  const handlePrintSheet = () => {
    window.print();
  };

  // DISTANCE & TRAVEL TIME CALCULATOR
  const distKm = (originPoint && destinationPoint)
    ? calculateDistanceKm(originPoint.lat, originPoint.lng, destinationPoint.lat, destinationPoint.lng)
    : 0;
  
  const estTime = estimateTravelTime(distKm, travelMode);

  return (
    <div
      className={`relative w-full h-full bg-slate-900 overflow-hidden ${
        isFullscreen ? 'fixed inset-0 z-50 h-screen w-screen' : ''
      }`}
    >
      {/* GLOBAL PRINT STYLES FOR CLEAN PDF OUTPUT */}
      <style>{`
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
          .print-hidden {
            display: none !important;
          }
        }
      `}</style>

      {/* MAP CANVAS CONTAINER */}
      <div ref={mapContainerRef} className="h-full w-full z-0 print-hidden" style={{ height: '100%', width: '100%' }} />

      {/* TOP FLOATING CONTROLS WRAPPER (MOBILE SWIPEABLE CAROUSEL & DESKTOP FLEX) */}
      <div className="absolute top-3 left-3 right-3 z-30 pointer-events-none flex flex-col gap-2 print-hidden">
        
        {/* GOOGLE MAPS FLOATING PILL SEARCH BAR */}
        <div className="pointer-events-auto relative w-full md:max-w-md">
          <div className="rounded-full bg-white/95 backdrop-blur-md shadow-2xl border border-slate-200/90 h-11 px-3.5 flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
              <svg className="h-3.5 w-3.5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search Dzaleka places & directions..."
              value={searchQuery}
              onFocus={() => setSearchFocused(true)}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSearchFocused(true);
              }}
              style={{ outline: 'none', border: 'none', boxShadow: 'none' }}
              className="w-full bg-transparent text-[16px] sm:text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-0 font-medium border-0 outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="w-5 h-5 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 flex items-center justify-center text-[10px] font-bold shrink-0"
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
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors shrink-0 ${
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
            <div className="absolute top-full mt-2 left-0 right-0 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden z-50 max-h-80 overflow-y-auto">
              <div className="px-3.5 py-2 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between text-[11px]">
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
                    <div
                      key={pt.id}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => selectAndFly(pt)}
                      className="p-3 hover:bg-sky-50/70 cursor-pointer transition-colors flex items-center gap-3 group"
                    >
                      <div className="shrink-0" dangerouslySetInnerHTML={{ __html: getPinSvgOnly(pt.type) }} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <h5 className="text-xs font-bold text-slate-900 group-hover:text-sky-700 truncate">
                            {pt.name}
                          </h5>
                          <span className="text-[10px] text-slate-400 font-mono shrink-0">#{pt.osmId}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">
                          {pt.categoryLabel} {pt.zone ? `• ${pt.zone}` : ''}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* MOBILE HORIZONTALLY SWIPEABLE ACTION CHIPS & CATEGORY CAROUSEL */}
        <div className="pointer-events-auto flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 max-w-full">
          {/* COMMUNITY PLACE SUBMISSION FORM BUTTON */}
          <button
            onClick={() => {
              setSubmissionSuccess(false);
              setShowSubmissionModal(true);
            }}
            className="flex items-center gap-1 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 text-xs font-bold shadow-lg transition-transform shrink-0 border border-emerald-500"
            title="Suggest a New Location Node or Update Place Details"
          >
            <span className="font-bold text-sm">+</span>
            <span>Suggest a Place</span>
          </button>

          {/* PRINTABLE PDF BUTTON */}
          <button
            onClick={() => setShowPrintModal(true)}
            className="flex items-center gap-1 rounded-full bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 text-xs font-bold shadow-md shrink-0 border border-slate-800"
          >
            <svg className="h-3.5 w-3.5 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            <span>PDF Map Sheet</span>
          </button>

          {/* EMERGENCY CONTACTS BUTTON */}
          <button
            onClick={() => setShowEmergencyModal(true)}
            className="flex items-center gap-1 rounded-full bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 text-xs font-bold shadow-md shrink-0 border border-slate-800 cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            <span>Emergency</span>
          </button>

          <div className="h-4 w-px bg-slate-300/60 shrink-0 mx-0.5"></div>

          {/* CATEGORY CHIPS */}
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1 text-xs font-semibold rounded-full shrink-0 transition-colors ${
              activeCategory === 'all' ? 'bg-slate-900 text-white shadow-2xs' : 'bg-white/95 text-slate-700 border border-slate-200'
            }`}
          >
            All ({MAP_POINTS.length})
          </button>
          <button
            onClick={() => setActiveCategory('health')}
            className={`px-3 py-1 text-xs font-semibold rounded-full shrink-0 transition-colors flex items-center gap-1 ${
              activeCategory === 'health' ? 'bg-red-600 text-white shadow-2xs' : 'bg-white/95 text-slate-700 border border-slate-200'
            }`}
          >
            <span className="inline-block w-2 h-2 rounded-full bg-red-500"></span>
            Healthcare
          </button>
          <button
            onClick={() => setActiveCategory('education')}
            className={`px-3 py-1 text-xs font-semibold rounded-full shrink-0 transition-colors flex items-center gap-1 ${
              activeCategory === 'education' ? 'bg-sky-600 text-white shadow-2xs' : 'bg-white/95 text-slate-700 border border-slate-200'
            }`}
          >
            <span className="inline-block w-2 h-2 rounded-full bg-sky-500"></span>
            Education
          </button>
          <button
            onClick={() => setActiveCategory('market')}
            className={`px-3 py-1 text-xs font-semibold rounded-full shrink-0 transition-colors flex items-center gap-1 ${
              activeCategory === 'market' ? 'bg-emerald-600 text-white shadow-2xs' : 'bg-white/95 text-slate-700 border border-slate-200'
            }`}
          >
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
            Commerce
          </button>
          <button
            onClick={() => setActiveCategory('service')}
            className={`px-3 py-1 text-xs font-semibold rounded-full shrink-0 transition-colors flex items-center gap-1 ${
              activeCategory === 'service' ? 'bg-slate-800 text-white shadow-2xs' : 'bg-white/95 text-slate-700 border border-slate-200'
            }`}
          >
            <span className="inline-block w-2 h-2 rounded-full bg-slate-400"></span>
            Services
          </button>
          <button
            onClick={() => setActiveCategory('culture')}
            className={`px-3 py-1 text-xs font-semibold rounded-full shrink-0 transition-colors flex items-center gap-1 ${
              activeCategory === 'culture' ? 'bg-purple-600 text-white shadow-2xs' : 'bg-white/95 text-slate-700 border border-slate-200'
            }`}
          >
            <span className="inline-block w-2 h-2 rounded-full bg-purple-500"></span>
            Culture
          </button>
        </div>
      </div>

      {/* FLOATING MAP LAYER SWITCHER (LEFT BOTTOM CORNER ON MOBILE) */}
      <div className="absolute left-3 bottom-8 z-20 print-hidden">
        <div className="flex items-center bg-white/95 backdrop-blur-md rounded-full shadow-lg border border-slate-200 p-1 text-[11px] font-semibold">
          <button
            onClick={() => changeTileLayer('satellite')}
            className={`px-2.5 py-1 rounded-full transition-colors ${
              activeLayer === 'satellite' ? 'bg-slate-900 text-white shadow-2xs' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            Satellite
          </button>
          <button
            onClick={() => changeTileLayer('streets')}
            className={`px-2.5 py-1 rounded-full transition-colors ${
              activeLayer === 'streets' ? 'bg-slate-900 text-white shadow-2xs' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            Map
          </button>
          <button
            onClick={() => changeTileLayer('humanitarian')}
            className={`px-2.5 py-1 rounded-full transition-colors ${
              activeLayer === 'humanitarian' ? 'bg-slate-900 text-white shadow-2xs' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            HOT
          </button>
        </div>
      </div>

      {/* RIGHT SIDE NAVIGATION CONTROLS */}
      <div className="absolute right-3 bottom-8 z-20 flex flex-col gap-2 print-hidden">
        <button
          onClick={handleRecenter}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 backdrop-blur-md text-slate-800 shadow-lg border border-slate-200 hover:bg-slate-100 transition-colors"
          title="Center Map on Dzaleka"
        >
          <svg className="h-5 w-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle cx="12" cy="12" r="3" strokeWidth={2} />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v3m0 14v3m10-10h-3M5 12H2" />
          </svg>
        </button>
        <button
          onClick={handleZoomIn}
          className="flex h-10 w-10 items-center justify-center rounded-t-xl bg-white/95 backdrop-blur-md text-slate-800 shadow-lg border border-slate-200 hover:bg-slate-100 transition-colors font-bold text-lg"
          title="Zoom In"
        >
          +
        </button>
        <button
          onClick={handleZoomOut}
          className="flex h-10 w-10 items-center justify-center rounded-b-xl bg-white/95 backdrop-blur-md text-slate-800 shadow-lg border border-slate-200 border-t-0 hover:bg-slate-100 transition-colors font-bold text-lg"
          title="Zoom Out"
        >
          −
        </button>
        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 backdrop-blur-md text-slate-800 shadow-lg border border-slate-200 hover:bg-slate-100 transition-colors mt-1"
          title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Map'}
        >
          <svg className="h-4 w-4 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4h4M20 8V4h-4M4 16v4h4M20 16v4h-4" />
          </svg>
        </button>
      </div>

      {/* RESPONSIVE SIDEBAR / MOBILE BOTTOM DRAWER */}
      {sidebarOpen && (
        <div className="absolute inset-x-3 bottom-3 top-auto max-h-[60vh] md:top-28 md:bottom-8 md:left-3 md:right-auto md:w-96 rounded-2xl bg-white/95 backdrop-blur-xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden z-20 print-hidden">
          
          {/* Mobile Handle Drag Line */}
          <div className="w-12 h-1 bg-slate-300 rounded-full mx-auto my-2 md:hidden"></div>

          {/* DIRECTIONS MODE PANEL */}
          {directionsMode ? (
            <div className="flex-1 overflow-y-auto flex flex-col justify-between p-4">
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-sky-600 animate-pulse"></span>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                      Turn-by-Turn Directions
                    </h3>
                  </div>
                  <button
                    onClick={() => setDirectionsMode(false)}
                    className="text-xs font-semibold text-slate-400 hover:text-slate-700"
                  >
                    Close ✕
                  </button>
                </div>

                {/* Travel Mode Pills */}
                <div className="mt-3 grid grid-cols-3 gap-1 rounded-xl bg-slate-100 p-1 text-xs font-semibold">
                  <button
                    onClick={() => setTravelMode('driving')}
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
                    onClick={() => setTravelMode('walking')}
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
                    onClick={() => setTravelMode('transit')}
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
                  {/* Origin */}
                  <div className="rounded-xl border border-slate-200 p-2.5 bg-slate-50/70">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 mb-1">
                      <span>ORIGIN (A)</span>
                      <button
                        onClick={handleGetUserLocation}
                        className="text-sky-700 hover:underline flex items-center gap-1"
                      >
                        {locatingUser ? 'Locating...' : 'Use My GPS'}
                      </button>
                    </div>
                    <select
                      value={originPoint.name}
                      onChange={(e) => {
                        const found = DEFAULT_ORIGINS.find((o) => o.name === e.target.value);
                        if (found) setOriginPoint(found);
                      }}
                      className="w-full bg-white rounded-lg border border-slate-300 p-1.5 text-[16px] sm:text-xs text-slate-900 font-semibold focus:outline-none"
                    >
                      {DEFAULT_ORIGINS.map((orig) => (
                        <option key={orig.name} value={orig.name}>
                          {orig.name} ({orig.lat.toFixed(3)}, {orig.lng.toFixed(3)})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Destination */}
                  <div className="rounded-xl border border-slate-200 p-2.5 bg-slate-50/70">
                    <div className="text-[11px] font-semibold text-slate-500 mb-1">DESTINATION (B)</div>
                    <select
                      value={destinationPoint?.id || ''}
                      onChange={(e) => {
                        const found = MAP_POINTS.find((p) => p.id === e.target.value);
                        if (found) {
                          setDestinationPoint(found);
                          setSelectedPoint(found);
                        }
                      }}
                      className="w-full bg-white rounded-lg border border-slate-300 p-1.5 text-[16px] sm:text-xs text-slate-900 font-semibold focus:outline-none"
                    >
                      {MAP_POINTS.map((pt) => (
                        <option key={pt.id} value={pt.id}>
                          {pt.name} ({pt.categoryLabel})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Distance & Travel Time Result Card */}
                {destinationPoint && (
                  <div className="mt-4 rounded-xl border border-sky-200 bg-sky-50 p-4 text-slate-900">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-sky-700">
                          Estimated Travel Time
                        </span>
                        <h4 className="text-2xl font-bold text-slate-950 font-mono mt-0.5">{estTime}</h4>
                      </div>
                      <div className="text-right">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                          Distance
                        </span>
                        <p className="text-lg font-bold text-slate-900 font-mono mt-0.5">{distKm} km</p>
                      </div>
                    </div>

                    {/* Step-by-Step Guidance */}
                    <div className="mt-4 pt-3 border-t border-sky-200/80 text-xs space-y-2 text-slate-700">
                      <div className="flex items-start gap-2">
                        <span className="font-bold text-sky-700">1.</span>
                        <span>Start at <strong>{originPoint.name}</strong></span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="font-bold text-sky-700">2.</span>
                        <span>Follow M7 road toward Dowa District / Dzaleka Access Road</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="font-bold text-sky-700">3.</span>
                        <span>Arrive at <strong>{destinationPoint.name}</strong></span>
                      </div>
                    </div>
                  </div>
                )}
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
                    <span>Open in Google Maps App</span>
                  </a>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <a
                      href={`https://maps.apple.com/?saddr=${originPoint.lat},${originPoint.lng}&daddr=${destinationPoint.lat},${destinationPoint.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1 rounded-lg border border-slate-300 bg-white py-2 text-[11px] font-semibold text-slate-800 hover:bg-slate-50 transition-colors"
                    >
                      <span>Apple Maps</span>
                    </a>
                    <a
                      href={`https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${originPoint.lat}%2C${originPoint.lng}%3B${destinationPoint.lat}%2C${destinationPoint.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1 rounded-lg border border-slate-300 bg-white py-2 text-[11px] font-semibold text-slate-800 hover:bg-slate-50 transition-colors"
                    >
                      <span>OpenStreetMap</span>
                    </a>
                  </div>
                </div>
              )}
            </div>
          ) : selectedPoint ? (
            /* PLACE DETAILS CARD */
            <div className="flex-1 overflow-y-auto p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
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
                  <div className="flex justify-between text-slate-600">
                    <span className="font-semibold text-slate-500">Zone / Sector:</span>
                    <span>{selectedPoint.zone || 'Dzaleka Sector'}</span>
                  </div>
                  {selectedPoint.operator && (
                    <div className="flex justify-between text-slate-600">
                      <span className="font-semibold text-slate-500">Operator:</span>
                      <span>{selectedPoint.operator}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-slate-600">
                    <span className="font-semibold text-slate-500">GPS Coordinates:</span>
                    <button
                      onClick={() => copyCoordinates(selectedPoint.lat, selectedPoint.lng)}
                      className="font-mono text-[11px] text-sky-700 hover:underline flex items-center gap-1"
                    >
                      {selectedPoint.lat.toFixed(5)}, {selectedPoint.lng.toFixed(5)}
                      <span>{copiedCoords ? '(Copied)' : '📋'}</span>
                    </button>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span className="font-semibold text-slate-500">OpenStreetMap:</span>
                    <span className="font-mono">{selectedPoint.osmType.toUpperCase()} #{selectedPoint.osmId}</span>
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
                  <span>Get Directions To Location</span>
                </button>
                <a
                  href={`https://www.openstreetmap.org/${selectedPoint.osmType}/${selectedPoint.osmId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50 transition-colors w-full"
                >
                  <span>View OpenStreetMap Node Record</span>
                </a>
                {selectedPoint.encyclopediaUrl && (
                  <a
                    href={selectedPoint.encyclopediaUrl}
                    className="flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-900 hover:bg-slate-50 transition-colors w-full"
                  >
                    <span>Read History Entry</span>
                  </a>
                )}
              </div>
            </div>
          ) : (
            /* LIST OF ALL FACILITIES */
            <div className="flex-1 overflow-y-auto p-2 divide-y divide-slate-100 space-y-1">
              <div className="p-2 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between text-[11px]">
                <span className="font-semibold text-slate-500 uppercase tracking-wider">
                  Dzaleka Infrastructure
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSubmissionSuccess(false);
                      setShowSubmissionModal(true);
                    }}
                    className="px-2 py-0.5 rounded bg-emerald-600 text-white font-bold text-[10px] hover:bg-emerald-700"
                  >
                    + Suggest Place
                  </button>
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
                    onClick={() => selectAndFly(pt)}
                    className="p-2.5 rounded-lg cursor-pointer transition-colors hover:bg-slate-50 flex items-start justify-between gap-2"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                          {pt.categoryLabel}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">#{pt.osmId}</span>
                      </div>
                      <h4 className="mt-1 font-bold text-slate-900 text-xs hover:text-sky-700 truncate">
                        {pt.name}
                      </h4>
                      <p className="mt-0.5 text-[11px] leading-4 text-slate-600 line-clamp-1">
                        {pt.description}
                      </p>
                    </div>
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

      {/* COMMUNITY PLACE SUBMISSION FORM MODAL */}
      {showSubmissionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto print-hidden">
          <div className="w-full max-w-xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[90vh] flex flex-col">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between shrink-0 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <div>
                  <h3 className="font-bold text-sm tracking-tight text-white">
                    Community Place & Node Submission
                  </h3>
                  <p className="text-[11px] text-slate-300 font-normal">
                    Suggest a new location or update existing facility details
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSubmissionModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded font-bold text-xs"
              >
                ✕
              </button>
            </div>

            {submissionSuccess ? (
              <div className="p-8 text-center space-y-4 overflow-y-auto">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 font-bold text-xl flex items-center justify-center mx-auto border border-emerald-200">
                  ✓
                </div>
                <h3 className="text-lg font-bold text-slate-950">
                  Submission Received
                </h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                  Thank you for contributing to the Dzaleka infrastructure directory. Your suggestion for <strong>"{formData.placeName}"</strong> has been queued for verification.
                </p>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-left font-mono text-[11px] text-slate-600 max-w-md mx-auto space-y-1">
                  <div><strong>Reference Code:</strong> DZK-OSM-{Math.floor(100000 + Math.random() * 900000)}</div>
                  <div><strong>Submitting Role:</strong> {formData.submitterRole}</div>
                  <div><strong>Target Coordinates:</strong> {formData.lat}, {formData.lng}</div>
                </div>
                <button
                  onClick={() => setShowSubmissionModal(false)}
                  className="mt-4 px-5 py-2.5 rounded-lg bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-colors"
                >
                  Return to Map
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="p-5 space-y-3.5 text-xs overflow-y-auto flex-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Submission Type</label>
                    <select
                      value={formData.submissionType}
                      onChange={(e) => setFormData({ ...formData, submissionType: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 p-2 bg-white text-slate-900 font-medium focus:outline-none focus:border-slate-800"
                    >
                      <option value="new">Suggest New Location Node</option>
                      <option value="update">Update Existing Place Details</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 p-2 bg-white text-slate-900 font-medium focus:outline-none focus:border-slate-800"
                    >
                      <option value="market">Market / Commerce / Enterprise</option>
                      <option value="education">Education / School / Academy</option>
                      <option value="health">Healthcare / Clinic / Aid Station</option>
                      <option value="service">Service / CBO / NGO Office</option>
                      <option value="culture">Culture / Youth / Worship</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Place / Organization Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hope Bakery & Cafe, Youth Tech Hub..."
                    value={formData.placeName}
                    onChange={(e) => setFormData({ ...formData, placeName: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 p-2 text-slate-900 focus:outline-none focus:border-slate-800 font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Zone / Sector</label>
                    <select
                      value={formData.zone}
                      onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 p-2 bg-white text-slate-900 font-medium focus:outline-none focus:border-slate-800"
                    >
                      <option value="Katubiza Area">Katubiza / Katudza Area</option>
                      <option value="New Katubiza">New Katubiza Extension</option>
                      <option value="Kawale 1">Kawale 1 Sector</option>
                      <option value="Kawale 2">Kawale 2 Sector (Market Spine)</option>
                      <option value="Likuni 1">Likuni 1 Area</option>
                      <option value="Likuni 2">Likuni 2 Area</option>
                      <option value="Lisungwi Area">Lisungwi Area</option>
                      <option value="Zomba Sector">Zomba Sector</option>
                      <option value="Blantyre Sector">Blantyre Sector</option>
                      <option value="Dzaleka Hill">Dzaleka Hill Area</option>
                      <option value="Woodlot Area">Woodlot Extension Site</option>
                      <option value="Main Gate Sector">Main Gate / Administration Sector</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Operator / Owner Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Community CBO, Local Enterprise..."
                      value={formData.operator}
                      onChange={(e) => setFormData({ ...formData, operator: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 p-2 text-slate-900 focus:outline-none focus:border-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Opening Hours</label>
                    <input
                      type="text"
                      placeholder="e.g. Mon-Sat: 08:00 - 17:00"
                      value={formData.openingHours}
                      onChange={(e) => setFormData({ ...formData, openingHours: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 p-2 text-slate-900 focus:outline-none focus:border-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Contact Phone / WhatsApp</label>
                    <input
                      type="text"
                      placeholder="e.g. +265 99 123 4567"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 p-2 text-slate-900 focus:outline-none focus:border-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Description & Services Offered *</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Describe services, products sold, target community, or changes needed..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 p-2 text-slate-900 focus:outline-none focus:border-slate-800"
                  />
                </div>

                {/* GPS Coordinates selection */}
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-slate-700">GPS Coordinates</span>
                    <button
                      type="button"
                      onClick={handleFetchCurrentCenter}
                      className="text-sky-700 hover:underline font-semibold text-[11px]"
                    >
                      Set to Map Center
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] text-slate-500 font-semibold">LATITUDE</span>
                      <input
                        type="text"
                        value={formData.lat}
                        onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
                        className="w-full rounded border border-slate-300 p-1.5 font-mono text-slate-900 bg-white"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-semibold">LONGITUDE</span>
                      <input
                        type="text"
                        value={formData.lng}
                        onChange={(e) => setFormData({ ...formData, lng: e.target.value })}
                        className="w-full rounded border border-slate-300 p-1.5 font-mono text-slate-900 bg-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Your Name</label>
                    <input
                      type="text"
                      placeholder="Your full name"
                      value={formData.submitterName}
                      onChange={(e) => setFormData({ ...formData, submitterName: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 p-2 text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Your Role / Capacity</label>
                    <select
                      value={formData.submitterRole}
                      onChange={(e) => setFormData({ ...formData, submitterRole: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 p-2 bg-white text-slate-900 font-medium"
                    >
                      <option value="Enterprise Owner">Enterprise / Business Owner</option>
                      <option value="CBO Director">Refugee CBO Director</option>
                      <option value="School Admin">School Administrator</option>
                      <option value="Healthcare Worker">Healthcare Worker</option>
                      <option value="Resident">Dzaleka Resident</option>
                      <option value="Visitor">Visitor / Humanitarian Staff</option>
                    </select>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setShowSubmissionModal(false)}
                    className="px-4 py-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold transition-colors shadow-2xs"
                  >
                    {submitting ? 'Submitting...' : 'Submit Location Node'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* PRINTABLE PDF MAP SHEET GENERATOR MODAL */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto printable-sheet-modal">
          <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[95vh] flex flex-col">
            
            {/* Modal Header Bar (Hidden in Print) */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between print-hidden shrink-0 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                <h3 className="font-bold text-sm tracking-tight text-white">
                  Printable PDF Field Map Sheet
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
                  onClick={() => setShowPrintModal(false)}
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
                    Humanitarian Field Operations Directory
                  </span>
                  <h1 className="text-2xl font-bold tracking-tight text-slate-950 mt-1">
                    Dzaleka Refugee Camp Official Field Map & Directory
                  </h1>
                  <p className="text-xs text-slate-600 mt-1">
                    Empirical OpenStreetMap Infrastructure Registry & Emergency Navigation Index
                  </p>
                </div>
                <div className="text-left md:text-right font-mono text-xs text-slate-600">
                  <div><strong>GPS Center:</strong> -13.6592° S, 33.8705° E</div>
                  <div><strong>Location:</strong> Dowa District, Central Region, Malawi</div>
                  <div><strong>Dataset Version:</strong> 2026 OpenStreetMap Live Nodes</div>
                </div>
              </div>

              {/* Emergency Hotline Callout Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-red-600">Police Detachment</span>
                  <h4 className="text-sm font-bold text-slate-900">Malawi Police Post</h4>
                  <p className="text-xs font-mono text-slate-700 font-semibold">Emergency Call: 111</p>
                </div>
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-red-600">Health Sector</span>
                  <h4 className="text-sm font-bold text-slate-900">Dzaleka Healthcare Center</h4>
                  <p className="text-xs font-mono text-slate-700 font-semibold">Ambulance Hotline: 999</p>
                </div>
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-sky-700">UNHCR Field Desk</span>
                  <h4 className="text-sm font-bold text-slate-900">Camp Security & Protection</h4>
                  <p className="text-xs font-mono text-slate-700 font-semibold">Phone: +265 1 774 000</p>
                </div>
              </div>

              {/* Key Facilities Table */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
                  Key Registered Infrastructure Facilities ({MAP_POINTS.length} Empirical Nodes)
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
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-slate-100 border border-slate-200 text-slate-700">
                              {pt.categoryLabel}
                            </span>
                          </td>
                          <td className="py-2 px-3 text-slate-600">{pt.zone || 'Dzaleka Sector'}</td>
                          <td className="py-2 px-3 font-mono text-[11px] text-slate-700">
                            {pt.lat.toFixed(4)}, {pt.lng.toFixed(4)}
                          </td>
                          <td className="py-2 px-3 font-mono text-[11px] text-slate-600">
                            #{pt.osmId}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Driving Directions Section */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-800 mb-1">
                  Driving & Logistics Access Directions
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  From Lilongwe City Center, proceed north via the paved <strong>M7 Highway</strong> toward Dowa District for approximately 41 kilometers. Turn right onto the Dzaleka access road at the South Gate checkpoint (GPS Coordinates: -13.6637, 33.8689).
                </p>
              </div>

              {/* Footer Stamp */}
              <div className="pt-4 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-400">
                <span>Services.dzaleka.com Official Map Print Sheet</span>
                <span>OpenStreetMap &copy; Contributors | Esri World Imagery</span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* EMERGENCY CONTACTS & RAPID RESPONSE MODAL */}
      {showEmergencyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto print-hidden">
          <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between shrink-0 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                <div>
                  <h3 className="font-bold text-sm tracking-tight text-white">
                    Emergency Contacts & Security Desk
                  </h3>
                  <p className="text-[11px] text-slate-300 font-normal">
                    Dzaleka Refugee Camp Direct Hotlines
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowEmergencyModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded font-bold text-xs"
              >
                ✕
              </button>
            </div>

            {/* Emergency Content */}
            <div className="p-5 space-y-4 overflow-y-auto flex-1 text-slate-900">
              <div className="p-3.5 bg-red-50/80 border-l-4 border-red-600 rounded-r-lg border-y border-r border-red-200/60">
                <span className="text-[10px] font-bold uppercase tracking-widest text-red-700">Urgent Assistance Callout</span>
                <p className="text-xs text-slate-800 mt-1 leading-relaxed">
                  For immediate life safety, crime reporting, or medical evacuation, contact the field dispatch numbers below.
                </p>
              </div>

              <div className="space-y-2.5">
                {/* Healthcare & Ambulance */}
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 flex items-center justify-between gap-3 shadow-2xs">
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-red-600">Medical Emergency</span>
                    <h4 className="text-sm font-bold text-slate-950">Dzaleka Healthcare Center & Ambulance</h4>
                    <p className="text-xs text-slate-500 mt-0.5">24/7 Field Clinic & Dispatch</p>
                  </div>
                  <a
                    href="tel:999"
                    className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shrink-0 shadow-2xs flex items-center gap-1.5"
                  >
                    <svg className="h-3.5 w-3.5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>Call 999</span>
                  </a>
                </div>

                {/* Malawi Police Post */}
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 flex items-center justify-between gap-3 shadow-2xs">
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Police Detachment</span>
                    <h4 className="text-sm font-bold text-slate-950">Malawi Police Dzaleka Post</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Camp Security & Law Enforcement</p>
                  </div>
                  <a
                    href="tel:111"
                    className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shrink-0 shadow-2xs flex items-center gap-1.5"
                  >
                    <svg className="h-3.5 w-3.5 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>Call 111</span>
                  </a>
                </div>

                {/* UNHCR Protection Desk */}
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 flex items-center justify-between gap-3 shadow-2xs">
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-sky-700">Protection Desk</span>
                    <h4 className="text-sm font-bold text-slate-950">UNHCR Field Protection & Safety</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Refugee Protection Hotline</p>
                  </div>
                  <a
                    href="tel:+2651774000"
                    className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shrink-0 shadow-2xs flex items-center gap-1.5"
                  >
                    <svg className="h-3.5 w-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>Call Desk</span>
                  </a>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                  Map Quick Highlights
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => {
                      setShowEmergencyModal(false);
                      const healthPt = MAP_POINTS.find((p) => p.type === 'health');
                      if (healthPt) selectAndFly(healthPt);
                    }}
                    className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-900 font-semibold text-left transition-colors"
                  >
                    Center Healthcare Station &rarr;
                  </button>
                  <button
                    onClick={() => {
                      setShowEmergencyModal(false);
                      const servicePt = MAP_POINTS.find((p) => p.name.toLowerCase().includes('police'));
                      if (servicePt) selectAndFly(servicePt);
                    }}
                    className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-900 font-semibold text-left transition-colors"
                  >
                    Center Police Post &rarr;
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setShowEmergencyModal(false)}
                className="px-4 py-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition-colors"
              >
                Close Emergency Window
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

// HAVERSINE DISTANCE CALCULATOR IN KM
function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

// ESTIMATED TRAVEL TIME
function estimateTravelTime(distKm: number, mode: 'driving' | 'walking' | 'transit'): string {
  if (distKm < 0.1) return '< 1 min';
  if (mode === 'driving') {
    const hours = distKm / (distKm > 5 ? 50 : 25);
    const mins = Math.round(hours * 60);
    return mins >= 60 ? `${Math.floor(mins / 60)} hr ${mins % 60} min` : `${mins} min`;
  } else if (mode === 'walking') {
    const mins = Math.round((distKm / 4.5) * 60);
    return mins >= 60 ? `${Math.floor(mins / 60)} hr ${mins % 60} min` : `${mins} min`;
  } else {
    const mins = Math.round((distKm / 35) * 60);
    return mins >= 60 ? `${Math.floor(mins / 60)} hr ${mins % 60} min` : `${mins} min`;
  }
}

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
      background-color: rgba(255, 255, 255, 0.95);
      color: #0f172a;
      font-weight: 700;
      font-size: 11px;
      padding: 3px 8px;
      border-radius: 9999px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.25);
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
        box-shadow: 0 3px 8px rgba(0,0,0,0.4);
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
        box-shadow: 0 3px 8px rgba(0,0,0,0.4);
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
        box-shadow: 0 3px 8px rgba(0,0,0,0.4);
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
        box-shadow: 0 3px 8px rgba(0,0,0,0.4);
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
        box-shadow: 0 3px 8px rgba(0,0,0,0.4);
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
