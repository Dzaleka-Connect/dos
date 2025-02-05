import { useEffect, useRef } from 'react';
import type { Map as LeafletMap } from 'leaflet';

interface MapPoint {
  type: 'health' | 'education' | 'service';
  lat: number;
  lng: number;
  name: string;
  description: string;
}

const campPoints: MapPoint[] = [
  {
    type: 'health',
    lat: -13.7227,
    lng: 33.9275,
    name: 'Dzaleka Health Centre',
    description: 'Main medical facility providing primary healthcare services to the camp community'
  },
  {
    type: 'education',
    lat: -13.7225,
    lng: 33.9280,
    name: 'Dzaleka Community Secondary School',
    description: 'Secondary education facility serving refugee students'
  },
  {
    type: 'education',
    lat: -13.7223,
    lng: 33.9278,
    name: 'JRS Primary School',
    description: 'Primary education facility run by Jesuit Refugee Service'
  },
  {
    type: 'service',
    lat: -13.7226,
    lng: 33.9273,
    name: 'Community Center',
    description: 'Multi-purpose facility for community activities and programs'
  },
  {
    type: 'service',
    lat: -13.7224,
    lng: 33.9277,
    name: 'New Finance Bank Branch',
    description: 'Banking services for refugees and local community'
  }
];

export function CampMap() {
  const mapRef = useRef<LeafletMap | null>(null);
  const mapContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const initializeMap = async () => {
      if (!mapContainer.current || mapRef.current) return;

      // Dynamically import Leaflet
      const L = (await import('leaflet')).default;
      await import('leaflet/dist/leaflet.css');

      // Initialize map
      mapRef.current = L.map(mapContainer.current).setView([-13.7227, 33.9275], 15);

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: ' OpenStreetMap contributors'
      }).addTo(mapRef.current);

      // Add markers for each point
      campPoints.forEach(point => {
        const marker = L.marker([point.lat, point.lng])
          .bindPopup(`
            <strong>${point.name}</strong><br>
            ${point.description}
          `)
          .addTo(mapRef.current!);

        // Add custom icon based on point type
        const icon = L.divIcon({
          className: `map-icon ${point.type}`,
          html: getIconHtml(point.type),
          iconSize: [30, 30]
        });
        marker.setIcon(icon);
      });
    };

    initializeMap();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  function getIconHtml(type: string): string {
    const icons = {
      health: '',
      education: '',
      service: ''
    };
    return icons[type as keyof typeof icons] || '';
  }

  return (
    <div>
      <div ref={mapContainer} style={{ height: '400px', width: '100%' }} />
      <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
        <div className="flex items-center">
          <span className="mr-2"></span>
          <span>Health Facilities</span>
        </div>
        <div className="flex items-center">
          <span className="mr-2"></span>
          <span>Education Centers</span>
        </div>
        <div className="flex items-center">
          <span className="mr-2"></span>
          <span>Service Points</span>
        </div>
      </div>
    </div>
  );
}
