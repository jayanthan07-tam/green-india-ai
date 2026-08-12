import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MOCK_COMPLAINTS } from "../../data/mockData";
import { Complaint } from "../../types";
import {
  MapPin,
  Filter,
  Search,
  Navigation,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Layers,
  Sparkles,
  ExternalLink,
  ChevronRight,
} from "lucide-react";

export const LiveMapPage: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});

  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeComplaint, setActiveComplaint] = useState<Complaint | null>(MOCK_COMPLAINTS[0]);
  const [geoLocating, setGeoLocating] = useState<boolean>(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [geoNotice, setGeoNotice] = useState<string | null>(null);

  // Quick City Presets
  const CITIES = [
    { name: "New Delhi", lat: 28.6139, lng: 77.2090 },
    { name: "Mumbai", lat: 19.0760, lng: 72.8777 },
    { name: "Bengaluru", lat: 12.9716, lng: 77.5946 },
    { name: "Chennai", lat: 13.0827, lng: 80.2707 },
  ];

  const flyToCity = (lat: number, lng: number, name: string) => {
    setGeoNotice(`📍 Centered map view on ${name}`);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([lat, lng], 12, { animate: true });
    }
  };

  // Filter complaints
  const filteredComplaints = MOCK_COMPLAINTS.filter((item) => {
    const matchesCat = selectedCategory === "All" || item.category === selectedCategory;
    const matchesStatus =
      selectedStatus === "All" ||
      (selectedStatus === "Resolved" && item.status.includes("Resolved")) ||
      (selectedStatus === "Active" && !item.status.includes("Resolved"));
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesStatus && matchesSearch;
  });

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Default centered on India / Delhi
      const map = L.map(mapContainerRef.current, {
        center: [28.6139, 77.2090], // Delhi
        zoom: 11,
        zoomControl: true,
      });

      // Add OpenStreetMap Tile Layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Green India AI',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear old markers
    Object.values(markersRef.current).forEach((m) => map.removeLayer(m));
    markersRef.current = {};

    // Helper for marker colors
    const getMarkerColor = (status: string) => {
      if (status.includes("Resolved")) return "#10B981"; // Green
      if (status.includes("Progress")) return "#F59E0B"; // Amber
      if (status.includes("Assigned")) return "#3B82F6"; // Blue
      return "#EF4444"; // Red
    };

    // Render Markers for filtered complaints
    filteredComplaints.forEach((cmp) => {
      if (cmp.lat && cmp.lng) {
        const color = getMarkerColor(cmp.status);

        // Custom HTML Icon for Marker
        const customIcon = L.divIcon({
          className: "custom-leaflet-marker",
          html: `
            <div style="
              background-color: ${color};
              width: 32px;
              height: 32px;
              border-radius: 50%;
              border: 3px solid white;
              box-shadow: 0 4px 10px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-weight: bold;
              font-size: 14px;
              cursor: pointer;
            ">
              🌿
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
          popupAnchor: [0, -18],
        });

        const popupContent = `
          <div style="font-family: sans-serif; padding: 4px; max-width: 220px;">
            <div style="font-size: 11px; font-weight: 800; color: #064E3B; text-transform: uppercase;">${cmp.ticketNumber}</div>
            <div style="font-size: 13px; font-weight: 700; margin-top: 2px; color: #111827;">${cmp.title}</div>
            <div style="font-size: 11px; color: #4B5563; margin-top: 4px;">📍 ${cmp.location}</div>
            <div style="margin-top: 6px; display: inline-block; padding: 2px 6px; background: ${color}20; color: ${color}; border-radius: 4px; font-size: 10px; font-weight: 700;">
              ${cmp.status}
            </div>
          </div>
        `;

        const marker = L.marker([cmp.lat, cmp.lng], { icon: customIcon })
          .addTo(map)
          .bindPopup(popupContent);

        marker.on("click", () => {
          setActiveComplaint(cmp);
        });

        markersRef.current[cmp.id] = marker;
      }
    });

    // Auto-fit bounds if markers exist
    if (filteredComplaints.length > 0) {
      const validPoints = filteredComplaints
        .filter((c) => c.lat && c.lng)
        .map((c) => [c.lat!, c.lng!] as [number, number]);

      if (validPoints.length > 0) {
        const bounds = L.latLngBounds(validPoints);
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 13 });
      }
    }
  }, [selectedCategory, selectedStatus, searchQuery]);

  // Center map on specific complaint
  const handleSelectComplaint = (cmp: Complaint) => {
    setActiveComplaint(cmp);
    if (mapInstanceRef.current && cmp.lat && cmp.lng) {
      mapInstanceRef.current.setView([cmp.lat, cmp.lng], 14, { animate: true });
      if (markersRef.current[cmp.id]) {
        markersRef.current[cmp.id].openPopup();
      }
    }
  };

  // Find My GPS Location
  const handleLocateMe = () => {
    setGeoNotice(null);
    if (!navigator.geolocation) {
      setGeoNotice("⚠️ Geolocation is not supported by your browser environment. Centered on Default City Center.");
      flyToCity(28.6139, 77.2090, "New Delhi");
      return;
    }

    setGeoLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGeoLocating(false);
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setUserLocation({ lat, lng });
        setGeoNotice("🎯 GPS Location detected and centered on map!");

        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([lat, lng], 14, { animate: true });

          // Drop user location pin
          const userIcon = L.divIcon({
            className: "user-gps-marker",
            html: `
              <div style="
                background-color: #064E3B;
                width: 36px;
                height: 36px;
                border-radius: 50%;
                border: 3px solid #10B981;
                box-shadow: 0 0 15px rgba(16,185,129,0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 16px;
              ">
                📍
              </div>
            `,
            iconSize: [36, 36],
            iconAnchor: [18, 18],
          });

          L.marker([lat, lng], { icon: userIcon })
            .addTo(mapInstanceRef.current)
            .bindPopup("<b>Your Current GPS Location</b>")
            .openPopup();
        }
      },
      (err) => {
        setGeoLocating(false);
        setGeoNotice("ℹ️ Browser GPS permission restricted in preview frame. Showing Central Municipal Map (Delhi). Select a city below.");
        flyToCity(28.6139, 77.2090, "New Delhi");
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-[#064E3B] text-xs font-bold px-3 py-1 rounded-full mb-1">
              <MapPin className="w-3.5 h-3.5 text-[#10B981]" />
              <span>Interactive Geospatial Portal</span>
            </div>
            <h1 className="text-xl font-bold text-[#064E3B]">Live Civic Issue GIS Map</h1>
            <p className="text-xs text-stone-500">Real-time complaint locations, AI verification status, and district pins</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleLocateMe}
              disabled={geoLocating}
              className="flex items-center gap-2 bg-[#064E3B] hover:bg-[#043327] text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer disabled:opacity-50"
            >
              <Navigation className={`w-3.5 h-3.5 ${geoLocating ? "animate-spin text-amber-400" : "text-[#10B981]"}`} />
              <span>{geoLocating ? "Locating GPS..." : "Find My Location"}</span>
            </button>
          </div>
        </div>

        {/* City Shortcuts Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-[11px] font-bold text-stone-500 shrink-0">Quick City Focus:</span>
          {CITIES.map((c) => (
            <button
              key={c.name}
              onClick={() => flyToCity(c.lat, c.lng, c.name)}
              className="px-2.5 py-1 bg-stone-100 hover:bg-emerald-100 text-stone-700 hover:text-[#064E3B] rounded-lg font-bold transition-colors cursor-pointer shrink-0 border border-stone-200"
            >
              📍 {c.name}
            </button>
          ))}
        </div>

        {geoNotice && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-[#064E3B] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#10B981] shrink-0" />
            <span>{geoNotice}</span>
          </div>
        )}

        {/* Search & Filter Toolbar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search address, landmark, or ticket #..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:border-[#10B981] outline-none"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-stone-400 shrink-0" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:border-[#10B981] outline-none"
            >
              <option value="All">All Categories</option>
              <option value="Sanitation & Waste">Sanitation & Waste</option>
              <option value="Potholes & Roads">Potholes & Roads</option>
              <option value="Water Supply">Water Supply</option>
              <option value="Street Lighting">Street Lighting</option>
              <option value="Air & Environmental">Air & Environmental</option>
              <option value="Tree Plantation">Tree Plantation</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-stone-400 shrink-0" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:border-[#10B981] outline-none"
            >
              <option value="All">All Resolution States</option>
              <option value="Resolved">🟢 Resolved (AI Verified)</option>
              <option value="Active">🟡 Active / In Progress</option>
            </select>
          </div>
        </div>
      </div>

      {/* Map & Detail Drawer Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Leaflet Map View */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-stone-200 p-2 shadow-sm space-y-2">
          {/* Leaflet Container Div */}
          <div
            ref={mapContainerRef}
            className="w-full h-[480px] rounded-xl overflow-hidden border border-stone-300 z-10"
            style={{ minHeight: "450px" }}
          />

          {/* Map Legend Footer */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-600">
            <span className="font-bold text-[#064E3B] flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#10B981]" />
              Showing {filteredComplaints.length} Map Pins
            </span>

            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
                <span>Resolved</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
                <span>In Progress</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]" />
                <span>Assigned</span>
              </span>
            </div>
          </div>
        </div>

        {/* Selected Complaint Detail Sidebar */}
        <div className="space-y-4">
          {activeComplaint ? (
            <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <span className="font-mono text-xs font-black text-[#064E3B] bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                  {activeComplaint.ticketNumber}
                </span>
                <span
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                    activeComplaint.status.includes("Resolved")
                      ? "bg-emerald-100 text-[#064E3B]"
                      : "bg-amber-100 text-amber-900"
                  }`}
                >
                  {activeComplaint.status}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-sm text-stone-900">{activeComplaint.title}</h3>
                <p className="text-xs text-stone-500 mt-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                  <span>{activeComplaint.location}</span>
                </p>
              </div>

              {/* Before and After Image Proof Comparison */}
              <div className="grid grid-cols-2 gap-2">
                <div className="border border-stone-200 rounded-xl overflow-hidden bg-stone-100 text-center">
                  <p className="text-[10px] font-bold text-stone-500 py-1 bg-stone-200/60">BEFORE PHOTO</p>
                  <img
                    src={activeComplaint.beforeImageUrl}
                    alt="Before"
                    className="w-full h-24 object-cover"
                  />
                </div>

                <div className="border border-stone-200 rounded-xl overflow-hidden bg-stone-100 text-center">
                  <p className="text-[10px] font-bold text-stone-500 py-1 bg-stone-200/60">AFTER PHOTO</p>
                  {activeComplaint.afterImageUrl ? (
                    <img
                      src={activeComplaint.afterImageUrl}
                      alt="After"
                      className="w-full h-24 object-cover"
                    />
                  ) : (
                    <div className="h-24 flex items-center justify-center text-[10px] text-stone-400 p-2 text-center">
                      Awaiting Department Resolution
                    </div>
                  )}
                </div>
              </div>

              {/* AI Verification Badge */}
              {activeComplaint.aiVerificationScore && (
                <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-xl space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold text-[#064E3B]">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-[#10B981]" />
                      <span>AI Verification Score</span>
                    </span>
                    <span className="text-sm font-black text-[#10B981]">
                      {activeComplaint.aiVerificationScore}%
                    </span>
                  </div>
                  {activeComplaint.aiAnalysisNotes && (
                    <p className="text-[11px] text-stone-600 line-clamp-3">
                      {activeComplaint.aiAnalysisNotes}
                    </p>
                  )}
                </div>
              )}

              <div className="pt-2 text-xs space-y-1.5 text-stone-600 border-t border-stone-100">
                <div className="flex justify-between">
                  <span className="text-stone-400">Department:</span>
                  <span className="font-bold text-stone-800">{activeComplaint.assignedDepartment}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Reported By:</span>
                  <span className="font-bold text-stone-800">{activeComplaint.submittedBy}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-6 border border-stone-200 text-center text-stone-500 text-xs">
              Click on any map pin to inspect complaint proof details
            </div>
          )}

          {/* List of complaints list underneath */}
          <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-[#064E3B] uppercase tracking-wider">
              Locations List ({filteredComplaints.length})
            </h4>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {filteredComplaints.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSelectComplaint(item)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                    activeComplaint?.id === item.id
                      ? "border-[#10B981] bg-emerald-50/80 shadow-2xs"
                      : "border-stone-200 bg-stone-50 hover:bg-stone-100/80"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="font-bold text-stone-900 line-clamp-1">{item.title}</div>
                    <div className="text-[11px] text-stone-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#10B981]" />
                      <span className="truncate max-w-[180px]">{item.location}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-stone-400 shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

