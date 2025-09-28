import { MapContainer, TileLayer } from "react-leaflet";
import { Loader2 } from "lucide-react";

function CircleMapPreview({ position = [28.6139, 77.209], zoom, label, borderColor, loading }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`relative w-36 h-36 rounded-full overflow-hidden border-2 ${borderColor} shadow-md`}
      >
        {/* Map always visible */}
        <MapContainer
          center={position}
          zoom={zoom}
          className="w-full h-full"
          zoomControl={false}
          dragging={false}
          scrollWheelZoom={false}
          doubleClickZoom={false}
          attributionControl={false}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        </MapContainer>

        {/* Loader overlay only when fetching */}
        {loading && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
          </div>
        )}
      </div>
      <span className="text-sm font-rajdhani text-gray-500 text-[16px]">{label}</span>
    </div>
  );
}

export default CircleMapPreview;
