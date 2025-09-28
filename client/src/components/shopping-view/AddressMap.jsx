import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Loader2 } from "lucide-react";

// Fix for default marker not showing
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function AddressMap({ formData, setFormData }) {
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition([latitude, longitude]);

          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            );
            const data = await response.json();

            setFormData((prev) => ({
              ...prev,
              address: data.display_name || "",
              city:
                data.address.city ||
                data.address.town ||
                data.address.village ||
                "",
              pincode: data.address.postcode || "",
            }));
          } catch (error) {
            console.error("Reverse geocoding failed:", error);
          } finally {
            setLoading(false);
          }
        },
        (err) => {
          console.error("Geolocation error:", err);
          setPosition([28.6139, 77.209]); // fallback Delhi
          setLoading(false);
        }
      );
    } else {
      setLoading(false);
    }
  }, [setFormData]);

  return (
    <div className="w-full h-[475px] flex items-center justify-center rounded-lg border border-gray-200">
      {loading || !position ? (
        <Loader2 className="animate-spin w-10 h-10 text-gray-500" />
      ) : (
        <MapContainer
          center={position}
          zoom={16}
          className="w-full h-full rounded-lg"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          />
          <Marker position={position}>
            <Popup>You are here</Popup>
          </Marker>
        </MapContainer>
      )}
    </div>
  );
}

export default AddressMap;
