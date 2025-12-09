import React, { useMemo } from 'react';
import { MapData, POI, Point, POIType } from '../types';

interface MapProps {
  mapData: MapData;
  startPoi: POI | null;
  endPoi: POI | null;
  path: Point[] | null;
  onPoiClick: (poi: POI) => void;
  activeFloorId: string;
  currentPosition: Point | null;
}

const Map: React.FC<MapProps> = ({ mapData, startPoi, endPoi, path, onPoiClick, activeFloorId, currentPosition }) => {
  const { width, height, floors } = mapData;
  const activeFloor = floors.find(f => f.id === activeFloorId);

  const pathSegments = useMemo(() => {
    if (!path) return [];
    const segments: Point[][] = [];
    let currentSegment: Point[] = [];

    path.forEach((p) => {
      if (p.floorId === activeFloorId) {
        currentSegment.push(p);
      } else {
        if (currentSegment.length > 0) {
          segments.push(currentSegment);
          currentSegment = [];
        }
      }
    });
    if (currentSegment.length > 0) segments.push(currentSegment);
    return segments;
  }, [path, activeFloorId]);

  if (!activeFloor) return <div>Floor not found</div>;

  return (
    <div className="relative bg-white shadow-lg rounded-xl overflow-hidden" style={{ width: '100%', height: '100%' }}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full bg-slate-50"
        style={{ touchAction: 'none' }}
      >
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#E2E8F0" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Walls */}
        <g stroke="#334155" strokeWidth="6" strokeLinecap="round">
          {activeFloor.walls.map((wall, idx) => (
            <line
              key={idx}
              x1={wall.start.x}
              y1={wall.start.y}
              x2={wall.end.x}
              y2={wall.end.y}
            />
          ))}
        </g>

        {/* Start/End Markers if on this floor */}
        {startPoi && startPoi.floorId === activeFloorId && (
          <circle cx={startPoi.position.x} cy={startPoi.position.y} r="12" fill="#22c55e" stroke="white" strokeWidth="3" />
        )}
        {endPoi && endPoi.floorId === activeFloorId && (
          <circle cx={endPoi.position.x} cy={endPoi.position.y} r="12" fill="#ef4444" stroke="white" strokeWidth="3" />
        )}

        {/* Path segments */}
        {pathSegments.map((segment, idx) => (
          <polyline
            key={idx}
            points={segment.map(p => `${p.x},${p.y}`).join(' ')}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="10 6"
            className="animate-pulse"
          />
        ))}

        {/* Current Position Marker */}
        {currentPosition && currentPosition.floorId === activeFloorId && (
          <g transform={`translate(${currentPosition.x}, ${currentPosition.y})`}>
            <circle r="15" fill="#3b82f6" fillOpacity="0.3" className="animate-ping" />
            <circle r="8" fill="#2563eb" stroke="white" strokeWidth="2" />
          </g>
        )}

        {/* POIs */}
        {activeFloor.pois.map((poi) => {
          let color = '#64748b';
          if (poi.type === POIType.ENTRANCE) color = '#22c55e';
          if (poi.type === POIType.RESTROOM) color = '#0ea5e9';
          if (poi.type === POIType.ELEVATOR) color = '#8b5cf6';
          if (poi.type === POIType.STAIRS) color = '#8b5cf6';

          const isSelected = startPoi?.id === poi.id || endPoi?.id === poi.id;

          return (
            <g
              key={poi.id}
              onClick={() => onPoiClick(poi)}
              className="cursor-pointer hover:opacity-80 transition-opacity"
            >
              <circle
                cx={poi.position.x}
                cy={poi.position.y}
                r="8"
                fill={isSelected ? '#fde047' : color}
                stroke="white"
                strokeWidth="2"
              />

              {/* Labels for key/large POIs */}
              <text
                x={poi.position.x}
                y={poi.position.y + 24}
                textAnchor="middle"
                className="text-xs font-medium fill-slate-600 select-none pointer-events-none"
                style={{ fontSize: '14px', textShadow: '0 1px 2px white' }}
              >
                {poi.name}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default Map;
