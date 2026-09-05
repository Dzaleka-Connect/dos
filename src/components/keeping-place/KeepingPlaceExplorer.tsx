import Modal from '../ui/Modal';
import 'leaflet/dist/leaflet.css';
import { useState, useEffect, useRef, type FormEvent } from 'react';
import {
  KEEPING_PLACE_DATASET,
  type KeepingPlaceRecord,
  type CulturalProtocolLevel,
  type RecordCategory
} from '../../data/keepingPlaceDataset';

type ViewMode = 'map' | 'table' | 'relationships';

// Zoom level at or above which marker name labels are shown. Below this the
// 90+ labels overlap each other and obscure the map.
const KP_LABEL_ZOOM_THRESHOLD = 17;

export function KeepingPlaceExplorer() {
  const [records] = useState<KeepingPlaceRecord[]>(KEEPING_PLACE_DATASET);
  const [activeView, setActiveView] = useState<ViewMode>('map');
  const [activeProtocol, setActiveProtocol] = useState<CulturalProtocolLevel>('public');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedZone, setSelectedZone] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRecord, setSelectedRecord] = useState<KeepingPlaceRecord | null>(null);
  const [expandedModalRecord, setExpandedModalRecord] = useState<KeepingPlaceRecord | null>(null);
  const [activeTileLayer, setActiveTileLayer] = useState<'street' | 'satellite' | 'topo'>('street');
  const [showBoundaries, setShowBoundaries] = useState<boolean>(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [customRecords, setCustomRecords] = useState<KeepingPlaceRecord[]>([]);

  // Form state
  const [newSiteName, setNewSiteName] = useState('');
  const [newSiteCategory, setNewSiteCategory] = useState<RecordCategory>('cultural_site');
  const [newSiteProtocol, setNewSiteProtocol] = useState<CulturalProtocolLevel>('public');
  const [newSiteLat, setNewSiteLat] = useState<number>(-13.6592);
  const [newSiteLng, setNewSiteLng] = useState<number>(33.8705);
  const [newSiteZone, setNewSiteZone] = useState('Central Sector');
  const [newSiteSummary, setNewSiteSummary] = useState('');

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const polygonsRef = useRef<any[]>([]);

  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('dzaleka_keeping_place_custom_records');
      if (saved) {
        setCustomRecords(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Unable to load local storage', e);
    }
  }, []);

  const allRecords = [...records, ...customRecords];

  // Deep linking URL query parameter handler
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const recordParam = params.get('record') || params.get('id');
      const slugParam = params.get('slug');
      if (recordParam || slugParam) {
        const found = allRecords.find(
          (r) => r.id === recordParam || r.siteRegisterSlug === slugParam || r.encyclopediaSlug === slugParam
        );
        if (found) {
          setSelectedRecord(found);
          if (mapInstanceRef.current) {
            mapInstanceRef.current.setView([found.lat, found.lng], 17);
          }
        }
      }
    }
  }, []);

  const handleShareLocation = (record: KeepingPlaceRecord) => {
    if (typeof window !== 'undefined') {
      const shareUrl = `${window.location.origin}/explore?record=${record.id}`;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(shareUrl).then(() => {
          setCopyFeedback(record.id);
          setTimeout(() => setCopyFeedback(null), 3000);
        });
      }
    }
  };

  // Extract unique zones for sector filter dropdown
  const uniqueZones = Array.from(new Set(allRecords.map(r => r.zone).filter(Boolean))).sort();

  const filteredRecords = allRecords.filter((rec) => {
    if (rec.protocol !== activeProtocol) return false;
    if (selectedCategory !== 'all' && rec.category !== selectedCategory) return false;
    if (selectedZone !== 'all' && rec.zone !== selectedZone) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchName = rec.name.toLowerCase().includes(q);
      const matchSummary = rec.summary.toLowerCase().includes(q);
      const matchZone = rec.zone.toLowerCase().includes(q);
      const matchTags = rec.tags.some(t => t.toLowerCase().includes(q));
      if (!matchName && !matchSummary && !matchZone && !matchTags) return false;
    }
    return true;
  });

  useEffect(() => {
    let isCancelled = false;

    const initMap = async () => {
      if (typeof window === 'undefined' || !mapContainerRef.current) return;
      const L = (await import('leaflet')).default;
      if (isCancelled || !mapContainerRef.current) return;

      if (!mapInstanceRef.current) {
        const map = L.map(mapContainerRef.current, {
          center: [-13.6592, 33.8705],
          zoom: 15,
          zoomControl: true,
          scrollWheelZoom: false
        });
        mapInstanceRef.current = map;
      }

      const map = mapInstanceRef.current;

      setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      }, 50);

      map.eachLayer((layer: any) => {
        if (layer instanceof L.TileLayer || layer instanceof L.Marker || layer instanceof L.Polygon) {
          map.removeLayer(layer);
        }
      });
      markersRef.current = [];
      polygonsRef.current = [];

      let tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      let attribution = '&copy; OpenStreetMap contributors';
      let maxNativeZoom = 19;

      if (activeTileLayer === 'satellite') {
        tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
        attribution = 'Esri World Imagery';
        maxNativeZoom = 18;
      } else if (activeTileLayer === 'topo') {
        tileUrl = 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
        attribution = 'OpenTopoMap';
        maxNativeZoom = 17;
      }

      L.tileLayer(tileUrl, {
        attribution,
        maxZoom: 20,
        maxNativeZoom
      }).addTo(map);

      // Name labels only appear once zoomed in far enough that they do not
      // overlap; below the threshold the pin alone is drawn.
      const buildKpIcon = (rec: typeof filteredRecords[number], pinColor: string, withLabel: boolean) =>
        L.divIcon({
          className: 'custom-kp-pin',
          html: withLabel
            ? `
            <div style="
              display: inline-flex;
              align-items: center;
              gap: 6px;
              background-color: #0f172a;
              color: #ffffff;
              padding: 3px 8px 3px 5px;
              border-radius: 14px;
              border: 1px solid #334155;
              font-size: 11px;
              font-weight: 700;
              white-space: nowrap;
              box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3);
              cursor: pointer;
            ">
              <span style="
                background-color: ${pinColor};
                width: 10px;
                height: 10px;
                border-radius: 50%;
                display: inline-block;
                flex-shrink: 0;
              "></span>
              <span>${rec.name}</span>
            </div>
          `
            : `
            <div style="
              background-color: ${pinColor};
              width: 16px;
              height: 16px;
              border-radius: 50%;
              border: 2px solid #0f172a;
              box-shadow: 0 2px 4px rgba(0,0,0,0.35);
              cursor: pointer;
            "></div>
          `,
          iconSize: withLabel ? [160, 26] : [16, 16],
          iconAnchor: [12, 13]
        });

      const kpMarkers: { marker: any; rec: typeof filteredRecords[number]; pinColor: string }[] = [];

      filteredRecords.forEach((rec) => {
        let pinColor = '#0284c7';
        if (rec.protocol === 'community') pinColor = '#d97706';
        if (rec.protocol === 'restricted') pinColor = '#dc2626';

        const customIcon = buildKpIcon(rec, pinColor, map.getZoom() >= KP_LABEL_ZOOM_THRESHOLD);

        const marker = L.marker([rec.lat, rec.lng], { icon: customIcon }).addTo(map);
        kpMarkers.push({ marker, rec, pinColor });

        const popupContent = `
          <div style="font-family: inherit; padding: 2px;">
            <div style="font-size: 10px; font-weight: 700; text-transform: ; color: ${pinColor}; margin-bottom: 2px;">
              ${rec.categoryLabel}
            </div>
            <h4 style="font-size: 13px; font-weight: 700; margin: 0 0 4px 0; color: #0f172a;">
              ${rec.name}
            </h4>
            <p style="font-size: 11px; color: #475569; margin: 0 0 8px 0; line-height: 1.3;">
              ${rec.summary}
            </p>
            <button
              id="btn-inspect-${rec.id}"
              style="
                background: #0f172a;
                color: #ffffff;
                border: none;
                padding: 6px 10px;
                border-radius: 6px;
                font-size: 11px;
                font-weight: 600;
                cursor: pointer;
                width: 100%;
              ">
              Inspect Record Details
            </button>
          </div>
        `;

        marker.bindPopup(popupContent);
        marker.on('popupopen', () => {
          const btn = document.getElementById(`btn-inspect-${rec.id}`);
          if (btn) btn.onclick = () => setSelectedRecord(rec);
        });

        markersRef.current.push(marker);

        if (showBoundaries && rec.boundary && rec.boundary.coordinates.length > 0) {
          const poly = L.polygon(rec.boundary.coordinates, {
            color: pinColor,
            fillColor: pinColor,
            fillOpacity: 0.15,
            weight: 2
          }).addTo(map);
          polygonsRef.current.push(poly);
        }
      });

      // Swap pin-only and labelled icons when crossing the zoom threshold.
      let kpLabelsVisible = map.getZoom() >= KP_LABEL_ZOOM_THRESHOLD;
      map.on('zoomend', () => {
        const shouldShow = map.getZoom() >= KP_LABEL_ZOOM_THRESHOLD;
        if (shouldShow === kpLabelsVisible) return;
        kpLabelsVisible = shouldShow;
        kpMarkers.forEach(({ marker, rec, pinColor }) => {
          marker.setIcon(buildKpIcon(rec, pinColor, shouldShow));
        });
      });
    };

    initMap();
    return () => { isCancelled = true; };
  }, [activeTileLayer, filteredRecords, activeProtocol, showBoundaries]);

  useEffect(() => {
    if (activeView === 'map' && mapInstanceRef.current) {
      setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      }, 50);
    }
  }, [activeView]);

  const handleFocusRecord = (rec: KeepingPlaceRecord) => {
    setSelectedRecord(rec);
    setActiveView('map');
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([rec.lat, rec.lng], 17);
    }
  };

  const handleResetMapBounds = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([-13.6592, 33.8705], 15);
    }
  };

  const handleCreateRecord = (e: FormEvent) => {
    e.preventDefault();
    if (!newSiteName.trim()) return;

    const newRec: KeepingPlaceRecord = {
      id: `kp-custom-${Date.now()}`,
      name: newSiteName,
      category: newSiteCategory,
      categoryLabel: newSiteCategory.replace('_', ' ').toUpperCase(),
      protocol: newSiteProtocol,
      protocolBadge: newSiteProtocol === 'public' ? 'Public' : newSiteProtocol === 'community' ? 'Community' : 'Restricted',
      protocolDescription: 'Custom local spatial record.',
      lat: newSiteLat,
      lng: newSiteLng,
      zone: newSiteZone,
      custodian: 'Local Contributor',
      surveyDate: new Date().toISOString().split('T')[0],
      summary: newSiteSummary || 'Newly mapped spatial record in Dzaleka.',
      detailedDescription: newSiteSummary || 'Custom site entry recorded in Dzaleka Keeping Place.',
      relationships: [
        { id: `rel-new-${Date.now()}`, title: 'Ground Spatial Verification', type: 'survey', summary: 'Local participant observation record.' }
      ],
      tags: ['Local Record', 'Community GIS']
    };

    const updated = [newRec, ...customRecords];
    setCustomRecords(updated);
    try {
      localStorage.setItem('dzaleka_keeping_place_custom_records', JSON.stringify(updated));
    } catch (err) {
      console.error('Failed to save to local storage', err);
    }

    // Send the record for review as well, so submissions are not stranded in
    // one browser's local storage.
    fetch('/api/map-submission', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        submissionType: 'keeping-place-record',
        placeName: newSiteName,
        category: newSiteCategory,
        zone: newSiteZone,
        operator: 'Community contributor',
        description: newSiteSummary || 'Custom site entry recorded in Dzaleka Keeping Place.',
        lat: newSiteLat,
        lng: newSiteLng,
        submitterRole: `Access protocol: ${newSiteProtocol}`,
      }),
    }).catch((err) => {
      // The record is still stored locally; surface the failure for debugging.
      console.error('Keeping Place submission could not be sent for review', err);
    });

    const emailSubject = encodeURIComponent(`[Keeping Place GIS] New Site Submission: ${newSiteName}`);
    const emailBody = encodeURIComponent(
      `Dzaleka Keeping Place GIS - Site Landmark Submission\n\n` +
      `Site/Landmark Name: ${newSiteName}\n` +
      `Category: ${newSiteCategory.replace('_', ' ').toUpperCase()}\n` +
      `Access Protocol: ${newSiteProtocol}\n` +
      `GPS Coordinates: ${newSiteLat}, ${newSiteLng}\n` +
      `Zone / Sector: ${newSiteZone}\n` +
      `Field Notes: ${newSiteSummary || 'N/A'}\n\n` +
      `Submitted via Dzaleka Online Services GIS Platform (https://services.dzaleka.com/explore)`
    );

    setIsAddModalOpen(false);
    setNewSiteName('');
    setNewSiteSummary('');
    setSelectedRecord(newRec);

    window.location.href = `mailto:dzalekaconnect@gmail.com?subject=${emailSubject}&body=${emailBody}`;
  };

  const handleExportGeoJSON = () => {
    const geojson = {
      type: 'FeatureCollection',
      metadata: {
        title: 'Dzaleka Keeping Place Cultural Heritage Export',
        exportedAt: new Date().toISOString()
      },
      features: filteredRecords.map(rec => ({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [rec.lng, rec.lat] },
        properties: { id: rec.id, referenceId: rec.referenceId, name: rec.name, category: rec.category, zone: rec.zone, custodian: rec.custodian }
      }))
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(geojson, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `dzaleka_keeping_place_${Date.now()}.geojson`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'ReferenceID', 'Name', 'Category', 'Protocol', 'Zone', 'Custodian', 'Latitude', 'Longitude', 'Summary'];
    const rows = filteredRecords.map(r => [
      r.id,
      r.referenceId || '',
      `"${r.name.replace(/"/g, '""')}"`,
      r.categoryLabel,
      r.protocolBadge,
      `"${r.zone}"`,
      `"${r.custodian}"`,
      r.lat,
      r.lng,
      `"${r.summary.replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `dzaleka_keeping_place_records_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="explore-browser w-full h-full min-h-0 flex flex-col bg-slate-50 text-slate-900 overflow-hidden font-sans">

      <header className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white p-4">
        <div className="flex flex-wrap gap-2" aria-label="Explore display">
          {([['map', 'Map'], ['table', 'Places'], ['relationships', 'Related records']] as const).map(([view, label]) => <button key={view} type="button" aria-pressed={activeView === view} onClick={() => setActiveView(view)} className={`min-h-[44px] rounded border px-4 py-2 text-sm font-medium ${activeView === view ? 'border-primary-900 bg-primary-900 text-white' : 'border-slate-300 bg-white text-primary-900 hover:bg-slate-50'}`}>{label}</button>)}
        </div>
        <details className="relative">
          <summary className="cursor-pointer rounded border border-slate-300 px-4 py-2.5 text-sm font-medium text-primary-900">More tools</summary>
          <div className="absolute right-0 top-full z-[600] mt-2 w-56 rounded border border-slate-300 bg-white p-2 ">
            <a href="/map/submit" className="block px-3 py-3 text-sm text-primary-800 underline underline-offset-4">Suggest a place</a>
            <button type="button" onClick={() => setIsAddModalOpen(true)} className="block w-full px-3 py-3 text-left text-sm text-primary-800">Quick submission</button>
            <button type="button" onClick={handleExportGeoJSON} className="block w-full px-3 py-3 text-left text-sm text-primary-800">Download GeoJSON</button>
            <button type="button" onClick={handleExportCSV} className="block w-full px-3 py-3 text-left text-sm text-primary-800">Download CSV</button>
          </div>
        </details>
      </header>
      <div className="shrink-0 border-b border-slate-200 bg-slate-50 p-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div><label htmlFor="explore-search" className="mb-2 block text-sm font-medium text-slate-900">Search places and records</label><input id="explore-search" type="search" placeholder="Name, place or topic" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} className="w-full border border-slate-400 bg-white px-3 py-2" /></div>
          <div><label htmlFor="explore-category" className="mb-2 block text-sm font-medium text-slate-900">Category</label><select id="explore-category" value={selectedCategory} onChange={(event) => setSelectedCategory(event.target.value)} className="w-full border border-slate-400 bg-white px-3 py-2"><option value="all">All categories</option><option value="cultural_site">Cultural sites</option><option value="land_tenement">Land boundaries</option><option value="heritage_survey">Surveys</option><option value="oral_history">Oral histories</option><option value="public_service">Public services</option></select></div>
          <div><label htmlFor="explore-zone" className="mb-2 block text-sm font-medium text-slate-900">Area</label><select id="explore-zone" value={selectedZone} onChange={(event) => setSelectedZone(event.target.value)} className="w-full border border-slate-400 bg-white px-3 py-2"><option value="all">All areas</option>{uniqueZones.map((zone) => <option key={zone} value={zone}>{zone}</option>)}</select></div>
          <div><label htmlFor="explore-sharing" className="mb-2 block text-sm font-medium text-slate-900">Sharing category</label><select id="explore-sharing" value={activeProtocol} onChange={(event) => setActiveProtocol(event.target.value as CulturalProtocolLevel)} className="w-full border border-slate-400 bg-white px-3 py-2"><option value="public">Public</option><option value="community">Community</option><option value="restricted">Restricted</option></select></div>
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3"><p role="status" className="text-sm text-slate-600">{filteredRecords.length} matching records</p><button type="button" onClick={() => { setSearchQuery(''); setSelectedCategory('all'); setSelectedZone('all'); setActiveProtocol('public'); }} className="text-sm text-primary-800 underline underline-offset-4">Clear filters</button></div>
      </div>

      {/* MAIN CANVAS */}
      <div className="relative min-h-0 flex-1 w-full overflow-hidden">

        {/* MAP CANVAS VIEW */}
        <div className={`relative w-full h-full ${activeView === 'map' ? 'block' : 'hidden'}`}>

          <div className="absolute top-3 right-3 z-[400] flex max-w-[calc(100%-4.5rem)] flex-wrap justify-end gap-2">
            <label className="sr-only" htmlFor="explore-layer">Map style</label>
            <select id="explore-layer" value={activeTileLayer} onChange={(event) => setActiveTileLayer(event.target.value as 'street' | 'satellite' | 'topo')} className="max-w-40 rounded border border-slate-400 bg-white py-2 pl-3 pr-8 text-sm"><option value="street">Street map</option><option value="satellite">Satellite</option><option value="topo">Terrain</option></select>
            <button type="button" onClick={handleResetMapBounds} className="rounded border border-slate-400 bg-white px-3 py-2 text-sm text-primary-900">Reset view</button>
            <button type="button" aria-pressed={showBoundaries} onClick={() => setShowBoundaries(!showBoundaries)} className="rounded border border-slate-400 bg-white px-3 py-2 text-sm text-primary-900">{showBoundaries ? 'Hide boundaries' : 'Show boundaries'}</button>
          </div>

          <div ref={mapContainerRef} className="w-full h-full z-10" />
        </div>

        {/* TABLE VIEW */}
        {activeView === 'table' && (
          <div className="w-full h-full p-4 overflow-auto bg-white sm:p-6">
            <div className="max-w-7xl mx-auto overflow-x-auto border border-slate-200 bg-white">
              <table className="w-full min-w-[700px] text-left text-sm border-collapse"><caption className="sr-only">Places matching your search and filters</caption>
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-100 text-slate-600 font-semibold ">
                    <th scope="col" className="py-3 px-4">Place or record</th>
                    <th scope="col" className="py-3 px-4">Category</th>
                    <th scope="col" className="py-3 px-4">Protocol</th>
                    <th scope="col" className="py-3 px-4">Zone</th>
                    <th scope="col" className="py-3 px-4">Custodian</th>
                    <th scope="col" className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredRecords.map((rec) => (
                    <tr key={rec.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        {rec.siteRegisterSlug ? (
                          <a href={`/site-register/${rec.siteRegisterSlug}`} className="hover:underline text-sky-700 font-semibold">
                            {rec.name}
                          </a>
                        ) : rec.encyclopediaSlug ? (
                          <a href={`/encyclopedia/${rec.encyclopediaSlug}`} className="hover:underline text-sky-700 font-semibold">
                            {rec.name}
                          </a>
                        ) : (
                          <span>{rec.name}</span>
                        )}
                        {rec.referenceId && (
                          <span className="ml-2 text-sm bg-slate-100 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded font-mono font-medium">
                            {rec.referenceId}
                          </span>
                        )}
                        <div className="text-sm font-normal text-slate-500 line-clamp-1 mt-0.5">
                          {rec.summary}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 font-medium">{rec.categoryLabel}</td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-block rounded px-2.5 py-0.5 text-sm font-semibold ${
                          rec.protocol === 'public' ? 'bg-sky-50 text-sky-700 border border-sky-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {rec.protocolBadge}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700">{rec.zone}</td>
                      <td className="py-3.5 px-4 text-slate-500">{rec.custodian}</td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          onClick={() => setExpandedModalRecord(rec)}
                          className="rounded bg-slate-100 border border-slate-200 px-3 py-1 text-sm font-semibold text-slate-700 hover:bg-slate-200"
                        >
                          Full Report
                        </button>
                        <button
                          onClick={() => handleFocusRecord(rec)}
                          className="rounded bg-slate-900 px-3 py-1 text-sm font-semibold text-white hover:bg-slate-800"
                        >
                          Focus Map
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* RELATIONSHIP ENGINE VIEW */}
        {activeView === 'relationships' && (
          <div className="w-full h-full p-4 overflow-auto bg-white sm:p-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredRecords.map((rec) => (
                <div key={rec.id} className="rounded border border-slate-200 bg-white p-5 flex flex-col justify-between transition-shadow">
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <span className="text-sm font-semibold text-sky-700">
                        {rec.categoryLabel}
                      </span>
                      <span className="text-sm text-slate-500 font-medium">{rec.zone}</span>
                    </div>

                    <h3 className="text-base font-semibold text-slate-900 mb-1">
                      {rec.siteRegisterSlug ? (
                        <a href={`/site-register/${rec.siteRegisterSlug}`} className="hover:underline hover:text-sky-700 transition-colors">
                          {rec.name}
                        </a>
                      ) : rec.encyclopediaSlug ? (
                        <a href={`/encyclopedia/${rec.encyclopediaSlug}`} className="hover:underline hover:text-sky-700 transition-colors">
                          {rec.name}
                        </a>
                      ) : (
                        rec.name
                      )}
                      {rec.referenceId && (
                        <span className="ml-2 text-sm bg-slate-100 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded font-mono font-medium">
                          {rec.referenceId}
                        </span>
                      )}
                    </h3>
                    <p className="text-sm text-slate-600 mb-3 line-clamp-2">{rec.summary}</p>

                    <div className="space-y-2 border-t border-slate-100 pt-3">
                      <div className="text-sm font-semibold text-slate-600">
                        Linked Primary Data ({rec.relationships.length}):
                      </div>
                      {rec.relationships.map((rel) => (
                        <div key={rel.id} className="bg-slate-50 rounded p-2.5 text-sm border border-slate-200">
                          <div className="font-semibold text-slate-800">
                            {rel.url ? (
                              <a href={rel.url} className="hover:underline text-sky-700">{rel.title}</a>
                            ) : rel.title}
                          </div>
                          <div className="text-sm text-slate-500 mt-0.5">{rel.summary}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100">
                    <button
                      onClick={() => setExpandedModalRecord(rec)}
                      className="flex-1 rounded bg-slate-100 border border-slate-200 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-200"
                    >
                      Full Report
                    </button>
                    <button
                      onClick={() => handleFocusRecord(rec)}
                      className="flex-1 rounded bg-slate-900 py-1.5 text-sm font-semibold text-white hover:bg-slate-800"
                    >
                      Focus Location
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FLOATING SIDE DRAWER FOR SELECTED RECORD */}
        {selectedRecord && (
          <div className="absolute top-0 right-0 h-full w-full max-w-sm bg-white border-l border-slate-200 p-6 overflow-y-auto z-[500] flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <span className="text-sm font-semibold text-slate-500">
                  {selectedRecord.categoryLabel}
                </span>
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="rounded px-2.5 py-1 text-sm font-semibold bg-slate-100 text-slate-600 border border-slate-200 hover:text-slate-900 hover:bg-slate-200"
                >
                  Close
                </button>
              </div>

              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                {selectedRecord.siteRegisterSlug ? (
                  <a href={`/site-register/${selectedRecord.siteRegisterSlug}`} className="hover:underline hover:text-sky-700 transition-colors">
                    {selectedRecord.name}
                  </a>
                ) : selectedRecord.encyclopediaSlug ? (
                  <a href={`/encyclopedia/${selectedRecord.encyclopediaSlug}`} className="hover:underline hover:text-sky-700 transition-colors">
                    {selectedRecord.name}
                  </a>
                ) : (
                  selectedRecord.name
                )}
                {selectedRecord.referenceId && (
                  <span className="ml-2 text-sm bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded font-mono font-medium">
                    {selectedRecord.referenceId}
                  </span>
                )}
              </h3>

              <div className="mb-4">
                <span className={`inline-block rounded px-2.5 py-0.5 text-sm font-semibold ${
                  selectedRecord.protocol === 'public' ? 'bg-sky-50 text-sky-700 border border-sky-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}>
                  {selectedRecord.protocolBadge}
                </span>
              </div>

              <div className="space-y-2 text-sm text-slate-600 mb-4 border-t border-slate-100 pt-3">
                <div><strong className="text-slate-800">Zone:</strong> {selectedRecord.zone}</div>
                <div><strong className="text-slate-800">Custodian:</strong> {selectedRecord.custodian}</div>
                <div><strong className="text-slate-800">Coordinates:</strong> {selectedRecord.lat.toFixed(5)}, {selectedRecord.lng.toFixed(5)}</div>
              </div>

              {selectedRecord.capacityOrStats && (
                <div className="mb-4 bg-slate-50 border border-slate-200 rounded p-3 text-sm text-slate-700">
                  <strong className="block font-semibold text-slate-900 mb-0.5">Empirical Catchment / Capacity:</strong>
                  {selectedRecord.capacityOrStats}
                </div>
              )}

              <div className="border-t border-slate-100 pt-3 mb-4">
                <h4 className="text-sm font-semibold text-slate-600 mb-1">Details</h4>
                <p className="text-sm text-slate-600 leading-relaxed">{selectedRecord.detailedDescription}</p>
              </div>

              <div className="border-t border-slate-100 pt-3 mb-4">
                <h4 className="text-sm font-semibold text-slate-600 mb-2">
                  Linked References ({selectedRecord.relationships.length})
                </h4>
                <div className="space-y-2">
                  {selectedRecord.relationships.map((rel) => (
                    <div key={rel.id} className="rounded bg-slate-50 p-2.5 text-sm border border-slate-200">
                      <div className="font-semibold text-slate-800">
                        {rel.url ? (
                          <a href={rel.url} className="hover:underline text-sky-700">{rel.title}</a>
                        ) : rel.title}
                      </div>
                      <p className="text-sm text-slate-500 mt-0.5">{rel.summary}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setExpandedModalRecord(selectedRecord)}
                className="w-full rounded bg-slate-900 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 transition-colors "
              >
                Expand Full Research Report
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleShareLocation(selectedRecord)}
                  className="rounded border border-slate-200 bg-white py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5 "
                >
                  {copyFeedback === selectedRecord.id ? (
                    <span className="text-emerald-600 font-semibold">Link Copied!</span>
                  ) : (
                    <>
                      <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 100-2.684 3 3 0 000 2.684zm0 9a3 3 0 100-2.684 3 3 0 000 2.684" />
                      </svg>
                      <span>Share Link</span>
                    </>
                  )}
                </button>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${selectedRecord.lat},${selectedRecord.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded border border-slate-200 bg-white py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5 "
                >
                  <svg className="w-3.5 h-3.5 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Google Maps</span>
                </a>
              </div>

              {selectedRecord.siteRegisterSlug && (
                <a
                  href={`/site-register/${selectedRecord.siteRegisterSlug}`}
                  className="block text-center w-full rounded border border-slate-200 bg-slate-50 py-2 text-sm font-semibold text-sky-700 hover:bg-slate-100"
                >
                  View Site Register Listing {selectedRecord.referenceId ? `(${selectedRecord.referenceId})` : ''}
                </a>
              )}
              {selectedRecord.encyclopediaSlug && (
                <a
                  href={`/encyclopedia/${selectedRecord.encyclopediaSlug}`}
                  className="block text-center w-full rounded border border-slate-200 bg-white py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Read Encyclopedia Article
                </a>
              )}
            </div>
          </div>
        )}

      </div>

      {/* FULL EXPANDED RESEARCH & SPATIAL REPORT MODAL */}
      {expandedModalRecord && (
        <Modal label="Record details" onClose={() => setExpandedModalRecord(null)}>
          <div className="w-full max-w-3xl rounded bg-white p-6 sm:p-8 border border-slate-200 text-slate-900 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4 mb-6">
              <div>
                <span className="text-sm font-semibold text-slate-500">
                  {expandedModalRecord.categoryLabel} &bull; {expandedModalRecord.zone}
                </span>
                <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 mt-1">
                  {expandedModalRecord.siteRegisterSlug ? (
                    <a href={`/site-register/${expandedModalRecord.siteRegisterSlug}`} className="hover:underline hover:text-sky-700 transition-colors">
                      {expandedModalRecord.name}
                    </a>
                  ) : expandedModalRecord.encyclopediaSlug ? (
                    <a href={`/encyclopedia/${expandedModalRecord.encyclopediaSlug}`} className="hover:underline hover:text-sky-700 transition-colors">
                      {expandedModalRecord.name}
                    </a>
                  ) : (
                    expandedModalRecord.name
                  )}
                  {expandedModalRecord.referenceId && (
                    <span className="ml-3 text-sm bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-0.5 rounded font-mono font-medium">
                      {expandedModalRecord.referenceId}
                    </span>
                  )}
                </h2>
                <div className="flex items-center gap-2 mt-2">
                  <span className="bg-sky-50 text-sky-700 border border-sky-200 text-sm px-2.5 py-0.5 rounded font-semibold">
                    {expandedModalRecord.protocolBadge}
                  </span>
                  <span className="text-sm text-slate-500 font-mono">
                    GPS: {expandedModalRecord.lat.toFixed(6)}, {expandedModalRecord.lng.toFixed(6)}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="rounded border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Print Report
                </button>
                <button
                  onClick={() => setExpandedModalRecord(null)}
                  className="rounded border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Close Report
                </button>
              </div>
            </div>

            <div className="space-y-6 text-sm">
              {/* Capacity / Stats Highlight */}
              {expandedModalRecord.capacityOrStats && (
                <div className="bg-slate-50 border border-slate-200 rounded p-4 text-slate-800">
                  <strong className="block font-semibold text-slate-900 text-sm mb-1">Empirical Metrics & Catchment</strong>
                  <p className="text-sm leading-relaxed text-slate-700">{expandedModalRecord.capacityOrStats}</p>
                </div>
              )}

              {/* Full Description */}
              <div>
                <h3 className="text-sm font-semibold text-slate-500 mb-2">Detailed Operational Overview</h3>
                <p className="text-slate-700 leading-relaxed text-sm bg-slate-50 p-4 rounded border border-slate-200">
                  {expandedModalRecord.detailedDescription}
                </p>
              </div>

              {/* Academic Notes & Citations */}
              {expandedModalRecord.academicNotes && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-500 mb-2">Academic Research & Survey Citations</h3>
                  <p className="text-slate-700 leading-relaxed text-sm bg-slate-50 p-4 rounded border border-slate-200 italic">
                    "{expandedModalRecord.academicNotes}"
                  </p>
                </div>
              )}

              {/* Connected Relationships & Publications */}
              <div>
                <h3 className="text-sm font-semibold text-slate-500 mb-3">Linked Primary Sources & Publications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {expandedModalRecord.relationships.map((rel) => (
                    <div key={rel.id} className="bg-slate-50 p-4 rounded border border-slate-200">
                      <div className="font-semibold text-slate-900 text-sm flex flex-wrap items-center justify-between gap-2">
                        <span>{rel.title}</span>
                        {rel.publisher && <span className="text-sm text-slate-500 font-normal">{rel.publisher}</span>}
                      </div>
                      <p className="text-sm text-slate-600 mt-1 line-clamp-2">{rel.summary}</p>
                      {rel.url && (
                        <a
                          href={rel.url}
                          className="inline-block text-sm text-sky-700 font-semibold mt-2 hover:underline"
                        >
                          Access Reference Link
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Raw Spatial Geometry Inspector */}
              <div>
                <h3 className="text-sm font-semibold text-slate-500 mb-2">Spatial GeoJSON Feature Definition</h3>
                <pre className="bg-slate-900 p-4 rounded text-sm text-slate-200 font-mono overflow-x-auto">
{JSON.stringify({
  type: "Feature",
  geometry: { type: "Point", coordinates: [expandedModalRecord.lng, expandedModalRecord.lat] },
  properties: {
    id: expandedModalRecord.id,
    referenceId: expandedModalRecord.referenceId,
    name: expandedModalRecord.name,
    category: expandedModalRecord.categoryLabel,
    custodian: expandedModalRecord.custodian,
    zone: expandedModalRecord.zone,
    surveyDate: expandedModalRecord.surveyDate
  }
}, null, 2)}
                </pre>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-6 mt-6 border-t border-slate-200">
              <div className="flex flex-wrap gap-2">
                {expandedModalRecord.siteRegisterSlug && (
                  <a
                    href={`/site-register/${expandedModalRecord.siteRegisterSlug}`}
                    className="rounded bg-sky-700 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-600 transition-colors "
                  >
                  View Site Register Entry {expandedModalRecord.referenceId ? `(${expandedModalRecord.referenceId})` : ''}
                  </a>
                )}
                {expandedModalRecord.encyclopediaSlug && (
                  <a
                    href={`/encyclopedia/${expandedModalRecord.encyclopediaSlug}`}
                    className="rounded bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 transition-colors "
                  >
                    Read Encyclopedia Article
                  </a>
                )}
                <button
                  onClick={() => handleShareLocation(expandedModalRecord)}
                  className="rounded border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5 "
                >
                  {copyFeedback === expandedModalRecord.id ? (
                    <span className="text-emerald-600 font-semibold">Link Copied!</span>
                  ) : (
                    <>
                      <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 100-2.684 3 3 0 000 2.684zm0 9a3 3 0 100-2.684 3 3 0 000 2.684" />
                      </svg>
                      <span>Share Direct Link</span>
                    </>
                  )}
                </button>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${expandedModalRecord.lat},${expandedModalRecord.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5 "
                >
                  <svg className="w-3.5 h-3.5 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Open in Google Maps</span>
                </a>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    handleFocusRecord(expandedModalRecord);
                    setExpandedModalRecord(null);
                  }}
                  className="rounded bg-slate-100 border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-200 transition-colors"
                >
                  Focus Location on Map
                </button>
                <button
                  onClick={() => setExpandedModalRecord(null)}
                  className="rounded border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Close Report
                </button>
              </div>
            </div>

          </div>
        </Modal>
      )}

      {/* ADD SITE MODAL */}
      {isAddModalOpen && (
        <Modal label="Suggest a place or record" onClose={() => setIsAddModalOpen(false)}>
          <div className="w-full max-w-lg rounded bg-white p-6 border border-slate-200 text-slate-900">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Suggest a place or record</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="rounded border border-slate-200 bg-slate-50 px-2.5 py-1 text-sm font-semibold text-slate-500 hover:text-slate-900"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleCreateRecord} className="space-y-4 text-sm">
              <div>
                <label htmlFor="newSiteName" className="block font-semibold text-slate-700 mb-1">Landmark / Site Name *</label>
                <input
                  type="text"
                  required
                  placeholder="For example, Dzaleka Youth Center"
                  id="newSiteName" value={newSiteName}
                  onChange={(e) => setNewSiteName(e.target.value)}
                  className="w-full rounded border border-slate-200 bg-white p-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:outline-none "
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="newSiteCategory" className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    id="newSiteCategory" value={newSiteCategory}
                    onChange={(e) => setNewSiteCategory(e.target.value as RecordCategory)}
                    className="w-full rounded border border-slate-200 bg-white p-2.5 text-sm text-slate-900 focus:border-slate-400 focus:outline-none "
                  >
                    <option value="cultural_site">Cultural Site</option>
                    <option value="land_tenement">Land Boundary</option>
                    <option value="heritage_survey">Spatial Survey</option>
                    <option value="oral_history">Oral History</option>
                    <option value="public_service">Public Service</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="newSiteProtocol" className="block font-semibold text-slate-700 mb-1">Protocol Access</label>
                  <select
                    id="newSiteProtocol" value={newSiteProtocol}
                    onChange={(e) => setNewSiteProtocol(e.target.value as CulturalProtocolLevel)}
                    className="w-full rounded border border-slate-200 bg-white p-2.5 text-sm text-slate-900 focus:border-slate-400 focus:outline-none "
                  >
                    <option value="public">Public Access</option>
                    <option value="community">Community Access</option>
                    <option value="restricted">Restricted Access</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="newSiteLat" className="block font-semibold text-slate-700 mb-1">Latitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    id="newSiteLat" value={newSiteLat}
                    onChange={(e) => setNewSiteLat(parseFloat(e.target.value))}
                    className="w-full rounded border border-slate-200 bg-white p-2.5 text-sm text-slate-900 focus:border-slate-400 focus:outline-none "
                  />
                </div>
                <div>
                  <label htmlFor="newSiteLng" className="block font-semibold text-slate-700 mb-1">Longitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    id="newSiteLng" value={newSiteLng}
                    onChange={(e) => setNewSiteLng(parseFloat(e.target.value))}
                    className="w-full rounded border border-slate-200 bg-white p-2.5 text-sm text-slate-900 focus:border-slate-400 focus:outline-none "
                  />
                </div>
              </div>

              <div>
                <label htmlFor="newSiteZone" className="block font-semibold text-slate-700 mb-1">Zone / Sector</label>
                <input
                  type="text"
                  id="newSiteZone" value={newSiteZone}
                  onChange={(e) => setNewSiteZone(e.target.value)}
                  className="w-full rounded border border-slate-200 bg-white p-2.5 text-sm text-slate-900 focus:border-slate-400 focus:outline-none "
                />
              </div>

              <div>
                <label htmlFor="newSiteSummary" className="block font-semibold text-slate-700 mb-1">Field Notes</label>
                <textarea
                  rows={3}
                  placeholder="Record spatial notes..."
                  id="newSiteSummary" value={newSiteSummary}
                  onChange={(e) => setNewSiteSummary(e.target.value)}
                  className="w-full rounded border border-slate-200 bg-white p-2.5 text-sm text-slate-900 focus:border-slate-400 focus:outline-none "
                />
              </div>

              <div className="space-y-2 pt-3 border-t border-slate-200">
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="rounded border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-sm text-slate-700 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded bg-sky-700 px-4 py-1.5 text-sm font-semibold text-white hover:bg-sky-600 transition-colors "
                  >
                    Submit Record via Email & Save
                  </button>
                </div>
                <div className="text-center pt-1">
                  <a
                    href="/site-register/submit"
                    className="text-sm text-slate-500 hover:text-sky-700 hover:underline"
                  >
                    Or use the complete Site Register Web Submission Form &rarr;
                  </a>
                </div>
              </div>
            </form>
          </div>
        </Modal>
      )}

    </div>
  );
};
