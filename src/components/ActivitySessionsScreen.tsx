import React, { useState, useEffect } from 'react';
import { SESSIONS_HISTORY, FAVORITE_HUBS } from '../data/mockData';
import { ChargingSessionRecord } from '../types';

interface ActivitySessionsScreenProps {
  onOpenStationDetails?: (stationId: string) => void;
  onOpenNetworkMap?: () => void;
}

export const ActivitySessionsScreen: React.FC<ActivitySessionsScreenProps> = ({
  onOpenStationDetails,
  onOpenNetworkMap,
}) => {
  // Live session state
  const [currentSoc, setCurrentSoc] = useState<number>(64);
  const [targetSocLimit, setTargetSocLimit] = useState<number>(80);
  const [elapsedSec, setElapsedSec] = useState<number>(14 * 60 + 32);
  const [isCharging, setIsCharging] = useState<boolean>(true);
  const [livePowerKw, setLivePowerKw] = useState<number>(184.2);
  const [deliveredKwh, setDeliveredKwh] = useState<number>(32.4);
  const [sessionCost, setSessionCost] = useState<number>(11.02);

  // History filter
  const [historyFilter, setHistoryFilter] = useState<'All' | 'VoltPoint' | 'Roaming' | 'Home Level 2'>('All');
  const [selectedReceipt, setSelectedReceipt] = useState<ChargingSessionRecord | null>(null);
  const [showStopModal, setShowStopModal] = useState<boolean>(false);
  const [showDetailedGraph, setShowDetailedGraph] = useState<boolean>(false);
  const [showWalletModal, setShowWalletModal] = useState<boolean>(false);

  // Live timer simulation
  useEffect(() => {
    if (!isCharging) return;
    const interval = setInterval(() => {
      setElapsedSec((prev) => prev + 1);
      // Subtle organic telemetry jitter
      setLivePowerKw((prev) => +(prev + (Math.random() * 0.8 - 0.4)).toFixed(1));
      setDeliveredKwh((prev) => +(prev + 0.01).toFixed(2));
      setSessionCost((prev) => +(prev + 0.0034).toFixed(2));
    }, 1000);
    return () => clearInterval(interval);
  }, [isCharging]);

  const formatElapsed = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins} min ${secs < 10 ? '0' : ''}${secs} sec`;
  };

  const filteredHistory = SESSIONS_HISTORY.filter((item) => {
    if (historyFilter === 'All') return true;
    return item.type === historyFilter;
  });

  const handleStopCharging = () => {
    setIsCharging(false);
    setShowStopModal(false);
  };

  // SVG Gauge calculations
  // circumference for radius 82 is 2 * PI * 82 ≈ 515.22
  const circumference = 515.2;
  const currentOffset = circumference - (circumference * currentSoc) / 100;

  return (
    <div className="w-full bg-[#f8f9ff] min-h-[calc(100vh-5rem)]">
      <div className="w-full max-w-[1440px] mx-auto px-gutter py-space-xl flex flex-col gap-space-xl">
        {/* TOP LIVE SESSION TELEMETRY DECK */}
        <section className="relative overflow-hidden rounded-3xl bg-white shadow-xl border border-[#bbcac0]/25">
          {/* Ambient Glow */}
          <div className="absolute -right-32 -top-32 w-96 h-96 bg-[#00c48c]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-[#63fcc0]/25 rounded-full blur-3xl pointer-events-none" />

          {/* Live Session Top Status Banner */}
          <div className="px-space-xl py-space-md bg-[#e5eeff] flex flex-wrap items-center justify-between gap-space-md border-b border-[#bbcac0]/20">
            <div className="flex items-center gap-space-sm">
              <span className="relative flex h-3.5 w-3.5">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
                    isCharging ? 'bg-[#006c4b] opacity-75' : 'bg-gray-400 opacity-50'
                  }`}
                />
                <span
                  className={`relative inline-flex rounded-full h-3.5 w-3.5 ${
                    isCharging ? 'bg-[#006c4b]' : 'bg-gray-500'
                  }`}
                />
              </span>
              <div className="flex items-center gap-space-xs flex-wrap">
                <span className="font-headline-md text-headline-md tracking-tight text-[#0b1c30]">
                  {isCharging ? 'Active Charging Session' : 'Completed Session Summary'}
                </span>
                <span className="font-label-md text-label-md text-[#565e74] uppercase font-bold">•</span>
                <span className="font-title-md text-title-md text-[#006c4b] font-semibold">
                  Stall A2 @ Embarcadero Hub
                </span>
              </div>
            </div>

            <div className="flex items-center gap-space-xs bg-white px-space-md py-1.5 rounded-full shadow-sm border border-[#bbcac0]/20">
              <span className="material-symbols-outlined text-[#006c4b] text-[18px]">verified</span>
              <span className="font-label-md text-label-md text-[#0b1c30] font-semibold">
                CCS Ultra-Fast Port 4
              </span>
              <span
                className={`font-label-sm text-label-sm px-2 py-0.5 rounded-full font-bold ${
                  isCharging
                    ? 'bg-[#63fcc0] text-[#002114]'
                    : 'bg-[#dae2fd] text-[#131b2e]'
                }`}
              >
                {isCharging ? 'ONLINE' : 'FINISHED'}
              </span>
            </div>
          </div>

          {/* Main Telemetry Body Grid */}
          <div className="p-space-xl grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center relative z-10">
            {/* Left Gauge & Target Control (5 Cols) */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center p-space-lg rounded-2xl bg-[#eff4ff] shadow-sm border border-[#bbcac0]/20">
              {/* Dial Visualizer */}
              <div className="relative w-64 h-64 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                  {/* Track */}
                  <circle
                    className="opacity-80"
                    cx="100"
                    cy="100"
                    fill="transparent"
                    r="82"
                    stroke="#eff4ff"
                    strokeWidth="14"
                  />
                  {/* Starting level (22%) */}
                  <circle
                    cx="100"
                    cy="100"
                    fill="transparent"
                    r="82"
                    stroke="#bec6e0"
                    strokeDasharray="515.2"
                    strokeDashoffset="401.8"
                    strokeLinecap="round"
                    strokeWidth="14"
                  />
                  {/* Target 80% dashed limiter */}
                  <circle
                    className="opacity-50"
                    cx="100"
                    cy="100"
                    fill="transparent"
                    r="82"
                    stroke="#004a33"
                    strokeDasharray="2 18"
                    strokeDashoffset="103"
                    strokeWidth="14"
                  />
                  {/* Realtime Current Charge Progress */}
                  <circle
                    className="transition-all duration-1000 ease-out"
                    cx="100"
                    cy="100"
                    fill="transparent"
                    r="82"
                    stroke={isCharging ? '#00c48c' : '#565e74'}
                    strokeDasharray="515.2"
                    strokeDashoffset={currentOffset}
                    strokeLinecap="round"
                    strokeWidth="14"
                  />
                </svg>

                {/* Center Gauge Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none">
                  <div className="flex items-center gap-1 text-[#006c4b]">
                    <span className="material-symbols-outlined text-[20px] animate-pulse">bolt</span>
                    <span className="font-label-sm text-label-sm tracking-wider uppercase font-bold text-[#3c4a42]">
                      Model Y LR
                    </span>
                  </div>
                  <div className="flex items-baseline">
                    <span className="font-display-lg text-display-lg text-[#0b1c30] font-extrabold tracking-tight">
                      {currentSoc}
                    </span>
                    <span className="font-headline-md text-headline-md text-[#565e74] font-bold">%</span>
                  </div>
                  <span className="font-label-sm text-label-sm text-[#3c4a42] font-medium">
                    Started @ 22% • Target: {targetSocLimit}%
                  </span>
                </div>
              </div>

              {/* Target Limit Switcher */}
              <div className="w-full mt-space-md flex flex-col gap-space-xs">
                <div className="flex justify-between items-center text-[#3c4a42]">
                  <span className="font-label-sm text-label-sm uppercase font-bold text-[#565e74]">
                    Target Limit Threshold
                  </span>
                  <span className="font-label-md text-label-md text-[#006c4b] font-bold">
                    {targetSocLimit === 80 ? '80% Recommended' : '100% Roadtrip Extended'}
                  </span>
                </div>
                <div className="grid grid-cols-2 p-1 bg-[#e5eeff] rounded-full gap-1">
                  <button
                    onClick={() => setTargetSocLimit(80)}
                    className={`py-1.5 rounded-full font-label-md text-label-md font-bold transition-all ${
                      targetSocLimit === 80
                        ? 'bg-white text-[#0b1c30] shadow-sm'
                        : 'text-[#3c4a42] hover:text-[#0b1c30]'
                    }`}
                    type="button"
                  >
                    Daily (80%)
                  </button>
                  <button
                    onClick={() => setTargetSocLimit(100)}
                    className={`py-1.5 rounded-full font-label-md text-label-md font-bold transition-all ${
                      targetSocLimit === 100
                        ? 'bg-white text-[#0b1c30] shadow-sm'
                        : 'text-[#3c4a42] hover:text-[#0b1c30]'
                    }`}
                    type="button"
                  >
                    Trip (100%)
                  </button>
                </div>
              </div>
            </div>

            {/* Right Live Telemetry Cluster (7 Cols) */}
            <div className="lg:col-span-7 flex flex-col justify-between gap-space-lg">
              {/* Highlights 3-col */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md">
                <div className="p-space-md rounded-2xl bg-[#eff4ff] flex flex-col justify-between shadow-sm border border-[#bbcac0]/20">
                  <div className="flex items-center justify-between text-[#565e74]">
                    <span className="font-label-sm text-label-sm uppercase font-bold tracking-wider">Live Power</span>
                    <span className="p-1 rounded-full bg-[#63fcc0]/40 text-[#005138] flex items-center justify-center">
                      <span className="material-symbols-outlined text-[16px] animate-pulse">electric_bolt</span>
                    </span>
                  </div>
                  <div className="mt-space-sm flex flex-col">
                    <span className="font-headline-lg text-headline-lg text-[#0b1c30] font-extrabold tracking-tight">
                      {isCharging ? livePowerKw : 0}{' '}
                      <span className="text-title-md font-medium text-[#565e74]">kW</span>
                    </span>
                    <span className="font-body-sm text-body-sm text-[#006c4b] font-medium flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">speed</span> 742V • 248A
                    </span>
                  </div>
                </div>

                <div className="p-space-md rounded-2xl bg-[#eff4ff] flex flex-col justify-between shadow-sm border border-[#bbcac0]/20">
                  <div className="flex items-center justify-between text-[#565e74]">
                    <span className="font-label-sm text-label-sm uppercase font-bold tracking-wider">Added Range</span>
                    <span className="p-1 rounded-full bg-[#e5eeff] text-[#3c4a42] flex items-center justify-center">
                      <span className="material-symbols-outlined text-[16px]">add_road</span>
                    </span>
                  </div>
                  <div className="mt-space-sm flex flex-col">
                    <span className="font-headline-lg text-headline-lg text-[#006c4b] font-extrabold tracking-tight">
                      +142 <span className="text-title-md font-medium text-[#565e74]">mi</span>
                    </span>
                    <span className="font-body-sm text-body-sm text-[#3c4a42] font-medium">
                      {deliveredKwh} kWh delivered
                    </span>
                  </div>
                </div>

                <div className="p-space-md rounded-2xl bg-[#eff4ff] flex flex-col justify-between shadow-sm border border-[#bbcac0]/20">
                  <div className="flex items-center justify-between text-[#565e74]">
                    <span className="font-label-sm text-label-sm uppercase font-bold tracking-wider">Session Cost</span>
                    <span className="p-1 rounded-full bg-[#e5eeff] text-[#3c4a42] flex items-center justify-center">
                      <span className="material-symbols-outlined text-[16px]">payments</span>
                    </span>
                  </div>
                  <div className="mt-space-sm flex flex-col">
                    <span className="font-headline-lg text-headline-lg text-[#0b1c30] font-extrabold tracking-tight">
                      ${sessionCost}
                    </span>
                    <span className="font-body-sm text-body-sm text-[#565e74] font-medium">
                      Member rate $0.34/kWh
                    </span>
                  </div>
                </div>
              </div>

              {/* Time & Mini Power Curve */}
              <div className="p-space-md rounded-2xl bg-[#eff4ff] flex flex-col gap-space-sm shadow-sm border border-[#bbcac0]/20">
                <div className="flex flex-wrap items-center justify-between gap-space-sm">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#006c4b] text-[20px]">timer</span>
                    <span className="font-title-md text-title-md text-[#0b1c30] font-bold">
                      Elapsed: {formatElapsed(elapsedSec)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-[#63fcc0]/30 px-3 py-1 rounded-full">
                    <span className="material-symbols-outlined text-[#006c4b] text-[16px]">hourglass_top</span>
                    <span className="font-label-md text-label-md text-[#005138] font-bold">
                      {isCharging ? 'Est. 6 min remaining to 80%' : 'Charge session terminated'}
                    </span>
                  </div>
                </div>

                {/* SVG Curve */}
                <div className="w-full flex flex-col gap-1 pt-2">
                  <div className="flex justify-between items-center text-[#565e74] font-label-sm text-label-sm">
                    <span>Session Power Ramp Profile</span>
                    <span>Peak 242 kW @ 34% SOC</span>
                  </div>
                  <div className="h-16 w-full relative">
                    <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 400 60">
                      <defs>
                        <linearGradient id="powerCurveGrad" x1="0%" x2="0%" y1="0%" y2="100%">
                          <stop offset="0%" stopColor="#00c48c" stopOpacity="0.35" />
                          <stop offset="100%" stopColor="#00c48c" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M 0,55 Q 30,52 60,20 T 130,8 T 220,18 T 320,38 T 400,42 L 400,60 L 0,60 Z"
                        fill="url(#powerCurveGrad)"
                      />
                      <path
                        d="M 0,55 Q 30,52 60,20 T 130,8 T 220,18 T 320,38 T 400,42"
                        fill="none"
                        stroke="#00c48c"
                        strokeLinecap="round"
                        strokeWidth="3"
                      />
                      <circle cx="320" cy="38" fill="#006c4b" r="4.5" stroke="#ffffff" strokeWidth="2" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="flex flex-wrap items-center justify-between gap-space-md pt-space-xs">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#565e74] text-[20px]">lock</span>
                  <span className="font-body-sm text-body-sm text-[#565e74]">
                    {isCharging ? 'Cable safely locked by vehicle port' : 'Port unlocked, please return cable'}
                  </span>
                </div>

                <div className="flex items-center gap-space-sm">
                  <button
                    onClick={() => setShowDetailedGraph(true)}
                    className="px-5 py-2.5 rounded-full bg-[#e5eeff] text-[#0b1c30] font-label-lg text-label-lg hover:bg-[#dce9ff] transition-colors shadow-sm cursor-pointer"
                    type="button"
                  >
                    Detailed Graph
                  </button>

                  {isCharging ? (
                    <button
                      onClick={() => setShowStopModal(true)}
                      className="px-6 py-2.5 rounded-full bg-[#ffdad6] text-[#93000a] font-label-lg text-label-lg hover:bg-[#ba1a1a] hover:text-white transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[18px]">stop_circle</span>
                      <span>Stop Charging Session</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsCharging(true)}
                      className="px-6 py-2.5 rounded-full bg-[#00c48c] text-[#004a33] font-label-lg text-label-lg hover:bg-[#3fdfa5] transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[18px]">play_circle</span>
                      <span>Restart Session</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4-COLUMN BENTO METRICS */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
          {/* Metric 1 */}
          <div className="p-space-lg rounded-2xl bg-white shadow-sm border border-[#bbcac0]/25 hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="flex items-center justify-between mb-space-md">
              <div className="p-2.5 rounded-full bg-[#63fcc0]/30 text-[#006c4b]">
                <span className="material-symbols-outlined text-[24px]">energy_savings_leaf</span>
              </div>
              <span className="font-label-sm text-label-sm bg-[#63fcc0] text-[#002114] px-2 py-0.5 rounded-full font-bold">
                +18% this month
              </span>
            </div>
            <div>
              <span className="font-label-md text-label-md text-[#565e74] uppercase font-semibold">
                Total Clean Energy
              </span>
              <div className="font-headline-lg text-headline-lg text-[#0b1c30] font-bold tracking-tight mt-1">
                1,428 <span className="text-title-md font-medium text-[#565e74]">kWh</span>
              </div>
            </div>
            <div className="mt-space-md pt-space-xs flex items-center justify-between text-[#3c4a42] font-body-sm text-body-sm">
              <span>100% Renewable certified</span>
              <span className="material-symbols-outlined text-[16px] text-[#006c4b]">eco</span>
            </div>
          </div>

          {/* Metric 2 */}
          <div className="p-space-lg rounded-2xl bg-white shadow-sm border border-[#bbcac0]/25 hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="flex items-center justify-between mb-space-md">
              <div className="p-2.5 rounded-full bg-[#dce9ff] text-[#0b1c30]">
                <span className="material-symbols-outlined text-[24px]">savings</span>
              </div>
              <span className="font-label-sm text-label-sm bg-[#e5eeff] text-[#3c4a42] px-2 py-0.5 rounded-full font-bold">
                vs $5.15/gal CA
              </span>
            </div>
            <div>
              <span className="font-label-md text-label-md text-[#565e74] uppercase font-semibold">
                Fuel Cost Savings
              </span>
              <div className="font-headline-lg text-headline-lg text-[#006c4b] font-bold tracking-tight mt-1">
                $1,180 <span className="text-title-md font-medium text-[#565e74]">saved</span>
              </div>
            </div>
            <div className="mt-space-md pt-space-xs flex items-center justify-between text-[#3c4a42] font-body-sm text-body-sm">
              <span>Compared to Premium Gas</span>
              <span className="material-symbols-outlined text-[16px] text-[#006c4b]">trending_up</span>
            </div>
          </div>

          {/* Metric 3 */}
          <div className="p-space-lg rounded-2xl bg-white shadow-sm border border-[#bbcac0]/25 hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="flex items-center justify-between mb-space-md">
              <div className="p-2.5 rounded-full bg-[#e1e0ff]/60 text-[#2f2ebe]">
                <span className="material-symbols-outlined text-[24px]">forest</span>
              </div>
              <span className="font-label-sm text-label-sm bg-[#a1a4ff]/30 text-[#2724b8] px-2 py-0.5 rounded-full font-bold">
                Offset verified
              </span>
            </div>
            <div>
              <span className="font-label-md text-label-md text-[#565e74] uppercase font-semibold">CO₂ Offset</span>
              <div className="font-headline-lg text-headline-lg text-[#0b1c30] font-bold tracking-tight mt-1">
                1.2 <span className="text-title-md font-medium text-[#565e74]">Metric Tons</span>
              </div>
            </div>
            <div className="mt-space-md pt-space-xs flex items-center justify-between text-[#3c4a42] font-body-sm text-body-sm">
              <span>Equivalent to 54 trees planted</span>
              <span className="material-symbols-outlined text-[16px] text-[#006c4b]">park</span>
            </div>
          </div>

          {/* Metric 4 */}
          <div className="p-space-lg rounded-2xl bg-white shadow-sm border border-[#bbcac0]/25 hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="flex items-center justify-between mb-space-md">
              <div className="p-2.5 rounded-full bg-[#dae2fd] text-[#5c647a]">
                <span className="material-symbols-outlined text-[24px]">offline_bolt</span>
              </div>
              <span className="font-label-sm text-label-sm bg-[#dae2fd] text-[#131b2e] px-2 py-0.5 rounded-full font-bold">
                Top 5% speed
              </span>
            </div>
            <div>
              <span className="font-label-md text-label-md text-[#565e74] uppercase font-semibold">
                Average Charging Speed
              </span>
              <div className="font-headline-lg text-headline-lg text-[#0b1c30] font-bold tracking-tight mt-1">
                165 <span className="text-title-md font-medium text-[#565e74]">kW DC Fast</span>
              </div>
            </div>
            <div className="mt-space-md pt-space-xs flex items-center justify-between text-[#3c4a42] font-body-sm text-body-sm">
              <span>Avg session: 24 mins</span>
              <span className="material-symbols-outlined text-[16px] text-[#565e74]">schedule</span>
            </div>
          </div>
        </section>

        {/* BOTTOM SECTION: SESSIONS HISTORY & RIGHT PASS/FAVORITES */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl">
          {/* Left Column: Sessions History (8 Cols) */}
          <div className="lg:col-span-8 flex flex-col gap-space-lg">
            <div className="bg-white p-space-lg rounded-2xl shadow-sm border border-[#bbcac0]/25 flex flex-col gap-space-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pb-space-xs">
                <div>
                  <div className="font-headline-md text-headline-md text-[#0b1c30] tracking-tight">
                    Recent Sessions History
                  </div>
                  <div className="font-body-sm text-body-sm text-[#565e74]">
                    Review live receipts, charge speeds, and telemetry archives
                  </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center bg-[#eff4ff] p-1 rounded-full gap-1 overflow-x-auto max-w-full border border-[#bbcac0]/20">
                  {(['All', 'VoltPoint', 'Roaming', 'Home Level 2'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setHistoryFilter(tab)}
                      className={`px-3.5 py-1.5 rounded-full font-label-md text-label-md shrink-0 transition-all ${
                        historyFilter === tab
                          ? 'font-bold bg-white text-[#0b1c30] shadow-sm'
                          : 'font-medium text-[#565e74] hover:text-[#0b1c30]'
                      }`}
                      type="button"
                    >
                      {tab === 'All' ? 'All (24)' : tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Session rows */}
              <div className="flex flex-col gap-space-sm">
                {filteredHistory.map((item) => (
                  <div
                    key={item.id}
                    className="p-space-md rounded-2xl bg-[#eff4ff] hover:bg-[#e5eeff] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-space-md border border-[#bbcac0]/15"
                  >
                    <div className="flex items-center gap-space-md">
                      <div className="w-11 h-11 rounded-full bg-[#63fcc0]/40 flex items-center justify-center text-[#006c4b] shrink-0">
                        <span className="material-symbols-outlined text-[24px]">ev_station</span>
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="font-title-md text-title-md text-[#0b1c30] font-bold">
                            {item.stationName}
                          </span>
                          <span className="font-label-sm text-label-sm bg-[#63fcc0] text-[#002114] px-2 py-0.5 rounded-full font-bold">
                            {item.networkBadge}
                          </span>
                        </div>
                        <span className="font-body-sm text-body-sm text-[#565e74]">
                          {item.date} • {item.stall}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-space-lg border-t sm:border-t-0 pt-2 sm:pt-0">
                      <div className="flex flex-col text-left sm:text-right">
                        <span className="font-label-md text-label-md text-[#0b1c30] font-bold">
                          {item.energyKwh} kWh
                        </span>
                        <span className="font-body-sm text-body-sm text-[#565e74]">
                          {item.durationMin} min duration
                        </span>
                      </div>
                      <div className="flex flex-col text-right">
                        <span className="font-title-md text-title-md text-[#0b1c30] font-extrabold">
                          ${item.cost.toFixed(2)}
                        </span>
                        <button
                          onClick={() => setSelectedReceipt(item)}
                          className="font-label-sm text-label-sm text-[#006c4b] hover:underline flex items-center justify-end gap-0.5 cursor-pointer"
                          type="button"
                        >
                          <span>PDF Receipt</span>
                          <span className="material-symbols-outlined text-[14px]">download</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Pagination */}
              <div className="pt-space-xs flex items-center justify-between text-[#3c4a42]">
                <span className="font-body-sm text-body-sm text-[#565e74]">
                  Showing {filteredHistory.length} of 24 verified sessions
                </span>
                <button
                  onClick={() => {
                    const csvContent =
                      'data:text/csv;charset=utf-8,Date,Station,Energy(kWh),Duration(min),Cost\n' +
                      SESSIONS_HISTORY.map(
                        (e) => `"${e.date}","${e.stationName}",${e.energyKwh},${e.durationMin},${e.cost}`
                      ).join('\n');
                    const encodedUri = encodeURI(csvContent);
                    const link = document.createElement('a');
                    link.setAttribute('href', encodedUri);
                    link.setAttribute('download', 'VoltPoint_Sessions_Export.csv');
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="font-label-md text-label-md text-[#006c4b] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  type="button"
                >
                  <span>Export Full CSV Log</span>
                  <span className="material-symbols-outlined text-[18px]">table_view</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Favorite Hubs & Pass (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col gap-space-lg">
            {/* Favorite Hubs */}
            <div className="bg-white p-space-lg rounded-2xl shadow-sm border border-[#bbcac0]/25 flex flex-col gap-space-md">
              <div className="flex items-center justify-between">
                <div className="font-headline-md text-headline-md text-[#0b1c30] tracking-tight">Favorite Hubs</div>
                <button
                  className="p-1 rounded-full text-[#565e74] hover:text-[#0b1c30] hover:bg-[#eff4ff] transition-colors"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[20px]">add_location_alt</span>
                </button>
              </div>

              <div className="flex flex-col gap-space-sm">
                {FAVORITE_HUBS.map((hub) => (
                  <div
                    key={hub.id}
                    onClick={() => onOpenStationDetails?.('station-embarcadero')}
                    className="p-space-md rounded-2xl bg-[#eff4ff] flex items-center justify-between hover:bg-[#e5eeff] transition-colors cursor-pointer border border-[#bbcac0]/15"
                  >
                    <div className="flex items-center gap-space-sm">
                      <div className="p-2 rounded-full bg-[#d3e4fe] text-[#0b1c30]">
                        <span className="material-symbols-outlined text-[20px]">{hub.icon}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-title-md text-title-md text-[#0b1c30] font-bold">{hub.name}</span>
                        <span className="font-body-sm text-body-sm text-[#565e74]">{hub.location}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span
                        className={`font-label-md text-label-md font-bold ${
                          hub.isFull ? 'text-[#3c4a42]' : 'text-[#006c4b]'
                        }`}
                      >
                        {hub.openStalls}
                      </span>
                      <span
                        className={`font-label-sm text-label-sm font-medium ${
                          hub.isFull ? 'text-[#ba1a1a]' : 'text-[#565e74]'
                        }`}
                      >
                        {hub.specs}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={onOpenNetworkMap}
                className="w-full py-2.5 rounded-full bg-[#e5eeff] text-[#0b1c30] font-label-lg text-label-lg hover:bg-[#dce9ff] transition-colors flex items-center justify-center gap-2 cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">explore</span>
                <span>View Network Map (12 Stations)</span>
              </button>
            </div>

            {/* VoltPoint Pass */}
            <div className="bg-white p-space-lg rounded-2xl shadow-sm border border-[#bbcac0]/25 flex flex-col gap-space-md">
              <div className="flex items-center justify-between">
                <div className="font-headline-md text-headline-md text-[#0b1c30] tracking-tight">VoltPoint Pass</div>
                <span className="font-label-sm text-label-sm bg-[#63fcc0] text-[#002114] px-2.5 py-1 rounded-full font-bold">
                  ACTIVE TIER
                </span>
              </div>

              {/* Digital Pass Card */}
              <div className="relative overflow-hidden rounded-2xl p-space-md bg-[#213145] text-[#eaf1ff] flex flex-col justify-between h-44 shadow-lg border border-[#bbcac0]/20">
                <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-6 translate-y-6">
                  <span className="material-symbols-outlined text-[180px]">offline_bolt</span>
                </div>

                <div className="flex justify-between items-start relative z-10">
                  <div className="flex flex-col">
                    <span className="font-label-sm text-label-sm tracking-wider uppercase opacity-75 font-semibold">
                      Priority Member Pass
                    </span>
                    <span className="font-title-md text-title-md font-bold tracking-tight text-[#63fcc0]">
                      10% Peak Rate Discount
                    </span>
                  </div>
                  <span className="material-symbols-outlined text-[#63fcc0] text-[24px]">contactless</span>
                </div>

                <div className="relative z-10 flex justify-between items-end">
                  <div className="flex flex-col">
                    <span className="font-label-sm text-label-sm opacity-60 uppercase font-mono">Card Holder</span>
                    <span className="font-label-md text-label-md font-semibold tracking-wider">
                      ALEXANDER MERCER
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-label-sm text-label-sm bg-[#d3e4fe]/20 px-2 py-1 rounded font-mono">
                      VP-9942
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div className="flex flex-col gap-space-xs pt-1">
                <div className="flex items-center justify-between text-[#3c4a42] font-body-sm text-body-sm py-1 border-b border-[#e5eeff]">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#565e74] text-[18px]">credit_card</span>
                    <span>Payment Method</span>
                  </div>
                  <span className="font-label-md text-label-md text-[#0b1c30] font-semibold">
                    Apple Pay (•• 4821)
                  </span>
                </div>
                <div className="flex items-center justify-between text-[#3c4a42] font-body-sm text-body-sm py-1">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#565e74] text-[18px]">autorenew</span>
                    <span>Auto-Reload Wallet</span>
                  </div>
                  <span className="font-label-md text-label-md text-[#006c4b] font-bold">Enabled ($25.00)</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-space-sm pt-space-xs">
                <button
                  onClick={() => setShowWalletModal(true)}
                  className="py-2 px-3 rounded-full bg-[#e5eeff] text-[#0b1c30] font-label-md text-label-md hover:bg-[#dce9ff] transition-colors text-center font-bold cursor-pointer"
                  type="button"
                >
                  Manage Wallet
                </button>
                <button
                  onClick={() => setShowWalletModal(true)}
                  className="py-2 px-3 rounded-full bg-[#eff4ff] text-[#565e74] font-label-md text-label-md hover:text-[#0b1c30] hover:bg-[#e5eeff] transition-colors text-center font-bold cursor-pointer"
                  type="button"
                >
                  Billing History
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stop Charging Confirmation Modal */}
      {showStopModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-[#bbcac0]/30">
            <div className="flex items-center gap-3 pb-3 border-b border-[#bbcac0]/20 text-[#ba1a1a]">
              <span className="material-symbols-outlined text-[28px]">warning</span>
              <span className="font-title-md text-title-md text-[#0b1c30]">Stop Charging Session?</span>
            </div>
            <p className="font-body-md text-body-md text-[#565e74] mt-4">
              Terminating charging at Stall A2 now will release the port lock and conclude the billing session at $
              {sessionCost}.
            </p>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowStopModal(false)}
                className="px-4 py-2 rounded-full font-label-md text-label-md text-[#565e74] hover:bg-[#eff4ff]"
              >
                Cancel
              </button>
              <button
                onClick={handleStopCharging}
                className="px-5 py-2 rounded-full font-label-md text-label-md font-bold bg-[#ffdad6] text-[#93000a] hover:bg-[#ba1a1a] hover:text-white transition-colors"
              >
                Confirm Stop
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Graph Modal */}
      {showDetailedGraph && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-2xl w-full shadow-2xl border border-[#bbcac0]/30">
            <div className="flex items-center justify-between pb-3 border-b border-[#bbcac0]/20">
              <div>
                <span className="font-title-md text-title-md text-[#0b1c30]">Detailed Session Telemetry</span>
                <span className="font-body-sm text-body-sm text-[#565e74] block">
                  High-frequency 10Hz current & voltage traces
                </span>
              </div>
              <button
                onClick={() => setShowDetailedGraph(false)}
                className="p-1 rounded-full text-[#565e74] hover:text-[#0b1c30]"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="mt-4 p-4 rounded-2xl bg-[#eff4ff]">
              <div className="h-44 w-full">
                <svg className="w-full h-full" viewBox="0 0 500 150">
                  <line stroke="#bbcac0" strokeDasharray="3 3" x1="0" x2="500" y1="30" y2="30" />
                  <line stroke="#bbcac0" strokeDasharray="3 3" x1="0" x2="500" y1="75" y2="75" />
                  <line stroke="#bbcac0" strokeDasharray="3 3" x1="0" x2="500" y1="120" y2="120" />
                  <path
                    d="M 0,130 Q 50,120 100,40 T 200,20 T 320,60 T 450,85 L 500,90"
                    fill="none"
                    stroke="#00c48c"
                    strokeWidth="3"
                  />
                  <path
                    d="M 0,140 Q 50,135 100,90 T 200,80 T 320,105 T 450,120 L 500,125"
                    fill="none"
                    stroke="#494bd6"
                    strokeWidth="2"
                    strokeDasharray="4 2"
                  />
                </svg>
              </div>
              <div className="flex items-center justify-between text-xs text-[#565e74] mt-2">
                <span className="text-[#006c4b] font-bold">― Dispensed Power (kW)</span>
                <span className="text-[#494bd6] font-bold">--- Pack Voltage (V)</span>
                <span>Peak: 242 kW</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PDF Receipt Viewer Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-[#bbcac0]/30 flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#bbcac0]/20">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006c4b]">receipt_long</span>
                <span className="font-title-md text-title-md text-[#0b1c30]">VoltPoint Tax Invoice</span>
              </div>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="text-[#565e74] hover:text-[#0b1c30] p-1"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="bg-[#eff4ff] p-4 rounded-2xl flex flex-col gap-2 font-mono text-sm text-[#0b1c30]">
              <div className="flex justify-between">
                <span className="text-[#565e74]">Station:</span>
                <span className="font-bold">{selectedReceipt.stationName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#565e74]">Timestamp:</span>
                <span>{selectedReceipt.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#565e74]">Bay/Stall:</span>
                <span>{selectedReceipt.stall}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#565e74]">Delivered Energy:</span>
                <span className="font-bold">{selectedReceipt.energyKwh} kWh</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#565e74]">Duration:</span>
                <span>{selectedReceipt.durationMin} mins</span>
              </div>
              <div className="h-[1px] bg-[#bbcac0]/40 my-1" />
              <div className="flex justify-between text-base font-bold text-[#006c4b]">
                <span>Total Amount Paid:</span>
                <span>${selectedReceipt.cost.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  alert('Receipt downloaded to PDF archive.');
                  setSelectedReceipt(null);
                }}
                className="px-5 py-2.5 bg-[#00c48c] text-[#004a33] font-bold rounded-full text-sm hover:bg-[#3fdfa5]"
              >
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Wallet Management Modal */}
      {showWalletModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-[#bbcac0]/30">
            <div className="flex items-center justify-between pb-3 border-b border-[#bbcac0]/20">
              <span className="font-title-md text-title-md text-[#0b1c30]">Manage VoltPoint Wallet</span>
              <button onClick={() => setShowWalletModal(false)} className="text-[#565e74] hover:text-[#0b1c30] p-1">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="mt-4 flex flex-col gap-3">
              <div className="p-3 rounded-2xl bg-[#eff4ff] flex items-center justify-between">
                <span className="text-sm text-[#565e74]">Current Stored Balance:</span>
                <span className="text-lg font-bold text-[#006c4b] font-mono">$48.50</span>
              </div>
              <div className="p-3 rounded-2xl bg-[#eff4ff] flex items-center justify-between">
                <span className="text-sm text-[#565e74]">Auto-Reload Trigger:</span>
                <span className="text-sm font-semibold text-[#0b1c30]">When &lt; $10 reload $25</span>
              </div>
              <button
                onClick={() => {
                  alert('Added $25.00 via Apple Pay');
                  setShowWalletModal(false);
                }}
                className="w-full py-3 bg-[#0b1c30] text-white font-bold rounded-full text-sm hover:bg-[#213145]"
              >
                Top Up $25.00 Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
