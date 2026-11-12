import React, { useState, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L, { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  FaSearch,
  FaMapMarkerAlt,
  FaTimes,
  FaCheckCircle,
  FaCompass,
} from "react-icons/fa";

const centerPosition: LatLngExpression = [23.685, 90.3563]; // Center of Bangladesh

const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
});

interface FlyToDistrictProps {
  coords: [number, number] | null;
}

function FlyToDistrict({ coords }: FlyToDistrictProps): null {
  const map = useMap();
  React.useEffect(() => {
    if (coords) {
      map.flyTo(coords, 11, { duration: 1.5 });
    }
  }, [coords, map]);
  return null;
}

export interface ServiceCenter {
  region?: string;
  district: string;
  latitude: number;
  longitude: number;
  covered_area: string[];
}

interface BangladeshMapProps {
  serviceCenters: ServiceCenter[];
}

const popularDistricts = ["Dhaka", "Chattogram", "Sylhet", "Rajshahi", "Khulna", "Barishal"];

const BangladeshMap: React.FC<BangladeshMapProps> = ({ serviceCenters = [] }) => {
  const [searchText, setSearchText] = useState("");
  const [activeCoords, setActiveCoords] = useState<[number, number] | null>(null);
  const [activeDistrict, setActiveDistrict] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Suggestions for auto-complete
  const filteredSuggestions = useMemo(() => {
    if (!searchText.trim() || !Array.isArray(serviceCenters)) return [];
    const query = searchText.toLowerCase().trim();
    return serviceCenters
      .filter((s) => s.district?.toLowerCase().includes(query))
      .slice(0, 5);
  }, [searchText, serviceCenters]);

  const selectDistrict = (districtItem: ServiceCenter) => {
    setActiveCoords([districtItem.latitude, districtItem.longitude]);
    setActiveDistrict(districtItem.district);
    setSearchText(districtItem.district);
    setShowDropdown(false);
    setStatusMessage(`Showing delivery coverage for ${districtItem.district}`);
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!searchText.trim() || !Array.isArray(serviceCenters)) return;

    const query = searchText.toLowerCase().trim();
    const found = serviceCenters.find((d) =>
      d.district?.toLowerCase().includes(query)
    );

    if (found) {
      selectDistrict(found);
    } else {
      setStatusMessage(`No service hub found for "${searchText}". Please check spelling.`);
      setTimeout(() => setStatusMessage(null), 4000);
    }
  };

  const handleClear = () => {
    setSearchText("");
    setShowDropdown(false);
  };

  return (
    <div className="h-[620px] md:h-[720px] w-full rounded-3xl overflow-hidden shadow-xl border border-slate-200/80 relative bg-slate-50 isolate z-0">
      {/* Floating Modern Search Bar */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 w-[92%] sm:w-full sm:max-w-lg">
        <form
          onSubmit={handleSearch}
          className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200/90 p-1.5 flex items-center gap-2 transition-all focus-within:ring-2 focus-within:ring-[#20363A]"
        >
          <div className="pl-3 text-slate-400">
            <FaSearch className="text-sm" />
          </div>

          <input
            type="text"
            placeholder="Search any district (e.g. Dhaka, Bogura, Sylhet)..."
            className="flex-1 bg-transparent py-2 text-xs md:text-sm text-slate-800 placeholder-slate-400 focus:outline-none font-medium"
            value={searchText}
            onFocus={() => setShowDropdown(true)}
            onChange={(e) => {
              setSearchText(e.target.value);
              setShowDropdown(true);
            }}
          />

          {searchText && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              title="Clear search"
            >
              <FaTimes className="text-xs" />
            </button>
          )}

          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-[#20363A] hover:bg-[#20363A]/90 text-[#CAEB66] text-xs font-bold transition-all shadow-xs shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <FaCompass className="text-xs" />
            Locate
          </button>
        </form>

        {/* Auto-complete Dropdown */}
        {showDropdown && filteredSuggestions.length > 0 && (
          <div className="mt-1.5 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden divide-y divide-slate-100 max-h-56 overflow-y-auto animate-in fade-in slide-in-from-top-1 duration-150">
            {filteredSuggestions.map((item) => (
              <button
                key={item.district}
                type="button"
                onClick={() => selectDistrict(item)}
                className="w-full text-left px-4 py-2.5 hover:bg-slate-50 transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                    <FaMapMarkerAlt className="text-[10px]" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 group-hover:text-[#20363A]">
                      {item.district}
                    </span>
                    {item.region && (
                      <span className="text-[10px] text-slate-400 ml-1.5">
                        ({item.region} Region)
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-[10px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                  {item.covered_area?.length || 0} covered zones
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Quick Filter Pill Chips */}
        <div className="mt-2 flex flex-wrap items-center gap-1.5 justify-center sm:justify-start">
          <span className="text-[10px] font-bold text-slate-600 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-full shadow-xs border border-slate-200/70">
            Quick Hubs:
          </span>
          {popularDistricts.map((city) => (
            <button
              key={city}
              type="button"
              onClick={() => {
                const target = serviceCenters.find(
                  (s) => s.district?.toLowerCase() === city.toLowerCase()
                );
                if (target) selectDistrict(target);
              }}
              className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-white/90 backdrop-blur-xs text-slate-700 hover:text-[#20363A] hover:bg-[#CAEB66]/30 border border-slate-200 shadow-xs transition-all cursor-pointer"
            >
              {city}
            </button>
          ))}
        </div>

        {/* Dynamic status pill notification */}
        {statusMessage && (
          <div className="mt-2 text-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#20363A] text-white shadow-lg animate-in fade-in duration-200">
              <FaCheckCircle className="text-[#CAEB66] text-xs" />
              {statusMessage}
            </span>
          </div>
        )}
      </div>

      {/* Map container */}
      <MapContainer
        center={centerPosition}
        zoom={7}
        scrollWheelZoom={false}
        className="h-full w-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FlyToDistrict coords={activeCoords} />

        {Array.isArray(serviceCenters) &&
          serviceCenters.map((center, index) => (
            <Marker
              key={center.district || index}
              position={[center.latitude, center.longitude]}
              icon={customIcon}
            >
              <Popup autoPan={center.district === activeDistrict}>
                <div className="p-1 min-w-[180px]">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#20363A] pb-1 border-b border-slate-200">
                    <FaMapMarkerAlt className="text-emerald-500 text-xs" />
                    {center.district} Service Hub
                  </div>
                  {center.region && (
                    <div className="text-[10px] text-slate-400 mt-1 font-medium">
                      Region: {center.region}
                    </div>
                  )}
                  <div className="mt-2">
                    <div className="text-[10px] font-bold text-slate-600 mb-1">
                      Covered Upazilas & Zones:
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {Array.isArray(center.covered_area) &&
                        center.covered_area.map((area, aIdx) => (
                          <span
                            key={aIdx}
                            className="inline-block bg-slate-100 text-slate-700 text-[10px] font-medium px-1.5 py-0.5 rounded"
                          >
                            {area}
                          </span>
                        ))}
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </div>
  );
};

export default BangladeshMap;
