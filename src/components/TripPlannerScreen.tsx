import React, { useState } from 'react';

interface TripPlannerScreenProps {
  onOpenStationDetails?: (stationId: string) => void;
}

export const TripPlannerScreen: React.FC<TripPlannerScreenProps> = () => {
  const [departureSoc, setDepartureSoc] = useState<number>(38);
  const [arrivalBuffer, setArrivalBuffer] = useState<number>(20);
  const [optStrategy, setOptStrategy] = useState<'fastest' | 'cost' | 'stops'>('fastest');
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [isPreconditioning, setIsPreconditioning] = useState(false);
  const [sentToCar, setSentToCar] = useState(false);
  const [gpxDownloaded, setGpxDownloaded] = useState(false);
  const [activeLayer, setActiveLayer] = useState<'both' | 'elevation' | 'weather'>('both');
  const [originText, setOriginText] = useState('Financial District, SF');
  const [destinationText, setDestinationText] = useState('South Lake Tahoe, CA');

  const handleSwap = () => {
    const temp = originText;
    setOriginText(destinationText);
    setDestinationText(temp);
  };

  const handleRecalculate = () => {
    setIsRecalculating(true);
    setTimeout(() => {
      setIsRecalculating(false);
    }, 800);
  };

  const handleSendToCar = () => {
    setSentToCar(true);
    setTimeout(() => setSentToCar(false), 3500);
  };

  const handleExportGpx = () => {
    const element = document.createElement('a');
    const file = new Blob(
      [
        `<?xml version="1.0" encoding="UTF-8"?><gpx version="1.1" creator="VoltPoint EV"><wpt lat="37.793" lon="-122.399"><name>SF Financial District</name></wpt><wpt lat="38.356" lon="-121.987"><name>VoltPoint Vacaville</name></wpt><wpt lat="38.896" lon="-121.076"><name>EA Auburn</name></wpt><wpt lat="38.939" lon="-119.977"><name>South Lake Tahoe</name></wpt></gpx>`,
      ],
      { type: 'application/gpx+xml' }
    );
    element.href = URL.createObjectURL(file);
    element.download = 'VoltPoint_SF_to_Lake_Tahoe.gpx';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    setGpxDownloaded(true);
    setTimeout(() => setGpxDownloaded(false), 2500);
  };

  return (
    <div className="w-full bg-[#f8f9ff] min-h-[calc(100vh-5rem)]">
      <div className="w-full px-gutter py-space-md max-w-[1440px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-space-lg items-start">
          {/* LEFT CONFIGURATION SIDEBAR (420px) */}
          <aside className="w-full lg:w-[420px] shrink-0 flex flex-col gap-space-md">
            {/* Planner Setup Card */}
            <div className="bg-white rounded-2xl p-space-lg shadow-sm border border-[#bbcac0]/25 flex flex-col gap-space-md">
              <div className="flex items-center justify-between pb-space-xs">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-[#006c4b] text-[22px]">alt_route</span>
                  <h1 className="font-headline-md text-headline-md text-[#0b1c30]">Route Planner</h1>
                </div>
                <span className="font-label-sm text-label-sm bg-[#63fcc0]/30 text-[#005138] px-2.5 py-1 rounded-full uppercase tracking-wider font-semibold">
                  Active Telemetry
                </span>
              </div>

              {/* Origin & Destination Inputs */}
              <div className="space-y-2.5 relative">
                <div className="bg-[#eff4ff] rounded-2xl p-3 flex items-start gap-space-sm border border-[#bbcac0]/20 focus-within:bg-white focus-within:shadow-md transition-all">
                  <span className="material-symbols-outlined text-[#006c4b] text-[20px] mt-0.5">trip_origin</span>
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="font-label-sm text-label-sm text-[#565e74] uppercase tracking-wider">
                      Origin Point
                    </span>
                    <input
                      type="text"
                      value={originText}
                      onChange={(e) => setOriginText(e.target.value)}
                      className="font-title-md text-title-md text-[#0b1c30] bg-transparent outline-none truncate w-full"
                    />
                    <span className="font-body-sm text-body-sm text-[#565e74] truncate">
                      Current Location • 37.793, -122.399
                    </span>
                  </div>
                  <button
                    className="text-[#565e74] hover:text-[#006c4b] p-1 rounded-full transition-colors"
                    title="Use current location"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">my_location</span>
                  </button>
                </div>

                {/* Swap button */}
                <div className="flex justify-center -my-2 relative z-10">
                  <button
                    onClick={handleSwap}
                    className="w-7 h-7 bg-white text-[#565e74] hover:text-[#0b1c30] shadow-sm rounded-full flex items-center justify-center transition-transform hover:rotate-180 border border-[#bbcac0]/30 cursor-pointer"
                    type="button"
                    title="Swap Origin and Destination"
                  >
                    <span className="material-symbols-outlined text-[16px]">swap_vert</span>
                  </button>
                </div>

                <div className="bg-[#eff4ff] rounded-2xl p-3 flex items-start gap-space-sm border border-[#bbcac0]/20 focus-within:bg-white focus-within:shadow-md transition-all">
                  <span className="material-symbols-outlined text-[#ba1a1a] text-[20px] mt-0.5">location_on</span>
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="font-label-sm text-label-sm text-[#565e74] uppercase tracking-wider">
                      Destination
                    </span>
                    <input
                      type="text"
                      value={destinationText}
                      onChange={(e) => setDestinationText(e.target.value)}
                      className="font-title-md text-title-md text-[#0b1c30] bg-transparent outline-none truncate w-full"
                    />
                    <span className="font-body-sm text-body-sm text-[#565e74]">
                      Alpine County • 198 mi direct
                    </span>
                  </div>
                  <span className="material-symbols-outlined text-[#565e74] text-[18px] mt-1">search</span>
                </div>

                <button
                  className="w-full py-2 bg-[#eff4ff] hover:bg-[#e5eeff] text-[#006c4b] font-label-md text-label-md rounded-full flex items-center justify-center gap-1.5 transition-colors border border-[#bbcac0]/20 cursor-pointer"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">add_circle</span>
                  <span>+ Add Stop / Custom Waypoint</span>
                </button>
              </div>

              {/* Vehicle Spec Banner */}
              <div className="bg-[#e5eeff] rounded-2xl p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-space-sm">
                  <div className="w-10 h-10 rounded-full bg-[#006c4b]/10 flex items-center justify-center text-[#006c4b]">
                    <span className="material-symbols-outlined text-[22px]">directions_car</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-lg text-label-lg text-[#0b1c30] font-semibold">
                      2023 Tesla Model Y LR
                    </span>
                    <span className="font-body-sm text-body-sm text-[#565e74]">
                      78.1 kWh Pack • Dual Motor AWD
                    </span>
                  </div>
                </div>
                <button className="text-[#006c4b] hover:underline font-label-sm text-label-sm" type="button">
                  Change
                </button>
              </div>

              {/* Sliders: Battery Departure & Desired Arrival */}
              <div className="space-y-4 pt-1">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-label-md text-label-md text-[#0b1c30] font-semibold flex items-center gap-1">
                      Departure SoC
                      {departureSoc < 45 && (
                        <span
                          className="material-symbols-outlined text-amber-500 text-[16px]"
                          title="Below recommended 50% for highway start"
                        >
                          warning
                        </span>
                      )}
                    </span>
                    <span
                      className={`font-headline-md text-headline-md font-bold ${
                        departureSoc < 25
                          ? 'text-[#ba1a1a]'
                          : departureSoc < 45
                          ? 'text-amber-600'
                          : 'text-[#006c4b]'
                      }`}
                    >
                      {departureSoc}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={departureSoc}
                    onChange={(e) => setDepartureSoc(Number(e.target.value))}
                    className="w-full h-2 bg-[#dce9ff] rounded-lg appearance-none cursor-pointer accent-[#006c4b]"
                  />
                  <div className="flex justify-between font-label-sm text-label-sm text-[#565e74]">
                    <span>10% Critical</span>
                    <span className={departureSoc < 45 ? 'text-amber-600 font-medium' : ''}>
                      {departureSoc < 45 ? 'Quick charge required' : 'Optimal departure'}
                    </span>
                    <span>100% Full</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-label-md text-label-md text-[#0b1c30] font-semibold">
                      Desired Arrival Buffer
                    </span>
                    <span className="font-title-md text-title-md text-[#0b1c30] font-semibold">
                      {arrivalBuffer}% ({Math.round(arrivalBuffer * 2.7)} mi)
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[10, 20, 25, 30].map((pct) => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => setArrivalBuffer(pct)}
                        className={`py-1.5 text-center font-label-sm text-label-sm rounded-xl transition-all ${
                          arrivalBuffer === pct
                            ? 'bg-[#00c48c] text-[#004a33] font-bold shadow-sm'
                            : 'bg-[#eff4ff] text-[#565e74] hover:bg-[#e5eeff]'
                        }`}
                      >
                        {pct}%
                      </button>
                    ))}
                  </div>
                </div>

                {/* Environmental Factors Pill Row */}
                <div className="bg-[#eff4ff] rounded-2xl p-3 flex items-center justify-between text-[#565e74] border border-[#bbcac0]/20">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px]">thermostat</span>
                    <span className="font-body-sm text-body-sm">58°F Climate AC</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px]">speed</span>
                    <span className="font-body-sm text-body-sm">265 Wh/mi Base</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px]">air</span>
                    <span className="font-body-sm text-body-sm">4mph Headwind</span>
                  </div>
                </div>
              </div>

              {/* Optimization Strategy Modes */}
              <div className="space-y-2 pt-2">
                <span className="font-label-sm text-label-sm text-[#565e74] uppercase tracking-wider font-semibold">
                  Optimization Strategy
                </span>
                <div className="flex flex-col gap-2">
                  <label
                    onClick={() => setOptStrategy('fastest')}
                    className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-colors border ${
                      optStrategy === 'fastest'
                        ? 'bg-[#eff4ff] border-[#00c48c]'
                        : 'bg-[#f8f9ff] border-transparent hover:bg-[#eff4ff]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="opt_strategy"
                        checked={optStrategy === 'fastest'}
                        onChange={() => setOptStrategy('fastest')}
                        className="w-4 h-4 text-[#006c4b] accent-[#006c4b]"
                      />
                      <div className="flex flex-col">
                        <span className="font-label-md text-label-md text-[#0b1c30] font-semibold">
                          Fastest Route
                        </span>
                        <span className="font-body-sm text-body-sm text-[#565e74]">
                          Prefers ultra-fast 250kW+ DCFC
                        </span>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-[#006c4b] text-[20px]">bolt</span>
                  </label>

                  <label
                    onClick={() => setOptStrategy('cost')}
                    className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-colors border ${
                      optStrategy === 'cost'
                        ? 'bg-[#eff4ff] border-[#00c48c]'
                        : 'bg-[#f8f9ff] border-transparent hover:bg-[#eff4ff]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="opt_strategy"
                        checked={optStrategy === 'cost'}
                        onChange={() => setOptStrategy('cost')}
                        className="w-4 h-4 text-[#006c4b] accent-[#006c4b]"
                      />
                      <div className="flex flex-col">
                        <span className="font-label-md text-label-md text-[#0b1c30] font-semibold">
                          Lowest Cost
                        </span>
                        <span className="font-body-sm text-body-sm text-[#565e74]">
                          Off-peak rate prioritization
                        </span>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-[#565e74] text-[20px]">savings</span>
                  </label>

                  <label
                    onClick={() => setOptStrategy('stops')}
                    className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-colors border ${
                      optStrategy === 'stops'
                        ? 'bg-[#eff4ff] border-[#00c48c]'
                        : 'bg-[#f8f9ff] border-transparent hover:bg-[#eff4ff]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="opt_strategy"
                        checked={optStrategy === 'stops'}
                        onChange={() => setOptStrategy('stops')}
                        className="w-4 h-4 text-[#006c4b] accent-[#006c4b]"
                      />
                      <div className="flex flex-col">
                        <span className="font-label-md text-label-md text-[#0b1c30] font-semibold">
                          Fewest Stops
                        </span>
                        <span className="font-body-sm text-body-sm text-[#565e74]">
                          Extends leg range to 10% bottom SoC
                        </span>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-[#565e74] text-[20px]">pin_drop</span>
                  </label>
                </div>
              </div>

              {/* Recalculate CTA */}
              <button
                onClick={handleRecalculate}
                className="w-full mt-2 py-3.5 bg-[#00c48c] hover:bg-[#3fdfa5] text-[#004a33] font-label-lg text-label-lg font-bold rounded-full shadow-md flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
                type="button"
              >
                <span className={`material-symbols-outlined text-[20px] ${isRecalculating ? 'animate-spin' : ''}`}>
                  refresh
                </span>
                <span>{isRecalculating ? 'Calculating Optimal Stops...' : 'Recalculate Route'}</span>
              </button>
            </div>

            {/* Trip Summary Telemetry Card */}
            <div className="bg-white rounded-2xl p-space-lg shadow-sm border border-[#bbcac0]/25 flex flex-col gap-space-sm">
              <div className="flex items-center justify-between">
                <span className="font-title-md text-title-md text-[#0b1c30] font-semibold">
                  Itinerary Overview
                </span>
                <span className="font-label-md text-label-md bg-[#dae2fd] text-[#131b2e] font-semibold px-2.5 py-0.5 rounded-full">
                  Optimal
                </span>
              </div>

              <div className="grid grid-cols-2 gap-space-sm pt-2">
                <div className="bg-[#eff4ff] rounded-2xl p-3 flex flex-col">
                  <span className="font-label-sm text-label-sm text-[#565e74] uppercase">Total Duration</span>
                  <span className="font-headline-md text-headline-md text-[#0b1c30] font-semibold">4h 12m</span>
                  <span className="font-body-sm text-body-sm text-[#565e74]">3h 24m driving</span>
                </div>
                <div className="bg-[#eff4ff] rounded-2xl p-3 flex flex-col">
                  <span className="font-label-sm text-label-sm text-[#565e74] uppercase">Total Distance</span>
                  <span className="font-headline-md text-headline-md text-[#0b1c30] font-semibold">206 mi</span>
                  <span className="font-body-sm text-body-sm text-[#565e74]">+8 mi detour</span>
                </div>
                <div className="bg-[#eff4ff] rounded-2xl p-3 flex flex-col">
                  <span className="font-label-sm text-label-sm text-[#565e74] uppercase">Charging Dwell</span>
                  <span className="font-headline-md text-headline-md text-[#006c4b] font-semibold">48 min</span>
                  <span className="font-body-sm text-body-sm text-[#565e74]">2 optimal stops</span>
                </div>
                <div className="bg-[#eff4ff] rounded-2xl p-3 flex flex-col">
                  <span className="font-label-sm text-label-sm text-[#565e74] uppercase">Estimated Cost</span>
                  <span className="font-headline-md text-headline-md text-[#0b1c30] font-semibold">$27.92</span>
                  <span className="font-body-sm text-body-sm text-[#006c4b] font-medium">Save $42 vs Gas</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between font-body-sm text-body-sm text-[#565e74]">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#00c48c]" />
                  Net kWh needed: 77 kWh
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-[#006c4b]">eco</span>
                  41.2 kg CO₂ avoided
                </span>
              </div>
            </div>
          </aside>

          {/* MAIN CONTENT: CHARTS, ITINERARY TIMELINE & ACTION HUDS */}
          <main className="flex-1 w-full flex flex-col gap-space-lg">
            {/* Live Route Header HUD & Quick Stats */}
            <div className="bg-white rounded-2xl p-space-lg shadow-sm border border-[#bbcac0]/25 flex flex-col gap-space-md">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-sm pb-space-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-headline-lg text-headline-lg text-[#0b1c30]">
                      San Francisco to Lake Tahoe
                    </span>
                    <span className="font-label-sm text-label-sm bg-[#006c4b]/10 text-[#006c4b] px-2.5 py-1 rounded-full font-bold uppercase">
                      US-50 E SCENIC
                    </span>
                  </div>
                  <p className="font-body-md text-body-md text-[#565e74] mt-0.5">
                    High altitude pass through Eldorado National Forest via Sacramento Corridor
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveLayer('both')}
                    className={`px-4 py-2 rounded-full font-label-md text-label-md flex items-center gap-1.5 transition-colors ${
                      activeLayer === 'both'
                        ? 'bg-[#00c48c] text-[#004a33] font-bold'
                        : 'bg-[#eff4ff] hover:bg-[#e5eeff] text-[#0b1c30]'
                    }`}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">layers</span>
                    <span>Elevation + SoC</span>
                  </button>
                  <button
                    onClick={() => setActiveLayer('weather')}
                    className={`px-4 py-2 rounded-full font-label-md text-label-md flex items-center gap-1.5 transition-colors ${
                      activeLayer === 'weather'
                        ? 'bg-[#00c48c] text-[#004a33] font-bold'
                        : 'bg-[#eff4ff] hover:bg-[#e5eeff] text-[#0b1c30]'
                    }`}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">radar</span>
                    <span>Live Wind & Weather</span>
                  </button>
                </div>
              </div>

              {/* ELEVATION & BATTERY DISCHARGE PROFILE SVG CHART */}
              <div className="w-full bg-[#eff4ff] rounded-2xl p-space-md flex flex-col gap-space-sm relative overflow-hidden border border-[#bbcac0]/20">
                <div className="flex flex-wrap items-center justify-between gap-2 z-10">
                  <div className="flex items-center gap-space-md">
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-[#00c48c]" />
                      <span className="font-label-sm text-label-sm text-[#0b1c30] font-semibold">
                        Battery State of Charge (%)
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-[#565e74]" />
                      <span className="font-label-sm text-label-sm text-[#565e74] font-semibold">
                        Terrain Elevation (ft)
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-space-sm font-label-sm text-label-sm text-[#565e74]">
                    <span>
                      Peak Summit: <strong className="text-[#0b1c30]">Echo Summit (7,382 ft)</strong>
                    </span>
                    <span>•</span>
                    <span>
                      Average Efficiency: <strong className="text-[#0b1c30]">318 Wh/mi (Climb)</strong>
                    </span>
                  </div>
                </div>

                {/* SVG Telemetry Graph */}
                <div className="w-full h-56 relative select-none">
                  <svg
                    className="w-full h-full overflow-visible"
                    preserveAspectRatio="none"
                    viewBox="0 0 900 220"
                  >
                    <defs>
                      <linearGradient id="elevationGrad" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#bec6e0" stopOpacity="0.45" />
                        <stop offset="100%" stopColor="#bec6e0" stopOpacity="0.02" />
                      </linearGradient>
                      <linearGradient id="socGrad" x1="0" x2="1" y1="0" y2="0">
                        <stop offset="0%" stopColor="#006c4b" />
                        <stop offset="40%" stopColor="#00c48c" />
                        <stop offset="100%" stopColor="#3fdfa5" />
                      </linearGradient>
                      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur result="blur" stdDeviation="3" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                    </defs>

                    {/* Gridlines */}
                    <line stroke="#d3e4fe" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="900" y1="40" y2="40" />
                    <line stroke="#d3e4fe" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="900" y1="90" y2="90" />
                    <line stroke="#d3e4fe" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="900" y1="140" y2="140" />
                    <line stroke="#d3e4fe" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="900" y1="190" y2="190" />

                    {/* Terrain Elevation Area */}
                    <path
                      d="M 0,200 L 40,198 L 180,195 L 340,190 L 490,150 L 640,105 L 780,48 L 840,65 L 900,85 L 900,215 L 0,215 Z"
                      fill="url(#elevationGrad)"
                    />
                    <path
                      d="M 0,200 L 40,198 L 180,195 L 340,190 L 490,150 L 640,105 L 780,48 L 840,65 L 900,85"
                      fill="none"
                      stroke="#565e74"
                      strokeLinecap="round"
                      strokeWidth="2"
                    />

                    {/* Stop Waypoint Vertical Dashes */}
                    <line opacity="0.8" stroke="#00c48c" strokeDasharray="3 3" strokeWidth="1.5" x1="220" x2="220" y1="20" y2="210" />
                    <line opacity="0.8" stroke="#00c48c" strokeDasharray="3 3" strokeWidth="1.5" x1="560" x2="560" y1="20" y2="210" />

                    {/* Battery SoC Curve */}
                    <path
                      d="M 0,144 L 220,192 L 220,70 L 560,164 L 560,90 L 780,185 L 900,172"
                      fill="none"
                      stroke="url(#socGrad)"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3.5"
                    />

                    {/* Origin Node */}
                    <circle cx="0" cy="144" fill="#006c4b" r="5" />
                    <text fill="#0b1c30" fontFamily="Space Grotesk" fontSize="10" fontWeight="700" x="10" y="138">
                      {departureSoc}% Dep.
                    </text>

                    {/* Stop 1 (Vacaville) */}
                    <circle cx="220" cy="192" fill="#ba1a1a" r="5" />
                    <circle cx="220" cy="70" fill="#00c48c" filter="url(#glow)" r="6" />
                    <text fill="#006c4b" fontFamily="Space Grotesk" fontSize="10" fontWeight="700" x="228" y="65">
                      +48 kWh (75%)
                    </text>
                    <text fill="#ba1a1a" fontFamily="Hanken Grotesk" fontSize="9" fontWeight="600" x="228" y="198">
                      Arrive 14%
                    </text>

                    {/* Stop 2 (Auburn) */}
                    <circle cx="560" cy="164" fill="#d97706" r="5" />
                    <circle cx="560" cy="90" fill="#00c48c" filter="url(#glow)" r="6" />
                    <text fill="#006c4b" fontFamily="Space Grotesk" fontSize="10" fontWeight="700" x="568" y="85">
                      +29 kWh (65%)
                    </text>
                    <text fill="#565e74" fontFamily="Hanken Grotesk" fontSize="9" fontWeight="600" x="568" y="170">
                      Arrive 28%
                    </text>

                    {/* Summit Peak */}
                    <circle cx="780" cy="48" fill="#565e74" r="4" />
                    <text fill="#565e74" fontFamily="Space Grotesk" fontSize="9" fontWeight="600" x="735" y="40">
                      Echo Summit 7,382'
                    </text>

                    {/* Destination Node */}
                    <circle cx="900" cy="172" fill="#006c4b" r="5" />
                    <text fill="#006c4b" fontFamily="Space Grotesk" fontSize="10" fontWeight="700" x="830" y="165">
                      Arrive 22%
                    </text>
                  </svg>

                  {/* Axis labels */}
                  <div className="absolute bottom-1 left-2 font-label-sm text-label-sm text-[#565e74]">
                    0 mi (SF Bay)
                  </div>
                  <div className="absolute bottom-1 left-[24%] font-label-sm text-label-sm text-[#565e74]">
                    Vacaville (38 mi)
                  </div>
                  <div className="absolute bottom-1 left-[61%] font-label-sm text-label-sm text-[#565e74]">
                    Auburn (100 mi)
                  </div>
                  <div className="absolute bottom-1 right-2 font-label-sm text-label-sm text-[#565e74]">
                    South Lake Tahoe (198 mi)
                  </div>
                </div>

                {/* Sierra Pass Advisory Bar */}
                <div className="flex items-center justify-between bg-[#d3e4fe]/60 px-3 py-2 rounded-xl font-body-sm text-body-sm text-[#0b1c30]">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#494bd6] text-[18px]">ac_unit</span>
                    <span>
                      <strong>Sierra Pass Advisory:</strong> Temps drop to 32°F above 5,000 ft. Battery thermal
                      preconditioning scheduled 15 miles before Auburn.
                    </span>
                  </div>
                  <span className="font-label-sm text-label-sm text-[#494bd6] font-bold cursor-pointer hover:underline">
                    View Curve Data
                  </span>
                </div>
              </div>
            </div>

            {/* STEP-BY-STEP WAYPOINT CARDS TIMELINE */}
            <div className="flex flex-col gap-space-md">
              <div className="flex items-center justify-between px-1">
                <h2 className="font-headline-md text-headline-md text-[#0b1c30]">
                  Waypoint & Charging Schedule
                </h2>
                <div className="flex items-center gap-2">
                  <span className="font-label-sm text-label-sm text-[#565e74]">
                    All chargers confirmed functional &lt; 5m ago
                  </span>
                  <span className="w-2 h-2 rounded-full bg-[#00c48c] animate-pulse" />
                </div>
              </div>

              {/* Step 1: Origin */}
              <div className="bg-white rounded-2xl p-space-md shadow-sm border border-[#bbcac0]/25 flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md transition-all hover:shadow-md">
                <div className="flex items-start gap-space-md">
                  <div className="w-12 h-12 rounded-full bg-[#e5eeff] flex flex-col items-center justify-center shrink-0">
                    <span className="font-label-sm text-label-sm text-[#565e74] font-bold">START</span>
                    <span className="material-symbols-outlined text-[#006c4b] text-[20px]">trip_origin</span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-title-md text-title-md text-[#0b1c30] font-semibold">
                        Origin: San Francisco, CA
                      </span>
                      <span className="font-label-sm text-label-sm bg-[#dce9ff] px-2 py-0.5 rounded-full text-[#565e74]">
                        Mile 0.0
                      </span>
                    </div>
                    <span className="font-body-sm text-body-sm text-[#565e74]">
                      Departing from Financial District • Elevation: 52 ft
                    </span>
                    <div className="flex items-center gap-4 mt-2 font-label-sm text-label-sm">
                      <span className="text-amber-600 font-semibold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">battery_3_bar</span> Departure SoC: 38%
                      </span>
                      <span className="text-[#565e74] flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">schedule</span> 10:15 AM Departure
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                  <div className="text-right hidden sm:block">
                    <span className="font-label-sm text-label-sm text-[#565e74] block">Next Leg</span>
                    <span className="font-title-md text-title-md text-[#0b1c30] font-semibold">
                      38 miles • 42 min
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#eff4ff] flex items-center justify-center text-[#565e74]">
                    <span className="material-symbols-outlined">navigation</span>
                  </div>
                </div>
              </div>

              {/* Step 2: STOP 1 (Vacaville Outlets) */}
              <div className="bg-white rounded-2xl p-space-lg shadow-sm border border-[#bbcac0]/25 flex flex-col gap-space-md transition-all hover:shadow-md border-l-4 border-l-[#00c48c]">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-space-sm">
                  <div className="flex items-start gap-space-md">
                    <div className="w-12 h-12 rounded-full bg-[#63fcc0]/40 flex flex-col items-center justify-center shrink-0 text-[#006c4b]">
                      <span className="font-label-sm text-label-sm font-bold text-[#005138]">STOP 1</span>
                      <span className="material-symbols-outlined text-[20px]">bolt</span>
                    </div>
                    <div className="flex flex-col">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-headline-md text-headline-md text-[#0b1c30]">
                          VoltPoint Ultra - Vacaville Outlets
                        </span>
                        <span className="font-label-sm text-label-sm bg-[#006c4b] text-white px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                          350 kW DC Fast
                        </span>
                        <span className="font-label-sm text-label-sm bg-[#63fcc0]/30 text-[#006c4b] px-2 py-0.5 rounded-full font-semibold">
                          12 of 16 Stalls Free
                        </span>
                      </div>
                      <span className="font-body-sm text-body-sm text-[#565e74] mt-0.5">
                        321 Nut Tree Rd, Vacaville, CA • 38 miles from origin
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start md:self-auto">
                    <span className="font-headline-md text-headline-md text-[#006c4b] font-bold">$16.32</span>
                    <span className="font-label-sm text-label-sm text-[#565e74]">($0.34/kWh)</span>
                  </div>
                </div>

                {/* Charging Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-[#eff4ff] rounded-2xl p-3.5">
                  <div className="flex flex-col">
                    <span className="font-label-sm text-label-sm text-[#565e74] uppercase font-semibold">
                      Arrival SoC
                    </span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="material-symbols-outlined text-amber-500 text-[18px]">battery_1_bar</span>
                      <span className="font-title-md text-title-md text-[#0b1c30] font-bold">14%</span>
                      <span className="font-body-sm text-body-sm text-[#565e74]">(41 mi left)</span>
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <span className="font-label-sm text-label-sm text-[#565e74] uppercase font-semibold">
                      Recommended Charge
                    </span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="material-symbols-outlined text-[#006c4b] text-[18px]">
                        battery_charging_full
                      </span>
                      <span className="font-title-md text-title-md text-[#006c4b] font-bold">14% → 75%</span>
                      <span className="font-body-sm text-body-sm text-[#565e74]">(+48 kWh)</span>
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <span className="font-label-sm text-label-sm text-[#565e74] uppercase font-semibold">
                      Dwell Duration
                    </span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="material-symbols-outlined text-[#565e74] text-[18px]">timer</span>
                      <span className="font-title-md text-title-md text-[#0b1c30] font-bold">22 min</span>
                      <span className="font-body-sm text-body-sm text-[#565e74]">Peak 285kW</span>
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <span className="font-label-sm text-label-sm text-[#565e74] uppercase font-semibold">
                      Bay Allocation
                    </span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="material-symbols-outlined text-[#006c4b] text-[18px]">local_parking</span>
                      <span className="font-title-md text-title-md text-[#0b1c30] font-bold">Stall 4A</span>
                      <span className="font-label-sm text-label-sm bg-[#63fcc0]/40 text-[#005138] px-1.5 py-0.5 rounded font-bold">
                        Auto-Reserved
                      </span>
                    </div>
                  </div>
                </div>

                {/* Amenities & Precondition */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-space-md pt-1">
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <span className="font-label-sm text-label-sm text-[#565e74] uppercase font-semibold">
                      Amenities:
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1 bg-[#e5eeff] px-2.5 py-1 rounded-full font-label-sm text-label-sm text-[#0b1c30]">
                        <span className="material-symbols-outlined text-[16px] text-[#565e74]">restaurant</span> Food
                        Court
                      </span>
                      <span className="flex items-center gap-1 bg-[#e5eeff] px-2.5 py-1 rounded-full font-label-sm text-label-sm text-[#0b1c30]">
                        <span className="material-symbols-outlined text-[16px] text-[#565e74]">local_cafe</span> Starbucks
                        Coffee
                      </span>
                      <span className="flex items-center gap-1 bg-[#e5eeff] px-2.5 py-1 rounded-full font-label-sm text-label-sm text-[#0b1c30]">
                        <span className="material-symbols-outlined text-[16px] text-[#565e74]">wc</span> Restrooms
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <button
                      className="px-3.5 py-1.5 rounded-full bg-[#eff4ff] hover:bg-[#e5eeff] font-label-md text-label-md text-[#0b1c30] transition-colors flex items-center gap-1"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[16px]">map</span>
                      <span>View Map Details</span>
                    </button>
                    <button
                      onClick={() => setIsPreconditioning(!isPreconditioning)}
                      className={`px-3.5 py-1.5 rounded-full font-label-md text-label-md transition-colors flex items-center gap-1 font-semibold ${
                        isPreconditioning
                          ? 'bg-[#006c4b] text-white'
                          : 'bg-[#00c48c] hover:bg-[#3fdfa5] text-[#004a33]'
                      }`}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[16px]">ev_station</span>
                      <span>{isPreconditioning ? 'Preconditioning Active' : 'Precondition Battery'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Step 3: STOP 2 (Auburn Station) */}
              <div className="bg-white rounded-2xl p-space-lg shadow-sm border border-[#bbcac0]/25 flex flex-col gap-space-md transition-all hover:shadow-md border-l-4 border-l-[#494bd6]">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-space-sm">
                  <div className="flex items-start gap-space-md">
                    <div className="w-12 h-12 rounded-full bg-[#e1e0ff] flex flex-col items-center justify-center shrink-0 text-[#494bd6]">
                      <span className="font-label-sm text-label-sm font-bold text-[#2f2ebe]">STOP 2</span>
                      <span className="material-symbols-outlined text-[20px]">terrain</span>
                    </div>
                    <div className="flex flex-col">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-headline-md text-headline-md text-[#0b1c30]">
                          Electrify America - Auburn Station
                        </span>
                        <span className="font-label-sm text-label-sm bg-[#494bd6] text-white px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                          150 kW DC Fast
                        </span>
                        <span className="font-label-sm text-label-sm bg-[#e5eeff] px-2 py-0.5 rounded-full font-semibold text-[#565e74]">
                          Mountain Pass Top-up
                        </span>
                      </div>
                      <span className="font-body-sm text-body-sm text-[#565e74] mt-0.5">
                        Foresthill Rd, Auburn, CA • Elevation 1,220 ft • Pre-summit charge
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start md:self-auto">
                    <span className="font-headline-md text-headline-md text-[#0b1c30] font-bold">$11.60</span>
                    <span className="font-label-sm text-label-sm text-[#565e74]">($0.40/kWh)</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-[#eff4ff] rounded-2xl p-3.5">
                  <div className="flex flex-col">
                    <span className="font-label-sm text-label-sm text-[#565e74] uppercase font-semibold">
                      Arrival SoC
                    </span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="material-symbols-outlined text-[#565e74] text-[18px]">battery_3_bar</span>
                      <span className="font-title-md text-title-md text-[#0b1c30] font-bold">28%</span>
                      <span className="font-body-sm text-body-sm text-[#565e74]">(62 mi driven)</span>
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <span className="font-label-sm text-label-sm text-[#565e74] uppercase font-semibold">
                      Recommended Charge
                    </span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="material-symbols-outlined text-[#006c4b] text-[18px]">
                        battery_charging_full
                      </span>
                      <span className="font-title-md text-title-md text-[#006c4b] font-bold">28% → 65%</span>
                      <span className="font-body-sm text-body-sm text-[#565e74]">(+29 kWh)</span>
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <span className="font-label-sm text-label-sm text-[#565e74] uppercase font-semibold">
                      Dwell Duration
                    </span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="material-symbols-outlined text-[#565e74] text-[18px]">timer</span>
                      <span className="font-title-md text-title-md text-[#0b1c30] font-bold">16 min</span>
                      <span className="font-body-sm text-body-sm text-[#565e74]">High-climb buffer</span>
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <span className="font-label-sm text-label-sm text-[#565e74] uppercase font-semibold">
                      Pass Energy Demand
                    </span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="material-symbols-outlined text-amber-600 text-[18px]">trending_up</span>
                      <span className="font-title-md text-title-md text-[#0b1c30] font-bold">~43% SoC</span>
                      <span className="font-body-sm text-body-sm text-[#565e74]">Summit climb</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-space-md pt-1">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-[#565e74]">store</span>
                    <span className="font-body-sm text-body-sm text-[#565e74]">
                      Target Market, Peet's Coffee, Organic Juice Bar adjacent
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-label-sm text-label-sm bg-[#e5eeff] px-3 py-1 rounded-full text-[#565e74]">
                      Next: 98 mi mountain ascent to Tahoe
                    </span>
                  </div>
                </div>
              </div>

              {/* Step 4: Destination */}
              <div className="bg-white rounded-2xl p-space-md shadow-sm border border-[#bbcac0]/25 flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md transition-all hover:shadow-md">
                <div className="flex items-start gap-space-md">
                  <div className="w-12 h-12 rounded-full bg-[#006c4b]/20 flex flex-col items-center justify-center shrink-0 text-[#006c4b]">
                    <span className="font-label-sm text-label-sm font-bold">ARRIVE</span>
                    <span className="material-symbols-outlined text-[20px]">flag</span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-title-md text-title-md text-[#0b1c30] font-semibold">
                        Destination: South Lake Tahoe, CA
                      </span>
                      <span className="font-label-sm text-label-sm bg-[#63fcc0]/30 text-[#005138] px-2.5 py-0.5 rounded-full font-bold">
                        198 Miles Total
                      </span>
                    </div>
                    <span className="font-body-sm text-body-sm text-[#565e74]">
                      Ski Run Blvd • Elevation: 6,237 ft
                    </span>
                    <div className="flex items-center gap-4 mt-2 font-label-sm text-label-sm">
                      <span className="text-[#006c4b] font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">battery_charging_20</span>
                        Projected Arrival SoC: 22% (Safe Buffer)
                      </span>
                      <span className="text-[#565e74] flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">schedule</span> 2:27 PM Arrival
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                  <span className="font-label-sm text-label-sm bg-[#e5eeff] text-[#0b1c30] font-semibold px-3 py-1.5 rounded-full flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-[#006c4b]">hotel</span>
                    Lodging L2 Ready
                  </span>
                </div>
              </div>
            </div>

            {/* EXPORT, SYNC & NAVIGATION DOCK */}
            <div className="bg-white rounded-2xl p-space-lg shadow-sm border border-[#bbcac0]/25 flex flex-col sm:flex-row items-center justify-between gap-space-md">
              <div className="flex items-center gap-space-sm">
                <div className="w-10 h-10 rounded-full bg-[#00c48c]/20 flex items-center justify-center text-[#006c4b]">
                  <span className="material-symbols-outlined text-[22px]">send_to_mobile</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-label-lg text-label-lg text-[#0b1c30] font-semibold">
                    Sync & Export Itinerary
                  </span>
                  <span className="font-body-sm text-body-sm text-[#565e74]">
                    Dispatch turn-by-turn and charging preconditioning cues
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-end">
                <button
                  onClick={handleSendToCar}
                  className={`flex-1 sm:flex-none px-5 py-2.5 rounded-full font-label-md text-label-md flex items-center justify-center gap-2 transition-transform active:scale-[0.98] ${
                    sentToCar
                      ? 'bg-[#006c4b] text-white'
                      : 'bg-[#0b1c30] text-white hover:bg-[#213145]'
                  }`}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px] text-[#63fcc0]">
                    {sentToCar ? 'check_circle' : 'electric_car'}
                  </span>
                  <span>{sentToCar ? 'Sent to Tesla Model Y' : 'Send to Tesla Model Y'}</span>
                </button>

                <button
                  onClick={handleExportGpx}
                  className="px-4 py-2.5 bg-[#eff4ff] hover:bg-[#e5eeff] text-[#0b1c30] rounded-full font-label-md text-label-md flex items-center gap-1.5 transition-colors border border-[#bbcac0]/20"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {gpxDownloaded ? 'check' : 'file_download'}
                  </span>
                  <span>{gpxDownloaded ? 'GPX Saved' : 'Apple CarPlay / GPX'}</span>
                </button>

                <button
                  onClick={() => navigator.clipboard?.writeText(window.location.href)}
                  className="p-2.5 bg-[#eff4ff] hover:bg-[#e5eeff] text-[#0b1c30] rounded-full transition-colors border border-[#bbcac0]/20"
                  title="Share with passenger"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">share</span>
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
