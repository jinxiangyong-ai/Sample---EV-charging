import React, { useState, useEffect } from 'react';
import { TabType, EVStation } from './types';
import { STATIONS_DATA } from './data/mockData';
import { Header } from './components/Header';
import { FindChargersScreen } from './components/FindChargersScreen';
import { StationDetailsScreen } from './components/StationDetailsScreen';
import { TripPlannerScreen } from './components/TripPlannerScreen';
import { ActivitySessionsScreen } from './components/ActivitySessionsScreen';
import { Footer } from './components/Footer';
import { SearchModal } from './components/SearchModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('find-chargers');
  const [stations] = useState<EVStation[]>(STATIONS_DATA);
  const [selectedStation, setSelectedStation] = useState<EVStation>(STATIONS_DATA[0]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedPlugs, setSelectedPlugs] = useState<string[]>(['CCS Combo 1', 'NACS (Tesla)']);

  // Handle global ⌘K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleTogglePlug = (plug: string) => {
    setSelectedPlugs((prev) =>
      prev.includes(plug) ? prev.filter((p) => p !== plug) : [...prev, plug]
    );
  };

  const handleSelectStation = (station: EVStation) => {
    setSelectedStation(station);
  };

  const handleViewStationDetails = (stationId: string) => {
    const found = stations.find((s) => s.id === stationId);
    if (found) {
      setSelectedStation(found);
    }
    setActiveTab('station-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9ff] text-[#0b1c30]">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSearch={() => setIsSearchOpen(true)}
        selectedPlugs={selectedPlugs}
        onTogglePlug={handleTogglePlug}
        onSelectStation={handleViewStationDetails}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full pt-20">
        {activeTab === 'find-chargers' && (
          <FindChargersScreen
            stations={stations}
            selectedStation={selectedStation}
            onSelectStation={handleSelectStation}
            onViewStationDetails={handleViewStationDetails}
          />
        )}

        {activeTab === 'station-details' && (
          <StationDetailsScreen
            station={selectedStation}
            onNavigateBack={() => setActiveTab('find-chargers')}
            onOpenTripPlanner={() => setActiveTab('trip-planner')}
          />
        )}

        {activeTab === 'trip-planner' && (
          <TripPlannerScreen
            onOpenStationDetails={(stId) => handleViewStationDetails(stId)}
          />
        )}

        {activeTab === 'activity-and-sessions' && (
          <ActivitySessionsScreen
            onOpenStationDetails={(stId) => handleViewStationDetails(stId)}
            onOpenNetworkMap={() => setActiveTab('find-chargers')}
          />
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* ⌘K Search Command Palette */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        stations={stations}
        onSelectStation={(st) => {
          setSelectedStation(st);
          setActiveTab('station-details');
        }}
        onNavigateTab={(tab) => setActiveTab(tab)}
      />
    </div>
  );
}
