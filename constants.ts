import { MapData, POIType } from './types';

// Level 1: Medical Services & Labs
const FLOOR_1_POIS = [
  { id: 'main-entrance', name: 'Main Entrance', position: { x: 400, y: 1100, floorId: 'floor-1' }, type: POIType.ENTRANCE, floorId: 'floor-1' },
  { id: 'emergency-west', name: 'Emergency', position: { x: 230, y: 250, floorId: 'floor-1' }, type: POIType.DEPARTMENT, floorId: 'floor-1' },
  { id: 'outpatient', name: 'Outpatient', position: { x: 450, y: 150, floorId: 'floor-1' }, type: POIType.DEPARTMENT, floorId: 'floor-1' },
  { id: 'pharmacy-west', name: 'Pharmacy', position: { x: 400, y: 900, floorId: 'floor-1' }, type: POIType.PHARMACY, floorId: 'floor-1' },

  // New Labs
  { id: 'blood-lab', name: 'Blood Lab', position: { x: 1050, y: 450, floorId: 'floor-1' }, type: POIType.DEPARTMENT, floorId: 'floor-1' },
  { id: 'ct-scan', name: 'CT Scan', position: { x: 750, y: 800, floorId: 'floor-1' }, type: POIType.DEPARTMENT, floorId: 'floor-1' },
  { id: 'ultrasound', name: 'Ultrasound', position: { x: 650, y: 800, floorId: 'floor-1' }, type: POIType.DEPARTMENT, floorId: 'floor-1' },
  { id: 'radiology', name: 'Radiology', position: { x: 580, y: 800, floorId: 'floor-1' }, type: POIType.DEPARTMENT, floorId: 'floor-1' },

  { id: 'wards-center', name: 'Wards', position: { x: 1050, y: 650, floorId: 'floor-1' }, type: POIType.WARDS, floorId: 'floor-1' },
  { id: 'operating-theatres', name: 'Operating Theatres', position: { x: 1500, y: 450, floorId: 'floor-1' }, type: POIType.THEATRE, floorId: 'floor-1' },
  { id: 'icu-cctu', name: 'ICU/CCTU', position: { x: 150, y: 450, floorId: 'floor-1' }, type: POIType.DEPARTMENT, floorId: 'floor-1' },
  { id: 'lobbies', name: 'Lobbies', position: { x: 450, y: 450, floorId: 'floor-1' }, type: POIType.DEPARTMENT, floorId: 'floor-1' },

  { id: 'elevator-lobby-1', name: 'Central Elevators', position: { x: 800, y: 500, floorId: 'floor-1' }, type: POIType.ELEVATOR, floorId: 'floor-1' },
  { id: 'stairs-west-1', name: 'West Stairs', position: { x: 200, y: 500, floorId: 'floor-1' }, type: POIType.STAIRS, floorId: 'floor-1' },
  { id: 'stairs-east-1', name: 'East Stairs', position: { x: 1750, y: 500, floorId: 'floor-1' }, type: POIType.STAIRS, floorId: 'floor-1' }, // Added East stairs for connectivity

  // Amenities
  { id: 'restroom-west', name: 'Restroom', position: { x: 520, y: 580, floorId: 'floor-1' }, type: POIType.RESTROOM, floorId: 'floor-1' },
  { id: 'restroom-center', name: 'Restroom', position: { x: 920, y: 680, floorId: 'floor-1' }, type: POIType.RESTROOM, floorId: 'floor-1' },
  { id: 'cafe', name: 'Cafe', position: { x: 600, y: 920, floorId: 'floor-1' }, type: POIType.CAFE, floorId: 'floor-1' },
  { id: 'info-desk', name: 'Information Desk', position: { x: 500, y: 1050, floorId: 'floor-1' }, type: POIType.INFO, floorId: 'floor-1' },
];

const FLOOR_1_WALLS = [
  // Outer Boundary
  { start: { x: 0, y: 0 }, end: { x: 2400, y: 0 } },
  { start: { x: 2400, y: 0 }, end: { x: 2400, y: 1600 } },
  { start: { x: 2400, y: 1600 }, end: { x: 0, y: 1600 } },
  { start: { x: 0, y: 1600 }, end: { x: 0, y: 0 } },

  // --- Left Wing ---
  // Outer Walls
  { start: { x: 50, y: 150 }, end: { x: 50, y: 550 } },
  { start: { x: 50, y: 150 }, end: { x: 350, y: 150 } },
  { start: { x: 350, y: 150 }, end: { x: 350, y: 100 } },
  { start: { x: 350, y: 100 }, end: { x: 650, y: 100 } },

  // ICU/CCTU Block
  { start: { x: 50, y: 350 }, end: { x: 300, y: 350 } },
  { start: { x: 300, y: 350 }, end: { x: 300, y: 420 } },
  { start: { x: 300, y: 480 }, end: { x: 300, y: 550 } },
  { start: { x: 50, y: 550 }, end: { x: 300, y: 550 } },

  // Emergency West
  { start: { x: 50, y: 300 }, end: { x: 200, y: 300 } },
  { start: { x: 260, y: 300 }, end: { x: 350, y: 300 } },
  { start: { x: 350, y: 150 }, end: { x: 350, y: 300 } },

  // Outpatient Block (FIXED CONNECTIVITY)
  // Opened a gap at 420-480 in the bottom wall
  { start: { x: 350, y: 220 }, end: { x: 420, y: 220 } },
  { start: { x: 480, y: 220 }, end: { x: 550, y: 220 } }, // Split segment
  { start: { x: 550, y: 220 }, end: { x: 650, y: 220 } }, // Rest of segment

  { start: { x: 650, y: 100 }, end: { x: 650, y: 300 } },
  { start: { x: 550, y: 100 }, end: { x: 550, y: 220 } },
  { start: { x: 350, y: 300 }, end: { x: 450, y: 300 } },
  { start: { x: 510, y: 300 }, end: { x: 650, y: 300 } },

  // Lobbies / Offices Block
  { start: { x: 300, y: 400 }, end: { x: 300, y: 800 } },
  { start: { x: 300, y: 400 }, end: { x: 650, y: 400 } },
  { start: { x: 650, y: 400 }, end: { x: 650, y: 600 } },
  { start: { x: 300, y: 600 }, end: { x: 450, y: 600 } },
  { start: { x: 500, y: 600 }, end: { x: 650, y: 600 } },
  { start: { x: 300, y: 800 }, end: { x: 550, y: 800 } },

  // Pharmacy West Block
  { start: { x: 300, y: 850 }, end: { x: 300, y: 950 } },
  { start: { x: 300, y: 950 }, end: { x: 500, y: 950 } },
  { start: { x: 500, y: 850 }, end: { x: 500, y: 950 } },
  { start: { x: 300, y: 850 }, end: { x: 380, y: 850 } },
  { start: { x: 440, y: 850 }, end: { x: 500, y: 850 } },

  // --- Center Wing & Connector ---
  { start: { x: 650, y: 350 }, end: { x: 900, y: 350 } },
  { start: { x: 650, y: 600 }, end: { x: 700, y: 600 } },
  { start: { x: 700, y: 600 }, end: { x: 700, y: 700 } },
  { start: { x: 700, y: 700 }, end: { x: 900, y: 700 } },
  { start: { x: 900, y: 350 }, end: { x: 900, y: 700 } },

  // Central Elevator Block
  { start: { x: 700, y: 425 }, end: { x: 850, y: 425 } },
  { start: { x: 700, y: 575 }, end: { x: 850, y: 575 } },
  // Open Left Wall (Doorway)
  { start: { x: 700, y: 425 }, end: { x: 700, y: 450 } },
  { start: { x: 700, y: 550 }, end: { x: 700, y: 575 } },
  // Right Wall
  { start: { x: 850, y: 425 }, end: { x: 850, y: 575 } },

  // Labs Block (Radiology, CT, Ultrasound)
  { start: { x: 550, y: 750 }, end: { x: 550, y: 850 } },
  { start: { x: 550, y: 850 }, end: { x: 850, y: 850 } },
  { start: { x: 850, y: 750 }, end: { x: 850, y: 850 } },
  { start: { x: 550, y: 750 }, end: { x: 650, y: 750 } },
  { start: { x: 750, y: 750 }, end: { x: 850, y: 750 } },

  // --- Right Wing ---
  // Outer Walls
  { start: { x: 900, y: 300 }, end: { x: 1200, y: 300 } },
  { start: { x: 1200, y: 100 }, end: { x: 1200, y: 300 } },
  { start: { x: 1200, y: 100 }, end: { x: 1750, y: 100 } },
  { start: { x: 1750, y: 100 }, end: { x: 1750, y: 350 } },
  { start: { x: 1500, y: 350 }, end: { x: 1750, y: 350 } },
  { start: { x: 900, y: 850 }, end: { x: 1250, y: 850 } },
  { start: { x: 1250, y: 850 }, end: { x: 1250, y: 1000 } },
  { start: { x: 1250, y: 1000 }, end: { x: 1800, y: 1000 } },
  { start: { x: 1800, y: 750 }, end: { x: 1800, y: 1000 } },
  { start: { x: 1550, y: 850 }, end: { x: 1800, y: 850 } },

  // Blood Lab (Center East)
  { start: { x: 900, y: 600 }, end: { x: 1200, y: 600 } },
  { start: { x: 1200, y: 300 }, end: { x: 1200, y: 850 } },

  // Operating Theatre Block
  { start: { x: 1200, y: 400 }, end: { x: 1400, y: 400 } },
  { start: { x: 1200, y: 550 }, end: { x: 1400, y: 550 } },
  { start: { x: 1450, y: 350 }, end: { x: 1450, y: 420 } },
  { start: { x: 1450, y: 480 }, end: { x: 1450, y: 650 } },
  { start: { x: 1450, y: 650 }, end: { x: 1750, y: 650 } },
  { start: { x: 1750, y: 550 }, end: { x: 1750, y: 650 } },
].map(w => ({ ...w, floorId: 'floor-1' }));


// Level 2 - Administration
const FLOOR_2_POIS = [
  { id: 'elevator-lobby-2', name: 'Central Elevators', position: { x: 800, y: 500, floorId: 'floor-2' }, type: POIType.ELEVATOR, floorId: 'floor-2' },
  { id: 'stairs-west-2', name: 'West Stairs', position: { x: 200, y: 500, floorId: 'floor-2' }, type: POIType.STAIRS, floorId: 'floor-2' },
  { id: 'stairs-east-2', name: 'East Stairs', position: { x: 1750, y: 500, floorId: 'floor-2' }, type: POIType.STAIRS, floorId: 'floor-2' },

  { id: 'hr-dept', name: 'Human Resources', position: { x: 400, y: 400, floorId: 'floor-2' }, type: POIType.DEPARTMENT, floorId: 'floor-2' },
  { id: 'finance-dept', name: 'Finance Dept', position: { x: 1100, y: 400, floorId: 'floor-2' }, type: POIType.DEPARTMENT, floorId: 'floor-2' },
  { id: 'director-office', name: 'Director Office', position: { x: 1600, y: 700, floorId: 'floor-2' }, type: POIType.DEPARTMENT, floorId: 'floor-2' },
  { id: 'conference-a', name: 'Conference Room A', position: { x: 250, y: 600, floorId: 'floor-2' }, type: POIType.DEPARTMENT, floorId: 'floor-2' },
  { id: 'it-support', name: 'IT Support', position: { x: 1100, y: 800, floorId: 'floor-2' }, type: POIType.DEPARTMENT, floorId: 'floor-2' },
];

const FLOOR_2_WALLS = [
  // Outer Boundary
  { start: { x: 0, y: 0 }, end: { x: 2400, y: 0 } },
  { start: { x: 2400, y: 0 }, end: { x: 2400, y: 1600 } },
  { start: { x: 2400, y: 1600 }, end: { x: 0, y: 1600 } },
  { start: { x: 0, y: 1600 }, end: { x: 0, y: 0 } },

  // Outer Shell
  { start: { x: 50, y: 150 }, end: { x: 50, y: 550 } },
  { start: { x: 50, y: 150 }, end: { x: 1750, y: 150 } },
  { start: { x: 1750, y: 150 }, end: { x: 1750, y: 1000 } },
  { start: { x: 1750, y: 1000 }, end: { x: 50, y: 1000 } },
  { start: { x: 50, y: 1000 }, end: { x: 50, y: 550 } },

  // Central Elevators
  { start: { x: 700, y: 425 }, end: { x: 850, y: 425 } },
  { start: { x: 700, y: 575 }, end: { x: 850, y: 575 } },
  { start: { x: 700, y: 425 }, end: { x: 700, y: 575 } },
  { start: { x: 850, y: 425 }, end: { x: 850, y: 575 } },

  // Partitions
  { start: { x: 600, y: 150 }, end: { x: 600, y: 1000 } }, // Big divider
  { start: { x: 1200, y: 150 }, end: { x: 1200, y: 1000 } }, // Big divider 2

  // Conference A Enclosure
  { start: { x: 50, y: 700 }, end: { x: 400, y: 700 } },
].map(w => ({ ...w, floorId: 'floor-2' }));


// Level 3 - Executive / Labs
const FLOOR_3_POIS = [
  { id: 'elevator-lobby-3', name: 'Central Elevators (L3)', position: { x: 800, y: 500, floorId: 'floor-3' }, type: POIType.ELEVATOR, floorId: 'floor-3' },
  { id: 'elevator-room-3', name: 'East Elevators (L3)', position: { x: 1300, y: 150, floorId: 'floor-3' }, type: POIType.ELEVATOR, floorId: 'floor-3' },

  { id: 'executive-office', name: 'Executive Office', position: { x: 300, y: 300, floorId: 'floor-3' }, type: POIType.DEPARTMENT, floorId: 'floor-3' },
  { id: 'research-lab', name: 'Research Lab', position: { x: 1400, y: 500, floorId: 'floor-3' }, type: POIType.DEPARTMENT, floorId: 'floor-3' },
  { id: 'roof-garden', name: 'Roof Garden', position: { x: 900, y: 800, floorId: 'floor-3' }, type: POIType.CAFE, floorId: 'floor-3' },
];

const FLOOR_3_WALLS = [
  // Outer Boundary
  { start: { x: 0, y: 0 }, end: { x: 2400, y: 0 } },
  { start: { x: 2400, y: 0 }, end: { x: 2400, y: 1600 } },
  { start: { x: 2400, y: 1600 }, end: { x: 0, y: 1600 } },
  { start: { x: 0, y: 1600 }, end: { x: 0, y: 0 } },

  // Smaller footprint for top floor
  { start: { x: 200, y: 200 }, end: { x: 1600, y: 200 } },
  { start: { x: 1600, y: 200 }, end: { x: 1600, y: 900 } },
  { start: { x: 1600, y: 900 }, end: { x: 200, y: 900 } },
  { start: { x: 200, y: 900 }, end: { x: 200, y: 200 } },

  // Central Elevators
  { start: { x: 700, y: 425 }, end: { x: 850, y: 425 } },
  { start: { x: 700, y: 575 }, end: { x: 850, y: 575 } },
  { start: { x: 700, y: 425 }, end: { x: 700, y: 575 } },
  { start: { x: 850, y: 425 }, end: { x: 850, y: 575 } },
].map(w => ({ ...w, floorId: 'floor-3' }));


export const MAP_DATA: MapData = {
  width: 2400,
  height: 1600,
  gridResolution: 10,
  floors: [
    {
      id: 'floor-1',
      name: 'Level 1',
      level: 1,
      pois: FLOOR_1_POIS,
      walls: FLOOR_1_WALLS
    },
    {
      id: 'floor-2',
      name: 'Level 2',
      level: 2,
      pois: FLOOR_2_POIS,
      walls: FLOOR_2_WALLS
    },
    {
      id: 'floor-3',
      name: 'Level 3',
      level: 3,
      pois: FLOOR_3_POIS,
      walls: FLOOR_3_WALLS
    }
  ]
};
