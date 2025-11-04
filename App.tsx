
import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import Map from './components/Map';
import ControlPanel from './components/ControlPanel';
import { MAP_DATA } from './constants';
import { findPath, createWalkableGrid } from './services/pathfinding';
import { Point, POIType } from './types';

const calculatePathLength = (path: Point[]): number => {
  let total = 0;
  for (let i = 0; i < path.length - 1; i++) {
    const p1 = path[i];
    const p2 = path[i + 1];
    total += Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
  }
  return total;
};

const getPointAtDistance = (path: Point[], distance: number): Point | null => {
  if (!path || path.length === 0) return null;
  if (distance <= 0) return path[0];

  let distanceCovered = 0;
  for (let i = 0; i < path.length - 1; i++) {
    const p1 = path[i];
    const p2 = path[i + 1];
    const segmentDistance = Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
    
    if (distanceCovered + segmentDistance >= distance) {
      const fraction = (distance - distanceCovered) / segmentDistance;
      const x = p1.x + fraction * (p2.x - p1.x);
      const y = p1.y + fraction * (p2.y - p1.y);
      return { x, y };
    }
    distanceCovered += segmentDistance;
  }
  return path[path.length - 1];
};

const App: React.FC = () => {
  const [startPoiId, setStartPoiId] = useState<string | null>('main-entrance');
  const [endPoiId, setEndPoiId] = useState<string | null>(null);
  const [path, setPath] = useState<Point[] | null>(null);
  const [isPathfinding, setIsPathfinding] = useState(false);
  const [currentPosition, setCurrentPosition] = useState<Point | null>(null);
  const [distanceTraveled, setDistanceTraveled] = useState(0);
  const [totalPathLength, setTotalPathLength] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedPoiIds, setHighlightedPoiIds] = useState<Set<string>>(new Set());

  const animationFrameRef = useRef<number>();
  const STEP_DISTANCE = 15; // feet

  const walkableGrid = useMemo(() => createWalkableGrid(MAP_DATA), []);

  const startPoi = useMemo(() => MAP_DATA.pois.find(p => p.id === startPoiId), [startPoiId]);
  const endPoi = useMemo(() => MAP_DATA.pois.find(p => p.id === endPoiId), [endPoiId]);

  useEffect(() => {
    const query = searchQuery.toLowerCase();
    if (!query) {
      setHighlightedPoiIds(new Set());
      return;
    }
    const highlighted = new Set<string>();
    MAP_DATA.pois.forEach(poi => {
      const poiName = poi.name.toLowerCase();
      const poiType = poi.type || '';
      if (poiName.includes(query) || poiType.includes(query)) {
        highlighted.add(poi.id);
      }
    });
    setHighlightedPoiIds(highlighted);
  }, [searchQuery]);

  useEffect(() => {
    if (startPoi) {
      setCurrentPosition(startPoi.position);
    }
  }, [startPoi]);

  const resetPath = () => {
    setPath(null);
    setIsAnimating(false);
    setDistanceTraveled(0);
    setTotalPathLength(0);
    if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
    }
  }

  const handleStartChange = (id: string) => {
    setStartPoiId(id);
    const poi = MAP_DATA.pois.find(p => p.id === id);
    if(poi) setCurrentPosition(poi.position);
    resetPath();
  };

  const handleEndChange = (id: string) => {
    setEndPoiId(id);
    resetPath();
  };
  
  const handleFindPath = useCallback(() => {
    if (!startPoi || !endPoi) return;

    setIsPathfinding(true);
    resetPath();
    setCurrentPosition(startPoi.position);

    setTimeout(() => {
      const foundPath = findPath(startPoi.position, endPoi.position, MAP_DATA, walkableGrid);
      setPath(foundPath);
      setIsPathfinding(false);
      if (foundPath && foundPath.length > 0) {
        setTotalPathLength(calculatePathLength(foundPath));
        setIsAnimating(true);
      }
    }, 50);
  }, [startPoi, endPoi, walkableGrid]);

  const handlePoiClick = (poiId: string) => {
    if (startPoiId && poiId !== startPoiId) {
        setEndPoiId(poiId);
    }
  };

  useEffect(() => {
    if (endPoiId) {
        handleFindPath();
    }
  }, [endPoiId, startPoiId]);


  const handleStep = useCallback((direction: 'forward' | 'backward') => {
    if (!path || totalPathLength === 0) return;
    setIsAnimating(false);
    
    const newDistance = distanceTraveled + (direction === 'forward' ? STEP_DISTANCE : -STEP_DISTANCE);
    const clampedDistance = Math.max(0, Math.min(newDistance, totalPathLength));

    setDistanceTraveled(clampedDistance);
    const newPosition = getPointAtDistance(path, clampedDistance);
    if (newPosition) {
      setCurrentPosition(newPosition);
    }
  }, [path, distanceTraveled, totalPathLength]);
  
  useEffect(() => {
    if (!isAnimating || !path || path.length <= 1) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }
    
    let startTime = performance.now();
    const speed = 100; // feet per second

    const animate = (currentTime: number) => {
      const elapsedTime = (currentTime - startTime) / 1000;
      const newDistance = elapsedTime * speed;

      if (newDistance >= totalPathLength) {
        setDistanceTraveled(totalPathLength);
        setCurrentPosition(path[path.length - 1]);
        setIsAnimating(false);
        return;
      }

      setDistanceTraveled(newDistance);
      const newPosition = getPointAtDistance(path, newDistance);
      if (newPosition) {
        setCurrentPosition(newPosition);
      }
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [path, isAnimating, totalPathLength]);


  return (
    <div className="min-h-screen flex flex-col lg:flex-row p-4 sm:p-6 lg:p-8 gap-8">
      <aside className="w-full lg:w-1/3 xl:w-1/4 flex-shrink-0">
        <ControlPanel
          pois={MAP_DATA.pois}
          startPoiId={startPoiId}
          endPoiId={endPoiId}
          onStartChange={handleStartChange}
          onEndChange={handleEndChange}
          onFindPath={handleFindPath}
          isPathfinding={isPathfinding}
          path={path}
          distanceTraveled={distanceTraveled}
          totalPathLength={totalPathLength}
          onStepForward={() => handleStep('forward')}
          onStepBackward={() => handleStep('backward')}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </aside>
      <main className="flex-grow min-h-[50vh] lg:min-h-0">
        <Map
          mapData={MAP_DATA}
          path={path}
          startPoi={startPoi}
          endPoi={endPoi}
          currentPosition={currentPosition}
          highlightedPoiIds={highlightedPoiIds}
          onPoiClick={handlePoiClick}
        />
      </main>
    </div>
  );
};

export default App;
