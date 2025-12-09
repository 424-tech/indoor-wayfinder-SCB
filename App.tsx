import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { POI, Point, Instruction } from './types';
import { MAP_DATA } from './constants';
import MapView from './components/MapView';
import ControlPanel from './components/ControlPanel';
import { findPath, createWalkableGrids, generateInstructions } from './services/pathfinding';

function App() {
  const [startPoiId, setStartPoiId] = useState<string | null>(null);
  const [endPoiId, setEndPoiId] = useState<string | null>(null);
  const [path, setPath] = useState<Point[] | null>(null);
  const [isPathfinding, setIsPathfinding] = useState(false);
  const [distanceTraveled, setDistanceTraveled] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [instructions, setInstructions] = useState<Instruction[]>([]);
  const [activeFloorId, setActiveFloorId] = useState('floor-1');

  // Animation state
  const [currentPosition, setCurrentPosition] = useState<Point | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationFrameRef = useRef<number>();

  // Flatten POIs from all floors for the ControlPanel
  const allPois = useMemo(() => {
    return MAP_DATA.floors.flatMap(f => f.pois);
  }, []);

  // Pre-calculate walkable grids for all floors
  const walkableGrids = useMemo(() => createWalkableGrids(MAP_DATA), []);

  const handleStartChange = (id: string) => {
    setStartPoiId(id);
    setPath(null);
    setInstructions([]);
    setDistanceTraveled(0);
    setCurrentPosition(null);

    // Switch to the floor of the selected POI
    const poi = allPois.find(p => p.id === id);
    if (poi) setActiveFloorId(poi.floorId);
  };

  const handleEndChange = (id: string) => {
    setEndPoiId(id);
    setPath(null);
    setInstructions([]);
    setDistanceTraveled(0);
  };

  const handleFindPath = useCallback(() => {
    if (!startPoiId || !endPoiId) return;

    setIsPathfinding(true);
    // Simulate calculation delay for UX
    setTimeout(() => {
      const startPoi = allPois.find((p) => p.id === startPoiId);
      const endPoi = allPois.find((p) => p.id === endPoiId);

      if (startPoi && endPoi) {
        // Updated findPath signature
        const foundPath = findPath(startPoi.position, endPoi.position, MAP_DATA, walkableGrids);
        setPath(foundPath);
        if (foundPath) {
          setInstructions(generateInstructions(foundPath, MAP_DATA));
          // Ensure we are viewing the start floor
          setActiveFloorId(startPoi.position.floorId || 'floor-1');

          // Start Animation Logic
          setCurrentPosition(foundPath[0]);
          setIsAnimating(true);
          setDistanceTraveled(0);
        } else {
          alert('No path found! Are the points connected?');
        }
      }
      setIsPathfinding(false);
    }, 500);
  }, [startPoiId, endPoiId, allPois, walkableGrids]);

  const handleStepForward = () => {
    // Manual Step logic
    if (!path) return;
    const STEP = 20;
    setDistanceTraveled(prev => {
      const next = Math.min(prev + STEP, path.length * 10); // Rough approximation
      return next;
    });
  };

  const handleStepBackward = () => {
    setDistanceTraveled(prev => Math.max(prev - 20, 0));
  };

  // Update position based on distanceTraveled (Simplified for demo)
  useEffect(() => {
    if (path && distanceTraveled >= 0) {
      // Naive interpolation: treating path array index as distance unit roughly
      const index = Math.min(Math.floor(distanceTraveled / 10), path.length - 1);
      if (path[index]) {
        setCurrentPosition(path[index]);
        setActiveFloorId(path[index].floorId || activeFloorId);
      }
    }
  }, [distanceTraveled, path, activeFloorId]);


  const startPoi = allPois.find((p) => p.id === startPoiId) || null;
  const endPoi = allPois.find((p) => p.id === endPoiId) || null;

  // Filter POIs for search
  const filteredPois = allPois.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50 overflow-hidden text-gray-900 font-sans">
      {/* Sidebar / Control Panel - Order 2 on mobile (bottom), Order 1 on desktop (left) */}
      <div className="w-full md:w-96 h-[45vh] md:h-full bg-white shadow-xl z-20 flex flex-col border-r border-gray-200 order-2 md:order-1">
        <div className="p-4 md:p-6 bg-blue-600 text-white shrink-0">
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">SCB Wayfinder</h1>
          <p className="text-blue-100 text-xs md:text-sm mt-1">SCB Medical Indoor Navigation</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          <ControlPanel
            pois={filteredPois}
            startPoiId={startPoiId}
            endPoiId={endPoiId}
            onStartChange={handleStartChange}
            onEndChange={handleEndChange}
            onFindPath={handleFindPath}
            isPathfinding={isPathfinding}
            path={path}
            instructions={instructions}
            distanceTraveled={distanceTraveled}
            totalPathLength={path ? path.length * 10 : 0} // Rough estimate
            onStepForward={handleStepForward}
            onStepBackward={handleStepBackward}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </div>

        <div className="p-2 md:p-4 border-t border-gray-200 bg-gray-50 text-xs text-gray-500 text-center shrink-0">
          &copy; 2025 SCB Medical
        </div>
      </div>

      {/* Main Map Area - Order 1 on mobile (top), Order 2 on desktop (right) */}
      <div className="flex-1 relative bg-gray-100 h-full order-1 md:order-2">
        <MapView
          mapData={MAP_DATA}
          startPoi={startPoi}
          endPoi={endPoi}
          path={path}
          onPoiClick={(poi) => {
            if (!startPoiId) handleStartChange(poi.id);
            else handleEndChange(poi.id);
          }}
          activeFloorId={activeFloorId}
          onFloorChange={setActiveFloorId}
          currentPosition={currentPosition}
        />
      </div>
    </div>
  );
}

export default App;
