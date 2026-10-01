import React, { useState } from 'react';
import { TabType } from '../types';

interface HeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onOpenSearch: () => void;
  selectedPlugs: string[];
  onTogglePlug: (plug: string) => void;
  onSelectStation: (stationId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenSearch,
  selectedPlugs,
  onTogglePlug,
  onSelectStation,
}) => {
  const [showLocationToast, setShowLocationToast] = useState(false);
  const [showPlugFilter, setShowPlugFilter] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleSyncGps = () => {
    setShowLocationToast(true);
    setTimeout(() => setShowLocationToast(false), 2400);
  };

  const navItems: { id: TabType; label: string }[] = [
    { id: 'find-chargers', label: 'Find Chargers' },
    { id: 'station-details', label: 'Station Details' },
    { id: 'trip-planner', label: 'Trip Planner' },
    { id: 'activity-and-sessions', label: 'Activity & Sessions' },
  ];

  const plugOptions = ['CCS Combo 1', 'NACS (Tesla)', 'J1772', 'CHAdeMO'];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#f8f9ff]/90 backdrop-blur-xl border-b border-[#bbcac0]/30 shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
      <div className="h-20 w-full px-gutter flex items-center justify-between gap-space-md">
        {/* Left: Brand + Location + Vehicle Indicator */}
        <div className="flex items-center gap-space-md shrink-0">
          <button
            onClick={() => setActiveTab('find-chargers')}
            className="flex items-center gap-space-sm text-left group"
          >
            <div className="w-8 h-8 rounded-xl bg-[#00c48c] flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
              <span className="material-symbols-outlined text-[20px] text-white">bolt</span>
            </div>
            <span className="font-headline-md text-headline-md tracking-tight text-[#0b1c30]">
              Low <span className="text-[#006c4b]">Battery</span>
            </span>
          </button>

          <div className="h-6 w-[1px] bg-[#bbcac0]/40 hidden xl:block" />

          {/* Current Location Pill with live GPS refresh */}
          <div className="hidden xl:flex items-center gap-space-sm bg-[#eff4ff] px-space-md py-1.5 rounded-full border border-[#bbcac0]/20">
            <span className="material-symbols-outlined text-[#006c4b] text-[18px]">near_me</span>
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-[#565e74] uppercase tracking-wider">
                Current Location
              </span>
              <span className="font-body-sm text-body-sm text-[#0b1c30] font-medium truncate max-w-[210px]">
                Financial District, SF (37.793, -122.399)
              </span>
            </div>
            <button
              onClick={handleSyncGps}
              className="p-1 text-[#565e74] hover:text-[#0b1c30] hover:bg-[#e5eeff] rounded-full transition-colors relative"
              title="Refresh GPS Coordinates"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">sync</span>
              {showLocationToast && (
                <span className="absolute top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#0b1c30] text-white text-[11px] font-medium px-2 py-1 rounded shadow-lg z-50">
                  GPS Centered
                </span>
              )}
            </button>
          </div>

          {/* User's Model Y State Pill */}
          <button
            onClick={() => setActiveTab('activity-and-sessions')}
            className="hidden 2xl:flex items-center gap-space-xs bg-[#63fcc0]/20 border border-[#3fdfa5]/40 px-3 py-1.5 rounded-full hover:bg-[#63fcc0]/30 transition-colors"
          >
            <span className="material-symbols-outlined text-[#006c4b] text-[18px]">electric_car</span>
            <span className="font-label-md text-label-md text-[#005138]">My Model Y:</span>
            <span className="font-label-md text-label-md text-[#006c4b] font-bold">38% (112 mi)</span>
          </button>
        </div>

        {/* Center: Navigation Bar */}
        <nav className="hidden lg:flex items-center gap-1.5 bg-[#eff4ff] p-1.5 rounded-full">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-4 py-2 rounded-full transition-all flex items-center gap-1.5 font-label-lg text-label-lg ${
                  isActive
                    ? 'bg-[#00c48c] text-[#004a33] font-bold shadow-[0_2px_10px_rgba(0,196,140,0.2)]'
                    : 'text-[#3c4a42] hover:text-[#0b1c30] hover:bg-[#e5eeff]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right: Search, Filter, Notifications & Profile */}
        <div className="flex items-center gap-space-sm shrink-0">
          {/* Quick Search */}
          <button
            onClick={onOpenSearch}
            className="hidden md:flex items-center gap-2 bg-[#eff4ff] px-3.5 py-1.5 rounded-full border border-[#bbcac0]/30 text-[#3c4a42] hover:border-[#00c48c] transition-colors w-60 lg:w-64 text-left"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px] text-[#565e74]">search</span>
            <span className="font-body-sm text-body-sm text-[#565e74] truncate flex-1">
              Search city, zip, station...
            </span>
            <kbd className="font-label-sm text-label-sm bg-[#e5eeff] px-1.5 py-0.5 rounded text-[#565e74] border border-[#bbcac0]/40">
              ⌘K
            </kbd>
          </button>

          {/* Plug Filter Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowPlugFilter(!showPlugFilter)}
              className="hidden sm:flex items-center gap-1.5 bg-[#eff4ff] hover:bg-[#e5eeff] px-3 py-1.5 rounded-full text-[#0b1c30] font-label-md text-label-md transition-colors"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px] text-[#006c4b]">bolt</span>
              <span>Plug Filter</span>
              <span className="material-symbols-outlined text-[16px] text-[#565e74]">
                {showPlugFilter ? 'expand_less' : 'expand_more'}
              </span>
            </button>

            {showPlugFilter && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl p-3 border border-[#bbcac0]/30 z-50 flex flex-col gap-2">
                <span className="font-label-sm text-label-sm uppercase font-bold text-[#565e74] px-1">
                  Connector Types
                </span>
                {plugOptions.map((plug) => {
                  const isChecked = selectedPlugs.includes(plug);
                  return (
                    <label
                      key={plug}
                      className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-[#eff4ff] cursor-pointer text-sm text-[#0b1c30]"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => onTogglePlug(plug)}
                        className="rounded text-[#006c4b] accent-[#006c4b] w-4 h-4"
                      />
                      <span>{plug}</span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-[#3c4a42] hover:text-[#0b1c30] hover:bg-[#eff4ff] rounded-full transition-colors"
              type="button"
            >
              <span className="material-symbols-outlined text-[22px]">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#ba1a1a] text-white font-label-sm text-[10px] rounded-full flex items-center justify-center font-bold">
                1
              </span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl p-4 border border-[#bbcac0]/30 z-50 flex flex-col gap-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#bbcac0]/20">
                  <span className="font-title-md text-title-md text-[#0b1c30]">Notifications</span>
                  <span className="font-label-sm text-label-sm bg-[#63fcc0]/30 text-[#005138] px-2 py-0.5 rounded-full font-bold">
                    1 New
                  </span>
                </div>
                <div className="flex items-start gap-2.5 p-2 rounded-xl bg-[#eff4ff]">
                  <span className="material-symbols-outlined text-[#006c4b] text-[20px] shrink-0 mt-0.5">
                    electric_meter
                  </span>
                  <div className="flex flex-col">
                    <span className="font-label-md text-label-md font-bold text-[#0b1c30]">
                      Green Grid Off-Peak Rate Active
                    </span>
                    <span className="font-body-sm text-body-sm text-[#565e74]">
                      CAISO wind share 64%. Extra $0.05/kWh off across SF downtown hubs.
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-[#f8f9ff]">
                  <span className="material-symbols-outlined text-[#494bd6] text-[20px] shrink-0 mt-0.5">
                    lock_clock
                  </span>
                  <div className="flex flex-col">
                    <span className="font-label-md text-label-md font-semibold text-[#0b1c30]">
                      Stall Reservation Ready
                    </span>
                    <span className="font-body-sm text-body-sm text-[#565e74]">
                      Stall A1 at Embarcadero Plaza is primed for your arrival.
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 pl-1 cursor-pointer"
            >
              <img
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-[#00c48c]/40"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAu3-0Le_GhH4tbTjLVvgMX5qWYbwp6fd6yBW7yjvC_AKYvOiXHybigJvrVTOk2m8yb5GvDnQGV6Z7rL3frugCtwv3q1RiPZMcnqd-50jAJ0jPxtbhCI-Es-q57gh4XkAUX28NVMTFnZdTG6SHnwevbcq09vTKwigzYAzrv5mLt0M1AXU75prby8PGe8myh5fUWoE0_KTuyF6RNIkCtb1q4XM6dd_k0fEfhGbWcx-KjMlRPAamtWfqBXw"
              />
              <div className="hidden sm:flex items-center gap-1 text-[#0b1c30]">
                <span className="font-label-md text-label-md font-medium">Alex M.</span>
                <span className="material-symbols-outlined text-[16px] text-[#565e74]">
                  expand_more
                </span>
              </div>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl p-3 border border-[#bbcac0]/30 z-50 flex flex-col gap-2">
                <div className="p-2 border-b border-[#bbcac0]/20 flex items-center gap-2">
                  <div className="flex flex-col">
                    <span className="font-label-lg text-label-lg text-[#0b1c30] font-bold">
                      Alexander Mercer
                    </span>
                    <span className="font-body-sm text-body-sm text-[#565e74]">
                      alex.mercer@voltpoint.io
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setActiveTab('activity-and-sessions');
                    setShowProfileMenu(false);
                  }}
                  className="flex items-center gap-2 p-2 rounded-xl text-left hover:bg-[#eff4ff] text-[#0b1c30] font-label-md text-label-md"
                >
                  <span className="material-symbols-outlined text-[18px] text-[#006c4b]">credit_card</span>
                  <span>VoltPoint Priority Pass</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('trip-planner');
                    setShowProfileMenu(false);
                  }}
                  className="flex items-center gap-2 p-2 rounded-xl text-left hover:bg-[#eff4ff] text-[#0b1c30] font-label-md text-label-md"
                >
                  <span className="material-symbols-outlined text-[18px] text-[#494bd6]">alt_route</span>
                  <span>Trip History & Planner</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Tab Navigation Bar */}
      <div className="lg:hidden flex items-center justify-around border-t border-[#bbcac0]/20 bg-[#eff4ff] px-2 py-1.5 overflow-x-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${
              activeTab === item.id
                ? 'bg-[#00c48c] text-[#004a33]'
                : 'text-[#565e74]'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
};
