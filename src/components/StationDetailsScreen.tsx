import React, { useState } from 'react';
import { EVStation, StationStall, ReviewItem } from '../types';
import { REVIEWS_DATA } from '../data/mockData';

interface StationDetailsScreenProps {
  station: EVStation;
  onNavigateBack: () => void;
  onOpenTripPlanner: () => void;
}

export const StationDetailsScreen: React.FC<StationDetailsScreenProps> = ({
  station,
  onNavigateBack,
  onOpenTripPlanner,
}) => {
  const [selectedStallId, setSelectedStallId] = useState<string>('A1');
  const [stallFilter, setStallFilter] = useState<'ALL' | 'CCS' | 'NACS'>('ALL');
  const [isSavedFavorite, setIsSavedFavorite] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [targetSoc, setTargetSoc] = useState<number>(80);
  const [isHoldingStall, setIsHoldingStall] = useState(false);
  const [holdConfirmed, setHoldConfirmed] = useState(false);
  const [holdTimerSec, setHoldTimerSec] = useState(900); // 15 mins
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviews, setReviews] = useState<ReviewItem[]>(REVIEWS_DATA);
  const [newReviewText, setNewReviewText] = useState('');

  // Find currently selected stall from station stalls
  const currentStall = station.stalls.find((s) => s.id === selectedStallId) || station.stalls[0];

  // Calculation for battery slider
  const startingSoc = 38;
  const delta = Math.max(0, targetSoc - startingSoc);
  const capacityKwh = 75; // Tesla Model Y pack reference
  const deliveredKwh = ((delta / 100) * capacityKwh).toFixed(1);
  const addedMiles = Math.round(Number(deliveredKwh) * 4.5);

  let estDurationMin = Math.round((delta / 42) * 18);
  if (targetSoc > 80) {
    estDurationMin += Math.round((targetSoc - 80) * 0.75);
  }
  const ratePerKwh = station.pricePerKwh;
  const estCost = (Number(deliveredKwh) * ratePerKwh).toFixed(2);

  const handleHoldClick = () => {
    setIsHoldingStall(true);
    setTimeout(() => {
      setIsHoldingStall(false);
      setHoldConfirmed(true);
    }, 1100);
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewText.trim()) return;
    const newRev: ReviewItem = {
      id: `rev-${Date.now()}`,
      author: 'Alex Mercer (You)',
      car: 'Tesla Model Y LR',
      avatar: 'AM',
      avatarBg: 'bg-[#00c48c] text-[#004a33]',
      timeAgo: 'Just now',
      rating: 5,
      badge: 'Verified Session',
      stallUsed: `Stall ${selectedStallId}`,
      comment: `“${newReviewText}”`,
    };
    setReviews([newRev, ...reviews]);
    setNewReviewText('');
    setShowReviewModal(false);
  };

  const filteredStalls = station.stalls.filter((st) => {
    if (stallFilter === 'CCS') return st.plugType === 'CCS';
    if (stallFilter === 'NACS') return st.plugType === 'NACS';
    return true;
  });

  return (
    <div className="w-full bg-[#f8f9ff] min-h-[calc(100vh-5rem)]">
      {/* Subtle Glow Canvas Behind */}
      <div className="relative w-full overflow-hidden">
        <div className="absolute -top-40 right-1/4 w-[600px] h-[350px] bg-[#00c48c]/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-96 left-10 w-[420px] h-[280px] bg-[#a1a4ff]/15 rounded-full blur-[120px] pointer-events-none" />

        <div className="w-full max-w-[1440px] mx-auto px-gutter py-space-md">
          {/* Breadcrumb Bar */}
          <nav className="flex items-center gap-space-sm text-[#565e74] font-label-md text-label-md mb-space-md">
            <button
              onClick={onNavigateBack}
              className="hover:text-[#006c4b] transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">ev_station</span>
              <span>Explore Chargers</span>
            </button>
            <span className="material-symbols-outlined text-[14px] text-[#bbcac0]">chevron_right</span>
            <span className="hover:text-[#006c4b] cursor-pointer">San Francisco</span>
            <span className="material-symbols-outlined text-[14px] text-[#bbcac0]">chevron_right</span>
            <span className="text-[#0b1c30] font-semibold truncate">{station.name}</span>
            <span className="ml-2 px-2 py-0.5 rounded-full bg-[#63fcc0] text-[#002114] font-label-sm text-label-sm uppercase tracking-wider">
              Station {station.stationCode}
            </span>
          </nav>

          {/* Top Hero Section / Station Masthead */}
          <div className="relative rounded-2xl bg-white shadow-sm p-space-lg mb-space-xl overflow-hidden border border-[#bbcac0]/25">
            <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-space-lg">
              {/* Station Title and Trust Signals */}
              <div className="flex flex-col gap-2 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#006c4b]/10 text-[#006c4b] font-label-md text-label-md">
                    <span className="material-symbols-outlined text-[16px]">verified</span>
                    Verified Tier 1 Network Hub
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#eff4ff] text-[#0b1c30] font-label-md text-label-md">
                    <span className="material-symbols-outlined text-[16px] text-[#494bd6]">bolt</span>
                    800V High Density Site
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#dce9ff] text-[#565e74] font-label-sm text-label-sm">
                    <span className="material-symbols-outlined text-[14px]">nest_cam_floodlight</span>
                    24/7 Monitored
                  </span>
                </div>

                <div className="flex items-baseline gap-space-sm mt-1">
                  <h1 className="font-headline-lg text-headline-lg text-[#0b1c30] tracking-tight">
                    {station.name}
                  </h1>
                </div>

                <div className="flex flex-wrap items-center gap-space-md text-[#565e74] font-body-md text-body-md mt-1">
                  <div className="flex items-center gap-1 text-[#0b1c30] font-semibold">
                    <span className="text-[#006c4b] text-[17px]">★</span>
                    <span>{station.rating}</span>
                    <span className="text-[#565e74] font-normal">({station.reviewCount} driver check-ins)</span>
                  </div>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#bbcac0]" />
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-[#565e74]">location_on</span>
                    {station.address}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#bbcac0]" />
                  <span className="flex items-center gap-1 text-[#006c4b] font-medium">
                    <span className="material-symbols-outlined text-[16px]">navigation</span>
                    {station.approachNote}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-space-sm shrink-0 w-full xl:w-auto">
                <button
                  onClick={() => navigator.clipboard?.writeText(window.location.href)}
                  className="flex-1 xl:flex-initial flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#eff4ff] hover:bg-[#e5eeff] text-[#0b1c30] font-label-lg text-label-lg transition-colors shadow-sm"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px] text-[#565e74]">share</span>
                  <span>Share Location</span>
                </button>

                <button
                  onClick={() => setIsSavedFavorite(!isSavedFavorite)}
                  className={`flex-1 xl:flex-initial flex items-center justify-center gap-2 px-5 py-3 rounded-full font-label-lg text-label-lg transition-colors shadow-sm ${
                    isSavedFavorite
                      ? 'bg-[#63fcc0]/30 text-[#005138]'
                      : 'bg-[#eff4ff] hover:bg-[#e5eeff] text-[#0b1c30]'
                  }`}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {isSavedFavorite ? 'bookmark' : 'bookmark_border'}
                  </span>
                  <span>{isSavedFavorite ? 'Saved' : 'Save Favorite'}</span>
                </button>

                <button
                  onClick={() => {
                    setIsNavigating(true);
                    setTimeout(() => setIsNavigating(false), 3000);
                  }}
                  className={`flex-1 xl:flex-initial flex items-center justify-center gap-2 px-6 py-3 rounded-full font-label-lg text-label-lg transition-all shadow-md active:scale-95 ${
                    isNavigating
                      ? 'bg-[#006c4b] text-white'
                      : 'bg-[#00c48c] text-[#004a33] hover:bg-[#3fdfa5]'
                  }`}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {isNavigating ? 'check' : 'directions'}
                  </span>
                  <span>{isNavigating ? 'Navigating Active' : `Navigate (${station.driveTime})`}</span>
                </button>
              </div>
            </div>

            {/* Telemetry Strip Banner (5 Metrics) */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-space-md mt-space-lg pt-space-lg bg-[#eff4ff]/60 rounded-2xl p-space-md border border-[#bbcac0]/20">
              {/* Metric 1 */}
              <div className="flex items-start gap-space-sm">
                <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#006c4b] shrink-0 shadow-sm">
                  <span className="material-symbols-outlined text-[20px]">near_me</span>
                </div>
                <div>
                  <p className="font-label-sm text-label-sm text-[#565e74] uppercase tracking-wider">Proximity</p>
                  <p className="font-title-md text-title-md text-[#0b1c30] font-semibold mt-0.5">
                    {station.distance} away
                  </p>
                  <p className="font-body-sm text-body-sm text-[#565e74]">{station.driveTime} via Market St</p>
                </div>
              </div>

              {/* Metric 2 */}
              <div className="flex items-start gap-space-sm">
                <div className="w-9 h-9 rounded-full bg-[#63fcc0]/40 flex items-center justify-center text-[#005138] shrink-0 shadow-sm relative">
                  <span className="material-symbols-outlined text-[20px]">local_gas_station</span>
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-[#00c48c] rounded-full animate-ping" />
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-[#00c48c] rounded-full" />
                </div>
                <div>
                  <p className="font-label-sm text-label-sm text-[#565e74] uppercase tracking-wider">Real-Time Status</p>
                  <p className="font-title-md text-title-md text-[#006c4b] font-bold mt-0.5 flex items-center gap-1">
                    {station.availableStalls} of {station.totalStalls} Open
                  </p>
                  <p className="font-body-sm text-body-sm text-[#565e74]">Zero wait expected</p>
                </div>
              </div>

              {/* Metric 3 */}
              <div className="flex items-start gap-space-sm">
                <div className="w-9 h-9 rounded-full bg-[#e1e0ff] flex items-center justify-center text-[#2f2ebe] shrink-0 shadow-sm">
                  <span className="material-symbols-outlined text-[20px]">flash_on</span>
                </div>
                <div>
                  <p className="font-label-sm text-label-sm text-[#565e74] uppercase tracking-wider">Max Site Output</p>
                  <p className="font-title-md text-title-md text-[#0b1c30] font-semibold mt-0.5">
                    {station.speedKw} kW Ultra-Fast
                  </p>
                  <p className="font-body-sm text-body-sm text-[#494bd6] font-medium">{station.architecture}</p>
                </div>
              </div>

              {/* Metric 4 */}
              <div className="flex items-start gap-space-sm">
                <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#0b1c30] shrink-0 shadow-sm">
                  <span className="material-symbols-outlined text-[20px]">payments</span>
                </div>
                <div>
                  <p className="font-label-sm text-label-sm text-[#565e74] uppercase tracking-wider">Energy Rate</p>
                  <p className="font-title-md text-title-md text-[#0b1c30] font-semibold mt-0.5">
                    ${station.pricePerKwh.toFixed(2)}{' '}
                    <span className="font-body-sm text-body-sm text-[#565e74] font-normal">/ kWh</span>
                  </p>
                  <p className="font-body-sm text-body-sm text-[#006c4b] font-medium">No connection fee</p>
                </div>
              </div>

              {/* Metric 5 */}
              <div className="flex items-start gap-space-sm col-span-2 md:col-span-1">
                <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#565e74] shrink-0 shadow-sm">
                  <span className="material-symbols-outlined text-[20px]">roofing</span>
                </div>
                <div>
                  <p className="font-label-sm text-label-sm text-[#565e74] uppercase tracking-wider">Operating Access</p>
                  <p className="font-title-md text-title-md text-[#0b1c30] font-semibold mt-0.5">Open 24/7</p>
                  <p className="font-body-sm text-body-sm text-[#565e74]">Well lit & covered canopy</p>
                </div>
              </div>
            </div>
          </div>

          {/* MAIN CONTENT TWO-COLUMN GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
            {/* LEFT COLUMN: Stalls & Hardware (7 cols) */}
            <div className="lg:col-span-7 flex flex-col gap-space-lg">
              {/* Section Header & Stall Filter */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pb-space-xs">
                <div className="flex items-center gap-space-sm">
                  <h2 className="font-headline-md text-headline-md text-[#0b1c30]">
                    Live Stall Monitor & Connectors
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#dce9ff] text-[#0b1c30] font-label-sm text-label-sm">
                    {station.stalls.length} Stalls
                  </span>
                </div>

                <div className="flex items-center bg-[#eff4ff] p-1 rounded-full text-[#565e74] font-label-md text-label-md border border-[#bbcac0]/20">
                  <button
                    onClick={() => setStallFilter('ALL')}
                    className={`px-3 py-1 rounded-full transition-all ${
                      stallFilter === 'ALL'
                        ? 'bg-white text-[#0b1c30] shadow-sm font-semibold'
                        : 'hover:text-[#0b1c30]'
                    }`}
                  >
                    All Stalls ({station.stalls.length})
                  </button>
                  <button
                    onClick={() => setStallFilter('CCS')}
                    className={`px-3 py-1 rounded-full transition-all ${
                      stallFilter === 'CCS'
                        ? 'bg-white text-[#0b1c30] shadow-sm font-semibold'
                        : 'hover:text-[#0b1c30]'
                    }`}
                  >
                    CCS (4)
                  </button>
                  <button
                    onClick={() => setStallFilter('NACS')}
                    className={`px-3 py-1 rounded-full transition-all ${
                      stallFilter === 'NACS'
                        ? 'bg-white text-[#0b1c30] shadow-sm font-semibold'
                        : 'hover:text-[#0b1c30]'
                    }`}
                  >
                    NACS (4)
                  </button>
                </div>
              </div>

              {/* Stall Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                {filteredStalls.map((stall) => {
                  const isSelected = selectedStallId === stall.id;

                  if (stall.status === 'SERVICE') {
                    return (
                      <div
                        key={stall.id}
                        className="relative rounded-2xl bg-[#eff4ff]/40 p-space-md shadow-sm border border-[#bbcac0]/30"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2 opacity-60">
                            <span className="w-8 h-8 rounded-full bg-[#dce9ff] flex items-center justify-center font-headline-md text-label-lg font-bold text-[#565e74]">
                              {stall.bay}
                            </span>
                            <div>
                              <span className="font-title-md text-title-md text-[#0b1c30] font-semibold">
                                {stall.plugType === 'CCS' ? 'CCS Combo 1' : 'NACS'}
                              </span>
                              <p className="font-label-sm text-label-sm text-[#565e74]">{stall.voltage}</p>
                            </div>
                          </div>
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffdad6] text-[#93000a] font-label-sm text-label-sm font-bold">
                            <span className="material-symbols-outlined text-[14px]">build</span>
                            SERVICE
                          </span>
                        </div>
                        <div className="mt-space-md p-space-sm bg-[#e5eeff]/60 rounded-xl">
                          <p className="font-body-sm text-body-sm text-[#3c4a42] font-medium flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[16px] text-[#ba1a1a]">info</span>
                            Firmware v4.28 Update Scheduled
                          </p>
                          <p className="font-body-sm text-body-sm text-[#565e74] mt-1">
                            OTA validation in progress. Expected back online at 4:00 PM.
                          </p>
                        </div>
                        <div className="flex items-center justify-between mt-space-md pt-2 text-[#565e74] font-body-sm text-body-sm">
                          <span>Technician assigned</span>
                          <span className="font-label-sm text-label-sm text-[#565e74] uppercase tracking-wider">
                            Dispenser Offline
                          </span>
                        </div>
                      </div>
                    );
                  }

                  if (stall.status === 'IN_USE') {
                    return (
                      <div
                        key={stall.id}
                        className="relative rounded-2xl bg-[#eff4ff]/50 p-space-md shadow-sm border border-[#bbcac0]/20 opacity-95"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-[#dce9ff] flex items-center justify-center font-headline-md text-label-lg font-bold text-[#565e74]">
                              {stall.bay}
                            </span>
                            <div>
                              <span className="font-title-md text-title-md text-[#0b1c30] font-semibold">
                                {stall.plugType === 'CCS' ? 'CCS Combo 1' : 'NACS (Tesla Native)'}
                              </span>
                              <p className="font-label-sm text-label-sm text-[#565e74]">{stall.voltage}</p>
                            </div>
                          </div>
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#dae2fd] text-[#131b2e] font-label-sm text-label-sm font-bold">
                            <span className="w-2 h-2 rounded-full bg-[#565e74]" />
                            IN USE
                          </span>
                        </div>

                        <div className="mt-space-md bg-white/90 rounded-xl p-space-sm border border-[#bbcac0]/15">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="font-body-sm text-body-sm text-[#0b1c30] font-semibold flex items-center gap-1">
                              <span className="material-symbols-outlined text-[16px] text-[#494bd6] animate-spin">
                                sync
                              </span>
                              Dispensing {stall.dispensingKw} kW {stall.currentSoc! > 85 ? '(Tapering)' : ''}
                            </span>
                            <span className="font-label-md text-label-md text-[#565e74] font-bold">
                              {stall.currentSoc}% SOC
                            </span>
                          </div>
                          <div className="w-full bg-[#dce9ff] h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-[#00c48c] h-2 rounded-full transition-all"
                              style={{ width: `${stall.currentSoc}%` }}
                            />
                          </div>
                          <div className="flex items-center justify-between mt-2 font-body-sm text-body-sm text-[#565e74]">
                            <span>{stall.vehicle}</span>
                            <span className="text-[#494bd6] font-semibold flex items-center gap-1">
                              <span className="material-symbols-outlined text-[14px]">timelapse</span>
                              ~{stall.remainingMin} min remaining
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-space-md pt-2 text-[#565e74] font-body-sm text-body-sm">
                          <span>Estimated free: {stall.estimatedFreeTime}</span>
                          <span className="font-label-sm text-label-sm text-[#006c4b] font-bold">
                            Queue Available
                          </span>
                        </div>
                      </div>
                    );
                  }

                  // AVAILABLE STALL
                  return (
                    <div
                      key={stall.id}
                      onClick={() => {
                        setSelectedStallId(stall.id);
                        setHoldConfirmed(false);
                      }}
                      className={`relative rounded-2xl bg-white p-space-md shadow-sm transition-all duration-200 hover:shadow-md cursor-pointer border ${
                        isSelected
                          ? 'ring-2 ring-[#00c48c] border-transparent shadow-md'
                          : 'border-[#bbcac0]/25 hover:border-[#00c48c]/40'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-8 h-8 rounded-full bg-[#eff4ff] flex items-center justify-center font-headline-md text-label-lg font-bold text-[#0b1c30]">
                            {stall.bay}
                          </span>
                          <div>
                            <span className="font-title-md text-title-md text-[#0b1c30] font-semibold">
                              {stall.plugType === 'CCS' ? 'CCS Combo 1' : 'NACS (Tesla Native)'}
                            </span>
                            <p className="font-label-sm text-label-sm text-[#565e74]">{stall.voltage}</p>
                          </div>
                        </div>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#63fcc0]/30 text-[#005138] font-label-sm text-label-sm font-bold">
                          <span className="w-2 h-2 rounded-full bg-[#00c48c] animate-pulse" />
                          AVAILABLE
                        </span>
                      </div>

                      <div className="flex items-center justify-between mt-space-md pt-space-sm bg-[#eff4ff]/40 rounded-xl p-space-sm">
                        <div className="flex flex-col">
                          <span className="font-label-sm text-label-sm text-[#565e74]">Peak Power</span>
                          <span className="font-headline-md text-headline-md text-[#006c4b] font-bold">
                            {stall.powerKw}{' '}
                            <span className="font-body-sm text-body-sm font-normal text-[#565e74]">kW</span>
                          </span>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="font-label-sm text-label-sm text-[#565e74]">
                            {stall.cableType ? 'Cable Type' : 'Vehicle Fit'}
                          </span>
                          <span className="font-label-md text-label-md text-[#0b1c30] font-medium flex items-center gap-1">
                            {stall.cableType ? (
                              <>
                                <span className="material-symbols-outlined text-[16px] text-[#494bd6]">
                                  water_drop
                                </span>
                                {stall.cableType}
                              </>
                            ) : (
                              <>
                                <span className="material-symbols-outlined text-[16px] text-[#006c4b]">
                                  check_box
                                </span>
                                Model Y Native
                              </>
                            )}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-space-md pt-2">
                        <span className="font-body-sm text-body-sm text-[#006c4b] font-medium flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px]">check_circle</span>
                          Plug Ready • Autocharge
                        </span>
                        <button
                          className={`px-4 py-1.5 rounded-full font-label-md text-label-md transition-all shadow-sm active:scale-95 ${
                            isSelected
                              ? 'bg-[#00c48c] text-[#004a33] font-bold'
                              : 'bg-[#eff4ff] hover:bg-[#e5eeff] text-[#0b1c30]'
                          }`}
                          type="button"
                        >
                          {isSelected ? 'Selected' : 'Select Stall'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Hardware Telemetry Drawer */}
              <div className="rounded-2xl bg-white p-space-lg shadow-sm border border-[#bbcac0]/25">
                <div className="flex items-center justify-between mb-space-md">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#006c4b] text-[22px]">tune</span>
                    <h3 className="font-title-md text-title-md text-[#0b1c30] font-semibold">
                      Hardware Telemetry & Supported Standards
                    </h3>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#eff4ff] text-[#565e74] font-label-sm text-label-sm">
                    Site ID: VP-US-CA-0104
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-space-md pt-space-xs text-left">
                  <div className="p-space-sm rounded-xl bg-[#eff4ff]">
                    <span className="font-label-sm text-label-sm text-[#565e74] block uppercase">Protocol Support</span>
                    <span className="font-label-md text-label-md text-[#0b1c30] font-bold mt-1 block">
                      ISO 15118 / Autocharge
                    </span>
                    <span className="font-body-sm text-body-sm text-[#565e74]">Plug & Charge Verified</span>
                  </div>
                  <div className="p-space-sm rounded-xl bg-[#eff4ff]">
                    <span className="font-label-sm text-label-sm text-[#565e74] block uppercase">Cable Extension</span>
                    <span className="font-label-md text-label-md text-[#0b1c30] font-bold mt-1 block">
                      16 ft (4.9m) Balanced
                    </span>
                    <span className="font-body-sm text-body-sm text-[#565e74]">High-tension retractor</span>
                  </div>
                  <div className="p-space-sm rounded-xl bg-[#eff4ff]">
                    <span className="font-label-sm text-label-sm text-[#565e74] block uppercase">Max Grid Feed</span>
                    <span className="font-label-md text-label-md text-[#0b1c30] font-bold mt-1 block">
                      500A Continuous
                    </span>
                    <span className="font-body-sm text-body-sm text-[#565e74]">Liquid-cooled harness</span>
                  </div>
                  <div className="p-space-sm rounded-xl bg-[#eff4ff]">
                    <span className="font-label-sm text-label-sm text-[#565e74] block uppercase">Authentication</span>
                    <span className="font-label-md text-label-md text-[#0b1c30] font-bold mt-1 block">
                      RFID, App, Credit Tap
                    </span>
                    <span className="font-body-sm text-body-sm text-[#565e74]">Apple Pay / Google Pay</span>
                  </div>
                </div>
              </div>

              {/* Station Canopy Imagery */}
              <div className="rounded-2xl bg-white p-space-lg shadow-sm border border-[#bbcac0]/25">
                <h3 className="font-title-md text-title-md text-[#0b1c30] font-semibold mb-space-md">
                  Station Canopy & Approach Bays
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                  <div className="relative rounded-xl overflow-hidden h-48 shadow-sm">
                    <img
                      alt="Pull-Through Bays"
                      className="w-full h-full object-cover"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDh3Osvc3MvvlvdMEOGjQ-xAYL2enJs7XV7tfjzlZASnvi1cxWX8oUxIw-BlH8aBCEGme5X0tA5q9S8S_zIB92XW051NghoL7ZjbUsmGPN4iLNNiL2BHHE4Ho236HJkxq2SkzGAgrq7nC08JScz1HROPOXmPYgd0iuCvGFtdz8jqdE1tmM1hx47emV-B0ygHDHmV_XfHqxCbLXI-M-ARIVax4ua_HPWgj2gDyzcczMV2mvH4-tRRvrSAA"
                    />
                    <span className="absolute bottom-2 left-2 px-2.5 py-1 rounded-full bg-[#f8f9ff]/90 backdrop-blur-md text-[#0b1c30] font-label-sm text-label-sm font-semibold">
                      Pull-Through Bays P1-P4
                    </span>
                  </div>
                  <div className="relative rounded-xl overflow-hidden h-48 shadow-sm">
                    <img
                      alt="Stall Array"
                      className="w-full h-full object-cover"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNf6eMo7OXwZv0XM8L14aGYNo59GlgGqfcA5qvoa6_0QEx4_nMOVIR09XqQNNQO5LPlDLbHndiXKzcl2LTvfodajG_fbNPW0Eh0MhyoEEutDILuMqk9h9HUE5VB0Gy6XzvlnXyo3MW5xq56ykXGsLrG6FDLgGkt-DXiMvJJmuPNYoiMAAqKlOWv_4XVav0W1FrbAmxWvLUz_ixMB906U23iw6rlj8U3d7PAvvVn9-LyJzMqKoEzYkzTA"
                    />
                    <span className="absolute bottom-2 left-2 px-2.5 py-1 rounded-full bg-[#f8f9ff]/90 backdrop-blur-md text-[#0b1c30] font-label-sm text-label-sm font-semibold">
                      Stall A1-A4 Dispenser Array
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Insights & Hold Card (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-space-lg sticky top-24">
              {/* 1. GUARANTEED HOLD RESERVATION CARD */}
              <div className="rounded-2xl bg-white p-space-lg shadow-md border border-[#00c48c]/40 relative overflow-hidden">
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#63fcc0]/20 rounded-full blur-2xl pointer-events-none" />

                <div className="flex items-center justify-between mb-space-sm">
                  <span className="px-3 py-1 rounded-full bg-[#63fcc0]/40 text-[#005138] font-label-sm text-label-sm uppercase tracking-wider font-bold">
                    Guaranteed Hold
                  </span>
                  <span className="font-label-md text-label-md text-[#565e74]">
                    Hold Time: {holdConfirmed ? `${Math.floor(holdTimerSec / 60)}m remaining` : '15 Mins'}
                  </span>
                </div>

                <div className="flex items-baseline justify-between mt-1">
                  <div>
                    <h3 className="font-headline-md text-headline-md text-[#0b1c30]">
                      Reserve Stall {currentStall.bay}
                    </h3>
                    <p className="font-body-sm text-body-sm text-[#565e74]">
                      {currentStall.powerKw}kW Fast {currentStall.plugType} • Bay {currentStall.bay}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-headline-md text-headline-md text-[#0b1c30] font-bold">$1.50</span>
                    <span className="block font-label-sm text-label-sm text-[#006c4b] font-medium">
                      100% Credited at plug-in
                    </span>
                  </div>
                </div>

                {/* Vehicle Match Banner */}
                <div className="my-space-md p-space-sm rounded-xl bg-[#eff4ff] flex items-start gap-space-sm">
                  <span className="material-symbols-outlined text-[#006c4b] text-[20px] shrink-0 mt-0.5">
                    electric_car
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-label-md text-label-md text-[#0b1c30] font-bold">
                        Your 2023 Tesla Model Y
                      </span>
                      <span className="px-2 py-0.5 rounded bg-[#00c48c]/20 text-[#004a33] font-label-sm text-label-sm font-semibold">
                        Full Match
                      </span>
                    </div>
                    <p className="font-body-sm text-body-sm text-[#565e74] mt-0.5">
                      Compatible via Tesla CCS Adapter or Stall A4/B1 native NACS. Peak rate up to 250kW accepted.
                    </p>
                  </div>
                </div>

                {/* CTA */}
                <button
                  onClick={handleHoldClick}
                  disabled={holdConfirmed || isHoldingStall}
                  className={`w-full py-3.5 px-6 rounded-full font-label-lg text-label-lg font-bold shadow-[0_4px_16px_rgba(0,196,140,0.25)] transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${
                    holdConfirmed
                      ? 'bg-[#63fcc0] text-[#002114]'
                      : isHoldingStall
                      ? 'bg-[#00c48c] text-[#004a33] opacity-80'
                      : 'bg-[#00c48c] hover:bg-[#3fdfa5] text-[#004a33]'
                  }`}
                  type="button"
                >
                  {isHoldingStall ? (
                    <>
                      <span className="material-symbols-outlined text-[20px] animate-spin">sync</span>
                      <span>Securing Stall {currentStall.bay}...</span>
                    </>
                  ) : holdConfirmed ? (
                    <>
                      <span className="material-symbols-outlined text-[20px]">check_circle</span>
                      <span>Stall {currentStall.bay} Reserved for 15 Min</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[20px]">lock_clock</span>
                      <span>Hold Stall {currentStall.bay} for Arrival ($1.50)</span>
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-space-sm mt-3 text-[#565e74] font-body-sm text-body-sm">
                  <span className="material-symbols-outlined text-[16px] text-[#006c4b]">verified_user</span>
                  <span>Automatic release & zero penalty if cancelled in 5 mins</span>
                </div>
              </div>

              {/* 2. COST & SESSION ESTIMATOR */}
              <div className="rounded-2xl bg-white p-space-lg shadow-sm border border-[#bbcac0]/25">
                <div className="flex items-center justify-between mb-space-sm">
                  <h3 className="font-title-md text-title-md text-[#0b1c30] font-semibold">
                    Cost & Session Estimator
                  </h3>
                  <span className="font-label-sm text-label-sm text-[#565e74] uppercase tracking-wider">
                    Dynamic Curve
                  </span>
                </div>

                <div className="bg-[#eff4ff]/60 rounded-xl p-space-md mb-space-md">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-label-md text-label-md text-[#565e74]">Starting SoC (Current)</span>
                    <span className="font-label-lg text-label-lg text-[#0b1c30] font-bold">
                      {startingSoc}% (112 mi)
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-label-md text-label-md text-[#565e74]">Target Charge Limit</span>
                    <span className="font-headline-md text-headline-md text-[#006c4b] font-bold">
                      {targetSoc}%
                    </span>
                  </div>

                  <input
                    type="range"
                    min="40"
                    max="100"
                    step="5"
                    value={targetSoc}
                    onChange={(e) => setTargetSoc(Number(e.target.value))}
                    className="w-full h-2.5 bg-[#dce9ff] rounded-full appearance-none cursor-pointer accent-[#00c48c]"
                  />

                  <div className="flex justify-between text-[#565e74] font-label-sm text-label-sm mt-1.5 px-1">
                    <span>Current: 38%</span>
                    <span>Daily Commute (80%)</span>
                    <span>Road Trip (100%)</span>
                  </div>
                </div>

                {/* Estimate Matrix */}
                <div className="grid grid-cols-3 gap-space-sm text-center p-space-sm rounded-xl bg-[#eff4ff] mb-space-md">
                  <div>
                    <span className="font-label-sm text-label-sm text-[#565e74] block uppercase">Est. Duration</span>
                    <span className="font-headline-md text-headline-md text-[#0b1c30] font-bold mt-0.5 block">
                      {estDurationMin} min
                    </span>
                    <span className="font-body-sm text-body-sm text-[#006c4b] font-medium">Fast taper curve</span>
                  </div>
                  <div className="border-l border-r border-[#bbcac0]/30 px-1">
                    <span className="font-label-sm text-label-sm text-[#565e74] block uppercase">Delivered</span>
                    <span className="font-headline-md text-headline-md text-[#0b1c30] font-bold mt-0.5 block">
                      {deliveredKwh} <span className="text-body-sm font-normal text-[#565e74]">kWh</span>
                    </span>
                    <span className="font-body-sm text-body-sm text-[#565e74]">+{addedMiles} mi added</span>
                  </div>
                  <div>
                    <span className="font-label-sm text-label-sm text-[#565e74] block uppercase">Total Cost</span>
                    <span className="font-headline-md text-headline-md text-[#006c4b] font-bold mt-0.5 block">
                      ${estCost}
                    </span>
                    <span className="font-body-sm text-body-sm text-[#565e74]">tax included</span>
                  </div>
                </div>

                {/* Rates */}
                <div className="flex flex-col gap-2 pt-2 border-t border-[#bbcac0]/20">
                  <span className="font-label-sm text-label-sm text-[#565e74] uppercase tracking-wider">
                    Tiered Time-Of-Use Rates
                  </span>
                  <div className="flex items-center justify-between text-body-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#dae2fd]" />
                      <span className="text-[#0b1c30]">Off-Peak (11:00 PM – 7:00 AM)</span>
                    </div>
                    <span className="font-semibold text-[#0b1c30] font-label-md text-label-md">$0.28 / kWh</span>
                  </div>
                  <div className="flex items-center justify-between text-body-sm bg-[#63fcc0]/20 -mx-2 px-2 py-1 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#00c48c]" />
                      <span className="text-[#0b1c30] font-semibold">Mid-Peak (Current • 7:00 AM – 4:00 PM)</span>
                    </div>
                    <span className="font-bold text-[#006c4b] font-label-md text-label-md">$0.34 / kWh</span>
                  </div>
                  <div className="flex items-center justify-between text-body-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#494bd6]" />
                      <span className="text-[#0b1c30]">On-Peak (4:00 PM – 9:00 PM)</span>
                    </div>
                    <span className="font-semibold text-[#0b1c30] font-label-md text-label-md">$0.44 / kWh</span>
                  </div>
                  <div className="mt-2 p-2 bg-[#eff4ff] rounded-xl flex items-center gap-2 text-[#565e74] font-body-sm text-body-sm">
                    <span className="material-symbols-outlined text-[16px] text-[#494bd6]">alarm</span>
                    <span>Idle fee of $0.50/min applies 10 minutes after full charge completion.</span>
                  </div>
                </div>
              </div>

              {/* 3. WALKING DISTANCE & AMENITIES */}
              <div className="rounded-2xl bg-white p-space-lg shadow-sm border border-[#bbcac0]/25">
                <h3 className="font-title-md text-title-md text-[#0b1c30] font-semibold mb-space-sm">
                  Walking Distance & Bay Amenities
                </h3>
                <p className="font-body-sm text-body-sm text-[#565e74] mb-space-md">
                  Check out top-rated partner amenities while your vehicle replenishes.
                </p>
                <div className="grid grid-cols-2 gap-space-sm">
                  <div className="flex items-center gap-2.5 p-space-sm rounded-xl bg-[#eff4ff]">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#006c4b] shadow-sm shrink-0">
                      <span className="material-symbols-outlined text-[18px]">coffee</span>
                    </div>
                    <div className="truncate">
                      <p className="font-label-md text-label-md text-[#0b1c30] font-semibold truncate">Philz Coffee</p>
                      <p className="font-body-sm text-body-sm text-[#565e74]">50m • Order in App</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 p-space-sm rounded-xl bg-[#eff4ff]">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#006c4b] shadow-sm shrink-0">
                      <span className="material-symbols-outlined text-[18px]">shopping_cart</span>
                    </div>
                    <div className="truncate">
                      <p className="font-label-md text-label-md text-[#0b1c30] font-semibold truncate">Whole Foods Market</p>
                      <p className="font-body-sm text-body-sm text-[#565e74]">120m • Restroom code in app</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 p-space-sm rounded-xl bg-[#eff4ff]">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#494bd6] shadow-sm shrink-0">
                      <span className="material-symbols-outlined text-[18px]">wifi</span>
                    </div>
                    <div className="truncate">
                      <p className="font-label-md text-label-md text-[#0b1c30] font-semibold truncate">VoltPoint 5G Wi-Fi</p>
                      <p className="font-body-sm text-body-sm text-[#565e74]">Free 250 Mbps in car</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 p-space-sm rounded-xl bg-[#eff4ff]">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#565e74] shadow-sm shrink-0">
                      <span className="material-symbols-outlined text-[18px]">wc</span>
                    </div>
                    <div className="truncate">
                      <p className="font-label-md text-label-md text-[#0b1c30] font-semibold truncate">Secure Restrooms</p>
                      <p className="font-body-sm text-body-sm text-[#565e74]">Touchless Keycard/PIN</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. DRIVER CHECK-INS */}
              <div className="rounded-2xl bg-white p-space-lg shadow-sm border border-[#bbcac0]/25">
                <div className="flex items-center justify-between mb-space-md">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#006c4b] text-[20px]">rate_review</span>
                    <h3 className="font-title-md text-title-md text-[#0b1c30] font-semibold">Driver Check-Ins</h3>
                  </div>
                  <button
                    onClick={() => setShowReviewModal(true)}
                    className="text-[#006c4b] font-label-md text-label-md hover:underline font-bold"
                    type="button"
                  >
                    Write Check-In
                  </button>
                </div>

                <div className="flex flex-col gap-space-md">
                  {reviews.map((rev) => (
                    <div key={rev.id} className="border-b border-[#bbcac0]/25 pb-space-sm last:border-b-0 last:pb-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-6 h-6 rounded-full font-label-sm text-label-sm font-bold flex items-center justify-center ${rev.avatarBg}`}
                          >
                            {rev.avatar}
                          </span>
                          <span className="font-label-md text-label-md text-[#0b1c30] font-semibold">
                            {rev.author} • {rev.car}
                          </span>
                        </div>
                        <span className="font-body-sm text-body-sm text-[#565e74]">{rev.timeAgo}</span>
                      </div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[#006c4b] text-[13px]">{'★'.repeat(rev.rating)}</span>
                        <span className="px-2 py-0.5 rounded-full bg-[#63fcc0]/30 text-[#005138] font-label-sm text-label-sm font-semibold">
                          {rev.badge}
                        </span>
                        {rev.stallUsed && (
                          <span className="px-2 py-0.5 rounded-full bg-[#eff4ff] text-[#565e74] font-label-sm text-label-sm">
                            {rev.stallUsed}
                          </span>
                        )}
                      </div>
                      <p className="font-body-sm text-body-sm text-[#3c4a42]">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Write Check-In Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-[#bbcac0]/30">
            <div className="flex items-center justify-between pb-3 border-b border-[#bbcac0]/20">
              <span className="font-title-md text-title-md text-[#0b1c30]">Write Driver Check-In</span>
              <button
                onClick={() => setShowReviewModal(false)}
                className="text-[#565e74] hover:text-[#0b1c30] p-1 rounded-full"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleAddReview} className="flex flex-col gap-4 mt-4">
              <div>
                <label className="font-label-md text-label-md text-[#565e74] block mb-1">
                  Session Experience
                </label>
                <textarea
                  required
                  rows={4}
                  value={newReviewText}
                  onChange={(e) => setNewReviewText(e.target.value)}
                  placeholder="Share details on charge speed (kW), cable handling, ease of bay entry, or nearby food..."
                  className="w-full p-3 rounded-2xl bg-[#eff4ff] border border-[#bbcac0]/30 focus:border-[#00c48c] focus:outline-none text-sm text-[#0b1c30]"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="px-4 py-2 rounded-full text-sm font-semibold text-[#565e74] hover:bg-[#eff4ff]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full text-sm font-bold bg-[#00c48c] hover:bg-[#3fdfa5] text-[#004a33] shadow-sm"
                >
                  Publish Check-In
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
