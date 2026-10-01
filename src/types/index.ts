export type TabType = 'find-chargers' | 'station-details' | 'trip-planner' | 'activity-and-sessions';

export interface StationStall {
  id: string;
  bay: string;
  plugType: 'CCS' | 'NACS';
  powerKw: number;
  voltage: string;
  cableType?: string;
  status: 'AVAILABLE' | 'IN_USE' | 'SERVICE';
  dispensingKw?: number;
  currentSoc?: number;
  remainingMin?: number;
  vehicle?: string;
  offlineReason?: string;
  estimatedFreeTime?: string;
  pricePerKwh?: number;
  isAutocharge?: boolean;
}

export interface EVStation {
  id: string;
  stationCode: string;
  name: string;
  network: string;
  address: string;
  crossStreet: string;
  distance: string;
  driveTime: string;
  speedKw: number;
  architecture: string;
  connectorsSummary: string;
  availableStalls: number;
  totalStalls: number;
  pricePerKwh: number;
  priceNote: string;
  amenities: string[];
  isUltra?: boolean;
  isOpen247?: boolean;
  verified?: boolean;
  rating: number;
  reviewCount: number;
  approachNote: string;
  mapCoords: { x: number; y: number };
  imageUrl: string;
  secondaryImageUrl?: string;
  stalls: StationStall[];
}

export interface ReviewItem {
  id: string;
  author: string;
  car: string;
  avatar: string;
  avatarBg: string;
  timeAgo: string;
  rating: number;
  badge: string;
  stallUsed?: string;
  comment: string;
}

export interface ChargingSessionRecord {
  id: string;
  stationName: string;
  networkBadge: string;
  powerKw: number;
  date: string;
  stall: string;
  energyKwh: number;
  durationMin: number;
  cost: number;
  type: 'VoltPoint' | 'Roaming' | 'Home Level 2';
}

export interface FavoriteHub {
  id: string;
  name: string;
  location: string;
  distance: string;
  openStalls: string;
  specs: string;
  icon: string;
  isFull?: boolean;
}
