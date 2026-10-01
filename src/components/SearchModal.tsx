import React, { useState, useEffect } from 'react';
import { EVStation } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  stations: EVStation[];
  onSelectStation: (station: EVStation) => void;
  onNavigateTab: (tab: 'find-chargers' | 'station-details' | 'trip-planner' | 'activity-and-sessions') => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  stations,
  onSelectStation,
  onNavigateTab,
}) => {
  const [query, setQuery] = useState('');

  // Handle keyboard shortcut ⌘K / Ctrl+K and ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredStations = stations.filter(
    (st) =>
      st.name.toLowerCase().includes(query.toLowerCase()) ||
      st.address.toLowerCase().includes(query.toLowerCase()) ||
      st.network.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-start justify-center pt-20 p-4">
      <div className="bg-white rounded-3xl p-5 max-w-xl w-full shadow-2xl border border-[#bbcac0]/30 flex flex-col gap-4">
        {/* Input */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#eff4ff] border border-[#bbcac0]/25">
          <span className="material-symbols-outlined text-[#006c4b] text-[22px]">search</span>
          <input
            autoFocus
            type="text"
            placeholder="Search city, zip, station, or network..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-[#0b1c30] outline-none text-base font-body-md"
          />
          <kbd className="font-label-sm text-label-sm bg-white px-2 py-0.5 rounded text-[#565e74] border border-[#bbcac0]/40">
            ESC
          </kbd>
        </div>

        {/* Quick Navigation Shortcuts */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-[#565e74] font-medium shrink-0">Jump to:</span>
          <button
            onClick={() => {
              onNavigateTab('find-chargers');
              onClose();
            }}
            className="px-3 py-1 rounded-full bg-[#eff4ff] hover:bg-[#e5eeff] text-[#006c4b] font-semibold"
          >
            Find Chargers
          </button>
          <button
            onClick={() => {
              onNavigateTab('trip-planner');
              onClose();
            }}
            className="px-3 py-1 rounded-full bg-[#eff4ff] hover:bg-[#e5eeff] text-[#494bd6] font-semibold"
          >
            Trip Planner (Tahoe)
          </button>
          <button
            onClick={() => {
              onNavigateTab('activity-and-sessions');
              onClose();
            }}
            className="px-3 py-1 rounded-full bg-[#eff4ff] hover:bg-[#e5eeff] text-[#0b1c30] font-semibold"
          >
            Live Session (Stall A2)
          </button>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto flex flex-col gap-2">
          {filteredStations.length === 0 ? (
            <div className="text-center py-6 text-sm text-[#565e74]">
              No stations found matching &ldquo;{query}&rdquo;
            </div>
          ) : (
            filteredStations.map((station) => (
              <div
                key={station.id}
                onClick={() => {
                  onSelectStation(station);
                  onNavigateTab('station-details');
                  onClose();
                }}
                className="p-3 rounded-2xl bg-[#eff4ff]/60 hover:bg-[#eff4ff] transition-colors flex items-center justify-between cursor-pointer border border-[#bbcac0]/15"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#00c48c]/20 flex items-center justify-center text-[#006c4b]">
                    <span className="material-symbols-outlined text-[20px]">ev_station</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-md text-label-md font-bold text-[#0b1c30]">
                      {station.name}
                    </span>
                    <span className="font-body-sm text-body-sm text-[#565e74]">
                      {station.address} • {station.distance}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#006c4b] bg-[#63fcc0]/30 px-2.5 py-1 rounded-full">
                    {station.availableStalls}/{station.totalStalls} Free
                  </span>
                  <span className="text-xs text-[#565e74]">{station.speedKw}kW</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
