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
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isAccessible, setIsAccessible] = useState(false);

  // Animation state
  const [currentPosition, setCurrentPosition] = useState<Point | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationFrameRef = useRef<number | null>(null);

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
        const foundPath = findPath(startPoi.position, endPoi.position, MAP_DATA, walkableGrids, isAccessible);
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
  }, [startPoiId, endPoiId, allPois, walkableGrids, isAccessible]);

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

  // Auto-walk animation loop
  useEffect(() => {
    if (!isAnimating || !path) return;

    const totalLength = path.length * 10;
    const SPEED = 1.5; // Units per frame (~90 units per second at 60fps)
    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      setDistanceTraveled(prev => {
        const next = prev + SPEED * (deltaTime / 16.67); // Normalize to ~60fps
        if (next >= totalLength) {
          setIsAnimating(false);
          return totalLength;
        }
        return next;
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isAnimating, path]);

  // Toggle play/pause
  const handlePlayPause = () => {
    if (!path) return;
    if (distanceTraveled >= path.length * 10) {
      // Reset to start if at end
      setDistanceTraveled(0);
    }
    setIsAnimating(prev => !prev);
  };


  const startPoi = allPois.find((p) => p.id === startPoiId) || null;
  const endPoi = allPois.find((p) => p.id === endPoiId) || null;



  // Filter POIs for search
  const filteredPois = allPois.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-gray-900 text-white font-sans selection:bg-indigo-500 selection:text-white">

      {/* 2. Map Background - Full Screen with Safe Area for Sidebar */}
      <div className={`absolute inset-0 z-0 transition-all duration-500 ease-in-out ${isSidebarOpen ? 'md:pl-[400px]' : 'pl-0'}`}>
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

      {/* Re-open Button (Visible when closed) */}
      <button
        onClick={() => setSidebarOpen(true)}
        className={`absolute top-6 left-6 z-10 glass-button p-3 rounded-full shadow-lg transition-all duration-300 ${!isSidebarOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10 pointer-events-none'}`}
        aria-label="Open Menu"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>

      {/* 3. Floating Glass Panel - Left Side */}
      <div className={`absolute top-4 left-4 bottom-4 w-full md:w-[400px] z-20 flex flex-col pointer-events-none transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${isSidebarOpen ? 'translate-x-0' : '-translate-x-[120%]'}`}>

        <div className="glass-panel text-white rounded-2xl flex flex-col h-full shadow-2xl overflow-hidden pointer-events-auto mx-2 md:mx-0 animate-fade-in relative">

          {/* Header */}
          <div className="p-6 pb-4 border-b border-white/10 shrink-0 bg-gradient-to-r from-indigo-900/50 to-purple-900/50 flex justify-between items-start">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
                    <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-white drop-shadow-md">SCB Wayfinder</h1>
              </div>
              <p className="text-white/60 text-sm pl-10 font-medium">Medical Indoor Navigation System</p>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-full hover:bg-white/10 transition-colors text-white/70 hover:text-white"
              aria-label="Close Menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
          </div>

          {/* Scrollable Content */}
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
              totalPathLength={path ? path.length * 10 : 0}
              onStepForward={handleStepForward}
              onStepBackward={handleStepBackward}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              isAccessible={isAccessible}
              onAccessibleChange={setIsAccessible}
              isAnimating={isAnimating}
              onPlayPause={handlePlayPause}
            />
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-white/10 text-[10px] text-white/40 text-center shrink-0 uppercase tracking-widest bg-black/20">
            &copy; 2025 SCB Medical Center
          </div>
        </div>
      </div>

    </div>
  );
}

export default App;
