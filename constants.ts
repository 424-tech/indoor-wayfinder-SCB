import { MapData, POIType } from './types';

export const MAP_DATA: MapData = {
  width: 2000,
  height: 1200,
  gridResolution: 10,
  pois: [
    { id: 'main-entrance', name: 'Main Entrance', position: { x: 400, y: 1100 }, type: POIType.ENTRANCE },
    { id: 'emergency-west', name: 'Emergency (West)', position: { x: 230, y: 250 }, type: POIType.DEPARTMENT },
    { id: 'outpatient', name: 'Outpatient Room', position: { x: 450, y: 150 }, type: POIType.DEPARTMENT },
    { id: 'pharmacy-west', name: 'Pharmacy (West)', position: { x: 400, y: 900 }, type: POIType.PHARMACY },
    { id: 'radiology', name: 'Radiology', position: { x: 700, y: 800 }, type: POIType.DEPARTMENT },
    { id: 'emergency-center', name: 'Emergency (Center)', position: { x: 1050, y: 450 }, type: POIType.DEPARTMENT },
    { id: 'wards-center', name: 'Wards (Center)', position: { x: 1050, y: 650 }, type: POIType.WARDS },
    { id: 'admin-offices', name: 'Administration Offices', position: { x: 1150, y: 800 }, type: POIType.DEPARTMENT },
    { id: 'operating-theatres', name: 'Operating Theatres', position: { x: 1500, y: 450 }, type: POIType.THEATRE },
    { id: 'pharmacy-east', name: 'Pharmacy (East)', position: { x: 1600, y: 800 }, type: POIType.PHARMACY },
    { id: 'icu-cctu', name: 'ICU/CCTU', position: { x: 150, y: 450 }, type: POIType.DEPARTMENT },
    { id: 'lobbies', name: 'Lobbies', position: { x: 450, y: 450 }, type: POIType.DEPARTMENT },
    { id: 'elevator-lobby', name: 'Elevator Lobby', position: { x: 800, y: 500 }, type: POIType.ELEVATOR },
    { id: 'elevator-room', name: 'Elevator Room', position: { x: 1300, y: 150 }, type: POIType.ELEVATOR },
    // New Amenities
    { id: 'restroom-west', name: 'Restroom', position: { x: 520, y: 580 }, type: POIType.RESTROOM },
    { id: 'restroom-center', name: 'Restroom', position: { x: 920, y: 680 }, type: POIType.RESTROOM },
    { id: 'restroom-east', name: 'Restroom', position: { x: 1730, y: 630 }, type: POIType.RESTROOM },
    { id: 'cafe', name: 'Cafe', position: { x: 600, y: 920 }, type: POIType.CAFE },
    { id: 'info-desk', name: 'Information Desk', position: { x: 500, y: 1050 }, type: POIType.INFO },
  ],
  walls: [
    // --- Left Wing ---
    // Outer Walls
    { start: { x: 50, y: 150 }, end: { x: 50, y: 550 } },
    { start: { x: 50, y: 150 }, end: { x: 350, y: 150 } },
    { start: { x: 350, y: 150 }, end: { x: 350, y: 100 } },
    { start: { x: 350, y: 100 }, end: { x: 650, y: 100 } },
    
    // ICU/CCTU Block
    { start: { x: 50, y: 350 }, end: { x: 300, y: 350 } },
    { start: { x: 300, y: 350 }, end: { x: 300, y: 420 } }, // Door added
    { start: { x: 300, y: 480 }, end: { x: 300, y: 550 } }, // Door added
    { start: { x: 50, y: 550 }, end: { x: 300, y: 550 } },
    
    // Emergency West
    { start: { x: 50, y: 300 }, end: { x: 200, y: 300 } }, // Door added
    { start: { x: 260, y: 300 }, end: { x: 350, y: 300 } }, // Door added
    { start: { x: 350, y: 150 }, end: { x: 350, y: 300 } },

    // Outpatient Block
    { start: { x: 350, y: 220 }, end: { x: 650, y: 220 } },
    { start: { x: 650, y: 100 }, end: { x: 650, y: 300 } },
    { start: { x: 550, y: 100 }, end: { x: 550, y: 220 } },
    { start: { x: 350, y: 300 }, end: { x: 450, y: 300 } }, // Door added
    { start: { x: 510, y: 300 }, end: { x: 650, y: 300 } }, // Door added
    
    // Lobbies / Offices Block
    { start: { x: 300, y: 400 }, end: { x: 300, y: 800 } },
    { start: { x: 300, y: 400 }, end: { x: 650, y: 400 } },
    { start: { x: 650, y: 400 }, end: { x: 650, y: 600 } },
    { start: { x: 300, y: 600 }, end: { x: 450, y: 600 } }, // lobby opening
    { start: { x: 500, y: 600 }, end: { x: 650, y: 600 } },
    { start: { x: 300, y: 800 }, end: { x: 550, y: 800 } },

    // Pharmacy West Block
    { start: { x: 300, y: 850 }, end: { x: 300, y: 950 } },
    { start: { x: 300, y: 950 }, end: { x: 500, y: 950 } },
    { start: { x: 500, y: 850 }, end: { x: 500, y: 950 } },
    { start: { x: 300, y: 850 }, end: { x: 380, y: 850 } }, // Door added
    { start: { x: 440, y: 850 }, end: { x: 500, y: 850 } }, // Door added

    // --- Center Wing & Connector ---
    { start: { x: 650, y: 350 }, end: { x: 900, y: 350 } }, // top connector
    { start: { x: 650, y: 600 }, end: { x: 700, y: 600 } }, // bottom connector start
    { start: { x: 700, y: 600 }, end: { x: 700, y: 700 } },
    { start: { x: 700, y: 700 }, end: { x: 900, y: 700 } }, // bottom connector end
    { start: { x: 900, y: 350 }, end: { x: 900, y: 700 } },

    // Central Elevator Block
    { start: { x: 700, y: 425 }, end: { x: 850, y: 425 } },
    { start: { x: 700, y: 575 }, end: { x: 850, y: 575 } },
    { start: { x: 700, y: 425 }, end: { x: 700, y: 575 } },
    { start: { x: 850, y: 425 }, end: { x: 850, y: 575 } },

    // Radiology & bottom rooms
    { start: { x: 550, y: 750 }, end: { x: 550, y: 850 } },
    { start: { x: 550, y: 850 }, end: { x: 850, y: 850 } },
    { start: { x: 850, y: 750 }, end: { x: 850, y: 850 } },
    { start: { x: 550, y: 750 }, end: { x: 650, y: 750 } }, // Door exists here
    { start: { x: 750, y: 750 }, end: { x: 850, y: 750 } }, // Door exists here
    
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

    // Emergency Central
    { start: { x: 900, y: 600 }, end: { x: 1200, y: 600 } },
    { start: { x: 1200, y: 300 }, end: { x: 1200, y: 850 } },

    // Admin & Right Wards
    { start: { x: 900, y: 750 }, end: { x: 1120, y: 750 } }, // Door added
    { start: { x: 1180, y: 750 }, end: { x: 1200, y: 750 } }, // Door added
    
    // Elevator Room Block
    { start: { x: 1200, y: 220 }, end: { x: 1280, y: 220 } }, // Door added
    { start: { x: 1340, y: 220 }, end: { x: 1450, y: 220 } }, // Door added
    { start: { x: 1450, y: 100 }, end: { x: 1450, y: 220 } },

    // Operating Theatre Block
    { start: { x: 1200, y: 400 }, end: { x: 1400, y: 400 } },
    { start: { x: 1200, y: 550 }, end: { x: 1400, y: 550 } },
    { start: { x: 1450, y: 350 }, end: { x: 1450, y: 420 } }, // Door added
    { start: { x: 1450, y: 480 }, end: { x: 1450, y: 650 } }, // Door added
    { start: { x: 1450, y: 650 }, end: { x: 1750, y: 650 } },
    { start: { x: 1750, y: 550 }, end: { x: 1750, y: 650 } },
    
    // Pharmacy East Block
    { start: { x: 1450, y: 750 }, end: { x: 1570, y: 750 } }, // Door added
    { start: { x: 1630, y: 750 }, end: { x: 1800, y: 750 } }, // Door added
    { start: { x: 1450, y: 750 }, end: { x: 1450, y: 850 } },
  ],
};
