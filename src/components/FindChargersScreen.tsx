import React, { useState } from 'react';
import { EVStation } from '../types';

interface FindChargersScreenProps {
  stations: EVStation[];
  selectedStation: EVStation;
  onSelectStation: (station: EVStation) => void;
  onViewStationDetails: (stationId: string) => void;
}

export const FindChargersScreen: React.FC<FindChargersScreenProps> = ({
  stations,
  selectedStation,
  onSelectStation,
  onViewStationDetails,
}) => {
  // Sort state
  const [sortOption, setSortOption] = useState<string>('Closest First');
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  // Filter pills
  const [filterAvailable, setFilterAvailable] = useState(true);
  const [filterFast, setFilterFast] = useState(false);
  const [filterTesla, setFilterTesla] = useState(false);
  const [filterFreeParking, setFilterFreeParking] = useState(false);
  const [filter247, setFilter247] = useState(false);

  // Connector filters
  const [activeConnector, setActiveConnector] = useState<string>('ALL');

  // Map state
  const [mapLayer, setMapLayer] = useState<'Roads' | 'Satellite'>('Roads');
  const [showRangeRing, setShowRangeRing] = useState(true);
  const [mapZoom, setMapZoom] = useState(1);
  const [navState, setNavState] = useState<'IDLE' | 'ROUTING' | 'ACTIVE'>('IDLE');
  const [reservedStall, setReservedStall] = useState(false);
  const [currentCity, setCurrentCity] = useState('Downtown San Francisco (5 mi)');
  const [showCityModal, setShowCityModal] = useState(false);

  // Sort and filter logic
  const filteredStations = stations.filter((st) => {
    if (filterAvailable && st.availableStalls === 0) return false;
    if (filterFast && st.speedKw < 150) return false;
    if (filterTesla && !st.network.includes('Tesla')) return false;
    if (filter247 && !st.isOpen247) return false;
    if (activeConnector === 'CCS' && !st.connectorsSummary.includes('CCS')) return false;
    if (activeConnector === 'NACS' && !st.connectorsSummary.includes('NACS')) return false;
    return true;
  });

  const handleStartNav = () => {
    setNavState('ROUTING');
    setTimeout(() => {
      setNavState('ACTIVE');
      setTimeout(() => {
        setNavState('IDLE');
      }, 5000);
    }, 1200);
  };

  const handleHoldStall = () => {
    setReservedStall(true);
  };

  return (
    <div className="w-full h-[calc(100vh-5rem)] flex flex-col lg:flex-row overflow-hidden relative bg-[#f8f9ff]">
      {/* LEFT PANEL: Dynamic Discovery Feed */}
      <aside className="w-full lg:w-[460px] xl:w-[490px] shrink-0 h-full flex flex-col bg-white shadow-xl z-20 overflow-hidden border-r border-[#bbcac0]/30">
        {/* Top Geolocation & Context Bar */}
        <div className="p-space-md pb-space-sm bg-[#eff4ff] flex flex-col gap-space-sm border-b border-[#bbcac0]/20">
          <div className="flex items-center justify-between gap-space-sm">
            <div className="flex items-center gap-space-xs bg-white px-3 py-1.5 rounded-full shadow-sm border border-[#bbcac0]/20">
              <span className="material-symbols-outlined text-[#006c4b] text-[18px]">location_on</span>
              <span className="font-label-md text-label-md text-[#0b1c30] truncate max-w-[210px]">
                {currentCity}
              </span>
              <button
                onClick={() => setShowCityModal(!showCityModal)}
                className="text-[#006c4b] hover:text-[#005138] transition-colors text-label-sm font-label-sm uppercase font-bold pl-1"
                type="button"
              >
                Change
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full shadow-sm text-[#0b1c30] font-label-md text-label-md hover:bg-[#e5eeff] transition-colors border border-[#bbcac0]/20"
                type="button"
              >
                <span className="text-[#565e74] text-[14px]">Sort:</span>
                <span className="font-semibold">{sortOption}</span>
                <span className="material-symbols-outlined text-[16px] text-[#565e74]">arrow_drop_down</span>
              </button>

              {showSortDropdown && (
                <div className="absolute right-0 mt-1 w-48 bg-white rounded-2xl shadow-xl p-1 z-30 flex flex-col border border-[#bbcac0]/30">
                  {['Closest First', 'Highest Power (kW)', 'Most Available Stalls', 'Lowest Price ($/kWh)'].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => {
                        setSortOption(opt);
                        setShowSortDropdown(false);
                      }}
                      className={`text-left px-3 py-2 rounded-xl font-label-md text-label-md transition-colors ${
                        sortOption === opt
                          ? 'bg-[#eff4ff] font-bold text-[#006c4b]'
                          : 'text-[#0b1c30] hover:bg-[#f8f9ff]'
                      }`}
                      type="button"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Filter Toggles (Pill Carousel) */}
          <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
            <button
              onClick={() => setFilterAvailable(!filterAvailable)}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full font-label-md text-label-md transition-all ${
                filterAvailable
                  ? 'bg-[#00c48c] text-[#004a33] font-bold shadow-sm'
                  : 'bg-white text-[#0b1c30] hover:bg-[#e5eeff] border border-[#bbcac0]/20'
              }`}
              type="button"
            >
              <span className={`w-2 h-2 rounded-full ${filterAvailable ? 'bg-[#006c4b] animate-pulse' : 'bg-gray-400'}`} />
              <span>Available Now (42)</span>
            </button>

            <button
              onClick={() => setFilterFast(!filterFast)}
              className={`shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full font-label-md text-label-md transition-all ${
                filterFast
                  ? 'bg-[#00c48c] text-[#004a33] font-bold shadow-sm'
                  : 'bg-white text-[#0b1c30] hover:bg-[#e5eeff] border border-[#bbcac0]/20'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-[#006c4b] text-[16px]">bolt</span>
              <span>DC Fast 150kW+</span>
            </button>

            <button
              onClick={() => setFilterTesla(!filterTesla)}
              className={`shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full font-label-md text-label-md transition-all ${
                filterTesla
                  ? 'bg-[#00c48c] text-[#004a33] font-bold shadow-sm'
                  : 'bg-white text-[#0b1c30] hover:bg-[#e5eeff] border border-[#bbcac0]/20'
              }`}
              type="button"
            >
              <span>Tesla Supercharger</span>
            </button>

            <button
              onClick={() => setFilterFreeParking(!filterFreeParking)}
              className={`shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full font-label-md text-label-md transition-all ${
                filterFreeParking
                  ? 'bg-[#00c48c] text-[#004a33] font-bold shadow-sm'
                  : 'bg-white text-[#0b1c30] hover:bg-[#e5eeff] border border-[#bbcac0]/20'
              }`}
              type="button"
            >
              <span>Free Parking</span>
            </button>

            <button
              onClick={() => setFilter247(!filter247)}
              className={`shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full font-label-md text-label-md transition-all ${
                filter247
                  ? 'bg-[#00c48c] text-[#004a33] font-bold shadow-sm'
                  : 'bg-white text-[#0b1c30] hover:bg-[#e5eeff] border border-[#bbcac0]/20'
              }`}
              type="button"
            >
              <span>Open 24/7</span>
            </button>
          </div>

          {/* Connector Types Filter Segment */}
          <div className="flex items-center gap-2 pt-1 overflow-x-auto pb-0.5 scrollbar-none">
            <button
              onClick={() => setActiveConnector(activeConnector === 'CCS' ? 'ALL' : 'CCS')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-label-sm text-label-sm font-semibold tracking-wide transition-colors ${
                activeConnector === 'CCS'
                  ? 'bg-[#d3e4fe] text-[#0b1c30]'
                  : 'bg-white hover:bg-[#e5eeff] text-[#0b1c30] shadow-sm border border-[#bbcac0]/20'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-[14px] text-[#006c4b]">power</span>
              <span>CCS Combo (28)</span>
            </button>

            <button
              onClick={() => setActiveConnector(activeConnector === 'NACS' ? 'ALL' : 'NACS')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-label-sm text-label-sm font-semibold tracking-wide transition-colors ${
                activeConnector === 'NACS'
                  ? 'bg-[#d3e4fe] text-[#0b1c30]'
                  : 'bg-white hover:bg-[#e5eeff] text-[#0b1c30] shadow-sm border border-[#bbcac0]/20'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-[14px] text-[#494bd6]">offline_bolt</span>
              <span>NACS (34)</span>
            </button>

            <button
              onClick={() => setActiveConnector('ALL')}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white hover:bg-[#e5eeff] text-[#0b1c30] font-label-sm text-label-sm font-semibold tracking-wide shadow-sm border border-[#bbcac0]/20"
              type="button"
            >
              <span>J1772 (19)</span>
            </button>

            <button
              onClick={() => setActiveConnector('ALL')}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white hover:bg-[#e5eeff] text-[#0b1c30] font-label-sm text-label-sm font-semibold tracking-wide shadow-sm border border-[#bbcac0]/20"
              type="button"
            >
              <span>CHAdeMO (6)</span>
            </button>
          </div>
        </div>

        {/* Station List Cards Feed */}
        <div className="flex-1 overflow-y-auto p-space-md flex flex-col gap-space-md scrollbar-none">
          {/* Live Alert Banner */}
          <div className="bg-[#eff4ff] p-3 rounded-2xl flex items-center gap-space-sm shadow-sm border border-[#bbcac0]/20">
            <div className="w-8 h-8 rounded-full bg-[#3fdfa5]/30 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[#006c4b] text-[20px]">electric_meter</span>
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="font-label-md text-label-md text-[#0b1c30] font-bold">
                Dynamic Green Grid: Low Peak Rate
              </span>
              <span className="font-body-sm text-body-sm text-[#565e74] truncate">
                Renewable wind share in NorCal is 64%. Extra $0.05/kWh off.
              </span>
            </div>
          </div>

          {/* Station Cards */}
          {filteredStations.map((station) => {
            const isSelected = selectedStation.id === station.id;
            return (
              <article
                key={station.id}
                onClick={() => onSelectStation(station)}
                className={`rounded-3xl p-space-md shadow-sm transition-all cursor-pointer relative border ${
                  isSelected
                    ? 'bg-[#eff4ff] ring-2 ring-[#00c48c] border-transparent shadow-md'
                    : 'bg-white hover:shadow-md border-[#bbcac0]/20 hover:border-[#00c48c]/40'
                }`}
              >
                <div className="flex items-start justify-between gap-space-sm">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <span className="font-label-sm text-label-sm uppercase tracking-wider text-[#006c4b] font-bold">
                        {station.network}
                      </span>
                      {station.verified && (
                        <span className="material-symbols-outlined text-[#006c4b] text-[16px]" title="Verified Hub">
                          verified
                        </span>
                      )}
                    </div>
                    <h2 className="font-title-md text-title-md text-[#0b1c30] font-bold mt-0.5">
                      {station.name}
                    </h2>
                  </div>

                  {/* Availability Pill */}
                  <div
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full shrink-0 ${
                      station.availableStalls > 0
                        ? 'bg-[#63fcc0]/40 text-[#005138]'
                        : 'bg-[#dae2fd] text-[#131b2e]'
                    }`}
                  >
                    {station.availableStalls > 0 ? (
                      <>
                        <span className="w-2 h-2 rounded-full bg-[#006c4b] animate-ping" />
                        <span className="font-label-md text-label-md font-bold">
                          {station.availableStalls}/{station.totalStalls} Available
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[#565e74] text-[14px]">schedule</span>
                        <span className="font-label-md text-label-md font-bold">0/{station.totalStalls} Full</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-2 font-body-sm text-body-sm text-[#565e74]">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-[#006c4b]">navigation</span>
                    <strong className="text-[#0b1c30]">{station.distance}</strong> ({station.driveTime})
                  </span>
                  <span>•</span>
                  <span className="truncate">{station.crossStreet}</span>
                </div>

                {/* Specs Badges */}
                <div className="flex flex-wrap items-center gap-1.5 mt-3">
                  <span className="inline-flex items-center gap-1 bg-[#e1e0ff] text-[#2f2ebe] font-label-sm text-label-sm px-2.5 py-1 rounded-full font-bold">
                    <span className="material-symbols-outlined text-[14px]">bolt</span> {station.speedKw} kW DC Fast
                  </span>
                  <span className="bg-[#e5eeff] px-2.5 py-1 rounded-full font-label-sm text-label-sm text-[#0b1c30] font-semibold">
                    {station.architecture}
                  </span>
                  <span className="bg-[#63fcc0]/20 text-[#005138] px-2.5 py-1 rounded-full font-label-sm text-label-sm font-semibold">
                    {station.connectorsSummary}
                  </span>
                </div>

                {/* Price & Amenities */}
                <div className="flex items-center justify-between mt-4 pt-3 bg-white/70 -mx-4 -mb-4 px-4 py-3 rounded-b-3xl border-t border-[#bbcac0]/15">
                  <div className="flex flex-col">
                    <div className="flex items-baseline gap-1">
                      <span className="font-headline-md text-headline-md font-bold text-[#0b1c30]">
                        ${station.pricePerKwh.toFixed(2)}
                      </span>
                      <span className="font-body-sm text-body-sm text-[#565e74]">/ kWh</span>
                    </div>
                    <span className="font-label-sm text-label-sm text-[#006c4b] font-bold">
                      {station.priceNote}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[#565e74]">
                    {station.amenities.map((amenity, idx) => (
                      <span
                        key={idx}
                        className="material-symbols-outlined text-[18px] p-1 bg-[#f8f9ff] rounded-full shadow-sm"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions for Selected Card */}
                {isSelected && (
                  <div className="grid grid-cols-2 gap-2 mt-4 pt-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartNav();
                      }}
                      className="w-full flex items-center justify-center gap-1 bg-[#e5eeff] hover:bg-[#dce9ff] py-2.5 rounded-full font-label-md text-label-md text-[#0b1c30] font-semibold transition-colors"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[16px]">turn_sharp_right</span>
                      <span>Directions</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewStationDetails(station.id);
                      }}
                      className="w-full flex items-center justify-center gap-1 bg-[#00c48c] hover:bg-[#3fdfa5] text-[#004a33] py-2.5 rounded-full font-label-md text-label-md font-bold shadow-sm transition-transform active:scale-95"
                      type="button"
                    >
                      <span>View Details</span>
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </button>
                  </div>
                )}
              </article>
            );
          })}
        </div>

        {/* Quick Summary Footer Info */}
        <div className="px-space-md py-3 bg-[#eff4ff] flex items-center justify-between text-[#565e74] font-body-sm text-body-sm border-t border-[#bbcac0]/20">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#006c4b] inline-block" />
            <span>
              Showing <strong>{filteredStations.length}</strong> stations nearby
            </span>
          </span>
          <button
            onClick={() => {
              setFilterAvailable(false);
              setFilterFast(false);
              setFilterTesla(false);
              setActiveConnector('ALL');
            }}
            className="text-[#006c4b] font-label-md text-label-md font-bold hover:underline"
            type="button"
          >
            Reset Filters
          </button>
        </div>
      </aside>

      {/* RIGHT / MAIN AREA: Interactive High-Precision Vector Map Canvas */}
      <section className="flex-1 h-full relative overflow-hidden bg-[#e9edf5]">
        <div
          className="absolute inset-0 w-full h-full select-none overflow-hidden transition-transform duration-300"
          style={{ transform: `scale(${mapZoom})`, transformOrigin: '560px 460px' }}
        >
          <svg
            className="w-full h-full object-cover"
            preserveAspectRatio="xMidYMid slice"
            viewBox="0 0 1200 900"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="waterGrad" x1="0%" x2="100%" y1="0%" y2="100%">
                <stop offset="0%" stopColor="#d6e4ff" />
                <stop offset="100%" stopColor="#c4d8fa" />
              </linearGradient>
              <radialGradient id="rangeGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#00C48C" stopOpacity="0.14" />
                <stop offset="65%" stopColor="#00C48C" stopOpacity="0.06" />
                <stop offset="100%" stopColor="#00C48C" stopOpacity="0.0" />
              </radialGradient>
              <filter id="glowGreen" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#006c4b" floodOpacity="0.25" />
              </filter>
            </defs>

            {/* Satellite / Terrain background fill */}
            <rect
              width="1200"
              height="900"
              fill={mapLayer === 'Satellite' ? '#2f3b35' : '#e9edf5'}
            />

            {/* Water Body (San Francisco Bay & Coast) */}
            <path
              d="M 680,-50 C 720,120 740,240 790,380 C 830,490 890,620 1250,750 L 1250,-50 Z"
              fill={mapLayer === 'Satellite' ? '#1b2d3d' : 'url(#waterGrad)'}
            />

            {/* Pier projections & Ferry Building Area */}
            <rect fill="#cbd7ee" height="14" rx="3" transform="rotate(-15 760 240)" width="85" x="760" y="240" />
            <rect fill="#cbd7ee" height="16" rx="3" transform="rotate(-15 775 275)" width="95" x="775" y="275" />
            <rect fill="#cbd7ee" height="16" rx="3" transform="rotate(-15 790 315)" width="105" x="790" y="315" />
            <rect fill="#cbd7ee" height="18" rx="3" transform="rotate(-15 805 360)" width="115" x="805" y="360" />

            {/* Parks & Green Belt Zones */}
            <path
              d="M 280,180 C 330,170 380,210 390,260 C 400,310 340,330 300,320 C 260,310 250,230 280,180 Z"
              fill={mapLayer === 'Satellite' ? '#20472e' : '#d7ede1'}
            />
            <text fill="#3c4a42" fontFamily="Hanken Grotesk" fontSize="11" fontWeight="600" opacity="0.7" x="315" y="250">
              YERBA BUENA
            </text>
            <path
              d="M 120,480 C 180,470 230,510 220,590 C 200,640 140,650 100,620 C 70,590 80,510 120,480 Z"
              fill={mapLayer === 'Satellite' ? '#20472e' : '#d7ede1'}
            />
            <text fill="#3c4a42" fontFamily="Hanken Grotesk" fontSize="11" fontWeight="600" opacity="0.7" x="125" y="560">
              MISSION CREEK
            </text>

            {/* Major Arteries */}
            <line stroke="#ffffff" strokeLinecap="round" strokeWidth="26" x1="-50" x2="810" y1="620" y2="280" />
            <line stroke="#f1f5f9" strokeLinecap="round" strokeWidth="20" x1="-50" x2="810" y1="620" y2="280" />
            <text
              fill="#565e74"
              fontFamily="Space Grotesk"
              fontSize="12"
              fontWeight="600"
              letterSpacing="2"
              transform="rotate(-23 440 445)"
              x="440"
              y="445"
            >
              MARKET STREET
            </text>

            {/* Embarcadero Highway */}
            <path d="M 680,-50 C 720,120 740,240 790,380 C 830,490 890,620 1250,750" fill="none" stroke="#ffffff" strokeWidth="22" />
            <path d="M 680,-50 C 720,120 740,240 790,380 C 830,490 890,620 1250,750" fill="none" stroke="#f8fafc" strokeWidth="16" />

            {/* I-80 Bay Bridge Approach */}
            <path d="M 0,720 Q 380,680 620,540 T 960,390 L 1250,280" fill="none" stroke="#ffd9a6" strokeOpacity="0.8" strokeWidth="14" />
            <path d="M 0,720 Q 380,680 620,540 T 960,390 L 1250,280" fill="none" stroke="#ffffff" strokeDasharray="10 8" strokeWidth="8" />

            {/* Urban Street Grid */}
            <g stroke="#ffffff" strokeLinecap="square" strokeWidth="10">
              <line x1="120" x2="450" y1="0" y2="850" />
              <line x1="220" x2="550" y1="0" y2="850" />
              <line x1="320" x2="650" y1="0" y2="850" />
              <line x1="420" x2="750" y1="0" y2="850" />
              <line x1="520" x2="850" y1="0" y2="850" />
              <line x1="620" x2="950" y1="0" y2="850" />
              <line x1="0" x2="780" y1="210" y2="520" />
              <line x1="0" x2="780" y1="310" y2="620" />
              <line x1="0" x2="780" y1="410" y2="720" />
              <line x1="0" x2="780" y1="510" y2="820" />
              <line x1="0" x2="780" y1="110" y2="420" />
              <line x1="280" x2="980" y1="20" y2="300" />
            </g>

            {/* Dynamic Range Isoline (Model Y 38% battery ~ 112 miles) */}
            {showRangeRing && (
              <>
                <circle cx="560" cy="460" fill="url(#rangeGlow)" r="320" />
                <circle
                  cx="560"
                  cy="460"
                  fill="none"
                  opacity="0.65"
                  r="320"
                  stroke="#00C48C"
                  strokeDasharray="8 6"
                  strokeWidth="2.5"
                >
                  <animate attributeName="stroke-dashoffset" dur="4s" repeatCount="indefinite" values="0;28" />
                </circle>
                <text fill="#006c4b" fontFamily="Space Grotesk" fontSize="12" fontWeight="700" letterSpacing="1" x="820" y="440">
                  112 MI RANGE RADIUS (38%)
                </text>
              </>
            )}

            {/* USER LOCATION PIN */}
            <g transform="translate(560, 460)">
              <circle cx="0" cy="0" fill="#494bd6" opacity="0.15" r="28">
                <animate attributeName="r" dur="2.4s" repeatCount="indefinite" values="18;34;18" />
                <animate attributeName="opacity" dur="2.4s" repeatCount="indefinite" values="0.25;0.05;0.25" />
              </circle>
              <circle cx="0" cy="0" fill="#ffffff" filter="url(#glowGreen)" r="14" />
              <circle cx="0" cy="0" fill="#494bd6" r="9" />
              <polygon fill="#494bd6" points="0,-14 5,-7 -5,-7" transform="rotate(35)" />
              <rect fill="#213145" height="30" rx="15" width="190" x="-95" y="-52" />
              <text fill="#ffffff" fontFamily="Space Grotesk" fontSize="11" fontWeight="700" textAnchor="middle" x="0" y="-32">
                You (Model Y • 38% / 112 mi)
              </text>
            </g>

            {/* Active Route Path line to selected station */}
            <path
              d={`M 560,460 L ${(560 + selectedStation.mapCoords.x) / 2},${(460 + selectedStation.mapCoords.y) / 2} L ${selectedStation.mapCoords.x},${selectedStation.mapCoords.y}`}
              fill="none"
              stroke="#00C48C"
              strokeDasharray="6 6"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="4.5"
            >
              <animate attributeName="stroke-dashoffset" dur="1.5s" repeatCount="indefinite" values="24;0" />
            </path>

            {/* STATION PINS */}
            {/* 1. Embarcadero */}
            <g
              className="cursor-pointer transition-transform hover:scale-110"
              filter="url(#glowGreen)"
              onClick={() => onSelectStation(stations[0])}
              transform="translate(735, 295)"
            >
              {selectedStation.id === 'station-embarcadero' && (
                <circle cx="0" cy="0" fill="#00C48C" opacity="0.25" r="26">
                  <animate attributeName="r" dur="2s" repeatCount="indefinite" values="22;30;22" />
                </circle>
              )}
              <rect fill="#006c4b" height="42" rx="21" stroke="#ffffff" strokeWidth="3" width="84" x="-42" y="-56" />
              <polygon fill="#006c4b" points="0,0 -8,-15 8,-15" />
              <circle cx="-20" cy="-35" fill="#00c48c" r="12" />
              <path d="M -21 -41 L -25 -34 L -20 -34 L -21 -29 L -15 -36 L -19 -36 Z" fill="#002114" />
              <text fill="#ffffff" fontFamily="Space Grotesk" fontSize="14" fontWeight="800" x="10" y="-30">
                6/8
              </text>
              <rect fill="#e1e0ff" height="18" rx="9" width="60" x="-30" y="-76" />
              <text fill="#2f2ebe" fontFamily="Space Grotesk" fontSize="10" fontWeight="800" textAnchor="middle" x="0" y="-63">
                ⚡ 350 kW
              </text>
            </g>

            {/* 2. SOMA */}
            <g
              className="cursor-pointer transition-transform hover:scale-110"
              filter="url(#glowGreen)"
              onClick={() => onSelectStation(stations[1])}
              transform="translate(430, 390)"
            >
              <rect fill="#ffffff" height="38" rx="19" stroke="#00C48C" strokeWidth="3" width="76" x="-38" y="-50" />
              <polygon fill="#ffffff" points="0,0 -7,-13 7,-13" />
              <circle cx="-18" cy="-31" fill="#00C48C" r="10" />
              <path d="M -19 -36 L -22 -30 L -18 -30 L -19 -26 L -14 -32 L -17 -32 Z" fill="#ffffff" />
              <text fill="#0b1c30" fontFamily="Space Grotesk" fontSize="13" fontWeight="800" x="10" y="-26">
                12/16
              </text>
              <rect fill="#e5eeff" height="16" rx="8" width="52" x="-26" y="-68" />
              <text fill="#006c4b" fontFamily="Space Grotesk" fontSize="9" fontWeight="700" textAnchor="middle" x="0" y="-56">
                250 kW
              </text>
            </g>

            {/* 3. Mission Bay */}
            <g
              className="cursor-pointer transition-transform hover:scale-110"
              onClick={() => onSelectStation(stations[2])}
              transform="translate(320, 640)"
            >
              <rect fill="#ffffff" height="36" rx="18" stroke="#d97706" strokeWidth="2.5" width="68" x="-34" y="-46" />
              <polygon fill="#ffffff" points="0,0 -6,-11 6,-11" />
              <circle cx="-16" cy="-28" fill="#d97706" r="9" />
              <path d="M -17 -32 L -20 -28 L -16 -28 L -17 -24 L -13 -29 L -16 -29 Z" fill="#ffffff" />
              <text fill="#0b1c30" fontFamily="Space Grotesk" fontSize="13" fontWeight="800" x="8" y="-23">
                2/6
              </text>
            </g>

            {/* 4. Transbay */}
            <g
              className="cursor-pointer transition-transform hover:scale-110"
              onClick={() => onSelectStation(stations[3])}
              transform="translate(620, 360)"
            >
              <rect fill="#dce9ff" height="36" rx="18" stroke="#565e74" strokeWidth="2" width="68" x="-34" y="-46" />
              <polygon fill="#dce9ff" points="0,0 -6,-11 6,-11" />
              <circle cx="-16" cy="-28" fill="#565e74" r="8" />
              <text fill="#ffffff" fontFamily="Space Grotesk" fontSize="11" fontWeight="700" textAnchor="middle" x="-16" y="-24">
                0
              </text>
              <text fill="#565e74" fontFamily="Space Grotesk" fontSize="12" fontWeight="800" x="8" y="-24">
                Full
              </text>
            </g>

            {/* 5. South Park */}
            <g
              className="cursor-pointer opacity-90 hover:opacity-100"
              onClick={() => onSelectStation(stations[4])}
              transform="translate(540, 560)"
            >
              <rect fill="#ffffff" height="32" rx="16" stroke="#00C48C" strokeWidth="2" width="60" x="-30" y="-42" />
              <polygon fill="#ffffff" points="0,0 -5,-11 5,-11" />
              <circle cx="-14" cy="-26" fill="#00C48C" r="7" />
              <text fill="#0b1c30" fontFamily="Space Grotesk" fontSize="12" fontWeight="800" x="6" y="-21">
                3/4
              </text>
            </g>

            {/* 6. Financial North */}
            <g
              className="cursor-pointer opacity-90 hover:opacity-100"
              onClick={() => onSelectStation(stations[5])}
              transform="translate(630, 190)"
            >
              <rect fill="#ffffff" height="32" rx="16" stroke="#00C48C" strokeWidth="2" width="60" x="-30" y="-42" />
              <polygon fill="#ffffff" points="0,0 -5,-11 5,-11" />
              <circle cx="-14" cy="-26" fill="#00C48C" r="7" />
              <text fill="#0b1c30" fontFamily="Space Grotesk" fontSize="12" fontWeight="800" x="6" y="-21">
                4/4
              </text>
            </g>
          </svg>
        </div>

        {/* FLOATING HUD: Top-Right Map Controls */}
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 items-end">
          {/* Map Layers */}
          <div className="bg-white/95 backdrop-blur-md p-1.5 rounded-full shadow-lg flex items-center gap-1 border border-[#bbcac0]/20">
            <button
              onClick={() => setMapLayer('Roads')}
              className={`px-3 py-1.5 rounded-full font-label-md text-label-md font-bold transition-all ${
                mapLayer === 'Roads'
                  ? 'bg-[#00c48c] text-[#004a33] shadow-sm'
                  : 'hover:bg-[#e5eeff] text-[#3c4a42]'
              }`}
              type="button"
            >
              Roads
            </button>
            <button
              onClick={() => setMapLayer('Satellite')}
              className={`px-3 py-1.5 rounded-full font-label-md text-label-md font-bold transition-all ${
                mapLayer === 'Satellite'
                  ? 'bg-[#00c48c] text-[#004a33] shadow-sm'
                  : 'hover:bg-[#e5eeff] text-[#3c4a42]'
              }`}
              type="button"
            >
              Satellite
            </button>
            <button
              onClick={() => setShowRangeRing(!showRangeRing)}
              className={`px-3 py-1.5 rounded-full font-label-md text-label-md transition-colors flex items-center gap-1 ${
                showRangeRing ? 'text-[#006c4b] font-bold' : 'text-[#565e74]'
              }`}
              type="button"
            >
              <span className={`w-2 h-2 rounded-full ${showRangeRing ? 'bg-[#006c4b]' : 'bg-gray-400'}`} />
              <span>Range Ring</span>
            </button>
          </div>

          {/* Zoom & Recenter Controls */}
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-[#bbcac0]/20 p-1 flex flex-col items-center">
            <button
              onClick={() => setMapZoom((z) => Math.min(z + 0.15, 1.8))}
              className="w-10 h-10 flex items-center justify-center text-[#0b1c30] hover:bg-[#e5eeff] rounded-xl transition-colors"
              title="Zoom in"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">add</span>
            </button>
            <div className="w-6 h-[1px] bg-[#bbcac0]/30 my-0.5" />
            <button
              onClick={() => setMapZoom((z) => Math.max(z - 0.15, 0.75))}
              className="w-10 h-10 flex items-center justify-center text-[#0b1c30] hover:bg-[#e5eeff] rounded-xl transition-colors"
              title="Zoom out"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">remove</span>
            </button>
            <div className="w-6 h-[1px] bg-[#bbcac0]/30 my-0.5" />
            <button
              onClick={() => setMapZoom(1)}
              className="w-10 h-10 flex items-center justify-center text-[#006c4b] hover:bg-[#63fcc0]/20 rounded-xl transition-colors"
              title="Center on my location"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">my_location</span>
            </button>
            <div className="w-6 h-[1px] bg-[#bbcac0]/30 my-0.5" />
            <button
              onClick={() => setMapZoom(1)}
              className="w-10 h-10 flex items-center justify-center text-[#565e74] hover:bg-[#e5eeff] rounded-xl transition-colors"
              title="Reset North compass"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px] text-[#ba1a1a]">explore</span>
            </button>
          </div>

          {/* Real-time Grid Telemetry */}
          <div className="hidden xl:flex items-center gap-3 bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl shadow-lg border border-[#bbcac0]/20 mt-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#006c4b] animate-pulse" />
              <span className="font-label-sm text-label-sm text-[#565e74] uppercase font-bold tracking-wider">
                Grid Flow:
              </span>
              <span className="font-label-md text-label-md text-[#0b1c30] font-extrabold">
                CAISO 98.2% Stable
              </span>
            </div>
            <div className="h-4 w-[1px] bg-[#bbcac0]/30" />
            <div className="font-label-md text-label-md text-[#006c4b] font-bold">
              Average Speed: 210 kW
            </div>
          </div>
        </div>

        {/* FLOATING BOTTOM HUD: Selected Station Live Snapshot */}
        <div className="absolute bottom-4 left-4 right-4 md:left-6 md:right-6 lg:left-8 lg:right-8 z-20 pointer-events-none">
          <div className="pointer-events-auto max-w-4xl mx-auto bg-white/95 backdrop-blur-xl rounded-3xl p-4 md:p-5 shadow-2xl border border-[#bbcac0]/30 flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Station Metadata & Stall Selector */}
            <div
              className="flex items-center gap-4 w-full md:w-auto cursor-pointer"
              onClick={() => onViewStationDetails(selectedStation.id)}
            >
              <div className="relative shrink-0">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden shadow-inner bg-gray-100">
                  <img
                    alt={selectedStation.name}
                    className="w-full h-full object-cover"
                    src={selectedStation.imageUrl}
                  />
                </div>
                <span className="absolute -top-1.5 -right-1.5 bg-[#006c4b] text-white font-label-sm text-label-sm font-bold px-2 py-0.5 rounded-full shadow-md">
                  {selectedStation.speedKw}kW
                </span>
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="bg-[#63fcc0]/40 text-[#005138] font-label-sm text-label-sm px-2.5 py-0.5 rounded-full font-bold">
                    {selectedStation.network}
                  </span>
                  <span className="font-label-sm text-label-sm text-[#565e74] font-medium">
                    Station ID {selectedStation.stationCode}
                  </span>
                </div>
                <h3 className="font-headline-md text-headline-md text-[#0b1c30] font-extrabold tracking-tight truncate">
                  {selectedStation.name}
                </h3>
                <div className="flex items-center gap-2 text-[#565e74] font-body-sm text-body-sm mt-0.5">
                  <span className="font-bold text-[#006c4b] flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-[16px]">check_circle</span>{' '}
                    {selectedStation.availableStalls} stalls free
                  </span>
                  <span>•</span>
                  <span>Stall #4 primed (CCS 350kW - 800V)</span>
                  <span>•</span>
                  <span className="font-semibold text-[#0b1c30]">${selectedStation.pricePerKwh.toFixed(2)}/kWh</span>
                </div>
              </div>
            </div>

            {/* CTA Group */}
            <div className="flex items-center gap-2 w-full md:w-auto justify-end shrink-0">
              <button
                onClick={handleHoldStall}
                className={`flex-1 md:flex-none px-5 py-3 rounded-full font-label-md text-label-md font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm ${
                  reservedStall
                    ? 'bg-[#63fcc0]/40 text-[#005138]'
                    : 'bg-[#eff4ff] hover:bg-[#e5eeff] text-[#0b1c30]'
                }`}
                type="button"
              >
                <span className="material-symbols-outlined text-[18px] text-[#494bd6]">
                  {reservedStall ? 'verified' : 'lock_clock'}
                </span>
                <span>{reservedStall ? 'Stall #4 Reserved!' : 'Hold Stall #4 (15m)'}</span>
              </button>

              <button
                onClick={handleStartNav}
                className={`flex-1 md:flex-none px-6 py-3 rounded-full font-label-lg text-label-lg font-bold shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2 ${
                  navState === 'ACTIVE'
                    ? 'bg-[#006c4b] text-white'
                    : navState === 'ROUTING'
                    ? 'bg-[#00c48c] text-[#004a33] opacity-90'
                    : 'bg-[#00c48c] hover:bg-[#3fdfa5] text-[#004a33]'
                }`}
                type="button"
              >
                {navState === 'ROUTING' ? (
                  <>
                    <span className="material-symbols-outlined text-[20px] animate-spin">autorenew</span>
                    <span>Routing 0.4 mi...</span>
                  </>
                ) : navState === 'ACTIVE' ? (
                  <>
                    <span className="material-symbols-outlined text-[20px]">check</span>
                    <span>Route Active (3 min)</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[20px]">near_me</span>
                    <span>Start Navigation</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Change City Modal */}
      {showCityModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-[#bbcac0]/30">
            <div className="flex items-center justify-between pb-3 border-b border-[#bbcac0]/20">
              <span className="font-title-md text-title-md text-[#0b1c30]">Select Search Region</span>
              <button
                onClick={() => setShowCityModal(false)}
                className="text-[#565e74] hover:text-[#0b1c30] p-1 rounded-full"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="flex flex-col gap-2 mt-4">
              {[
                'Downtown San Francisco (5 mi)',
                'SOMA & Mission Bay (3 mi)',
                'Silicon Valley / Palo Alto (30 mi)',
                'Oakland & East Bay (12 mi)',
                'Marin County / Sausalito (15 mi)',
              ].map((loc) => (
                <button
                  key={loc}
                  onClick={() => {
                    setCurrentCity(loc);
                    setShowCityModal(false);
                  }}
                  className={`p-3 rounded-2xl text-left font-label-md text-label-md transition-colors ${
                    currentCity === loc
                      ? 'bg-[#eff4ff] text-[#006c4b] font-bold'
                      : 'hover:bg-[#f8f9ff] text-[#0b1c30]'
                  }`}
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
