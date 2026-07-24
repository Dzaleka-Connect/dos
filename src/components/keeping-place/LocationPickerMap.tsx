import React, { useEffect, useRef, useState } from 'react';

interface LocationPickerMapProps {
  initialLat?: number;
  initialLng?: number;
  onLocationChange?: (lat: number, lng: number) => void;
}

export default function LocationPickerMap({
  initialLat = -13.6592,
  initialLng = 33.8705,
  onLocationChange
}: LocationPickerMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  const [coords, setCoords] = useState<{ lat: number; lng: number }>({
    lat: initialLat,
    lng: initialLng
  });

  useEffect(() => {
    let isCancelled = false;

    const initMap = async () => {
      if (typeof window === 'undefined' || !mapContainerRef.current) return;

      // Inject Leaflet CSS if not already present
      if (!document.getElementById('leaflet-css-link')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css-link';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      const L = (await import('leaflet')).default;
      if (isCancelled || !mapContainerRef.current) return;

      // Cleanup existing instance if any
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      const map = L.map(mapContainerRef.current, {
        center: [initialLat, initialLng],
        zoom: 16,
        zoomControl: true
      });
      mapInstanceRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(map);

      const customPinIcon = L.divIcon({
        className: 'custom-picker-pin',
        html: `
          <div style="
            background-color: #0284c7;
            color: #ffffff;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: 700;
            white-space: nowrap;
            border: 2px solid #0f172a;
            box-shadow: 0 4px 8px rgba(0,0,0,0.35);
            display: inline-flex;
            align-items: center;
            gap: 6px;
            cursor: move;
          ">
            <span style="
              width: 8px;
              height: 8px;
              background-color: #38bdf8;
              border-radius: 50%;
              display: inline-block;
            "></span>
            <span>Drag Pin to Location</span>
          </div>
        `,
        iconSize: [160, 30],
        iconAnchor: [80, 15]
      });

      const marker = L.marker([initialLat, initialLng], {
        icon: customPinIcon,
        draggable: true
      }).addTo(map);
      markerRef.current = marker;

      const handleUpdate = (lat: number, lng: number) => {
        setCoords({ lat, lng });
        if (onLocationChange) {
          onLocationChange(lat, lng);
        }
        // Update hidden inputs if present
        const latInput = document.getElementById('lat') as HTMLInputElement;
        const lngInput = document.getElementById('lng') as HTMLInputElement;
        const coordDisplay = document.getElementById('coordDisplay');
        if (latInput) latInput.value = lat.toFixed(5);
        if (lngInput) lngInput.value = lng.toFixed(5);
        if (coordDisplay) coordDisplay.textContent = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
      };

      marker.on('dragend', () => {
        const pos = marker.getLatLng();
        handleUpdate(pos.lat, pos.lng);
      });

      map.on('click', (e: any) => {
        marker.setLatLng(e.latlng);
        handleUpdate(e.latlng.lat, e.latlng.lng);
      });

      setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      }, 250);
    };

    initMap();

    return () => {
      isCancelled = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const handleManualLatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (!isNaN(val)) {
      setCoords((prev) => ({ ...prev, lat: val }));
      if (markerRef.current) markerRef.current.setLatLng([val, coords.lng]);
      if (mapInstanceRef.current) mapInstanceRef.current.setView([val, coords.lng]);
      if (onLocationChange) onLocationChange(val, coords.lng);
    }
  };

  const handleManualLngChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (!isNaN(val)) {
      setCoords((prev) => ({ ...prev, lng: val }));
      if (markerRef.current) markerRef.current.setLatLng([coords.lat, val]);
      if (mapInstanceRef.current) mapInstanceRef.current.setView([coords.lat, val]);
      if (onLocationChange) onLocationChange(coords.lat, val);
    }
  };

  return (
    <div class="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
          Interactive Pin Coordinate Picker <span className="text-red-500">*</span>
        </label>
        <span className="text-xs text-sky-700 font-mono font-semibold" id="coordDisplay">
          {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
        </span>
      </div>
      <p className="text-xs text-slate-500">
        Click anywhere on the map or drag the pin to set exact coordinates.
      </p>

      <div
        ref={mapContainerRef}
        className="h-80 w-full rounded-xl border border-slate-300 bg-slate-100 shadow-inner overflow-hidden z-0"
        style={{ minHeight: '320px' }}
      />

      <div className="grid grid-cols-2 gap-4 pt-1">
        <div>
          <label htmlFor="lat" className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
            Latitude
          </label>
          <input
            type="number"
            step="any"
            id="lat"
            name="lat"
            value={coords.lat.toFixed(5)}
            onChange={handleManualLatChange}
            required
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 font-mono focus:border-sky-500 outline-none"
          />
        </div>
        <div>
          <label htmlFor="lng" className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
            Longitude
          </label>
          <input
            type="number"
            step="any"
            id="lng"
            name="lng"
            value={coords.lng.toFixed(5)}
            onChange={handleManualLngChange}
            required
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 font-mono focus:border-sky-500 outline-none"
          />
        </div>
      </div>
    </div>
  );
}
