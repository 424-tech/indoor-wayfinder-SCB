
import React from 'react';
import { MapData, Point, POI } from '../types';

interface MapProps {
  mapData: MapData;
  path: Point[] | null;
  startPoi?: POI;
  endPoi?: POI;
  currentPosition: Point | null;
  highlightedPoiIds: Set<string>;
  onPoiClick: (poiId: string) => void;
}

const Map: React.FC<MapProps> = ({ mapData, path, startPoi, endPoi, currentPosition, highlightedPoiIds, onPoiClick }) => {
  const { width, height, walls, pois } = mapData;

  const pathData = path
    ? "M " + path.map(p => `${p.x} ${p.y}`).join(" L ")
    : "";

  return (
    <div className="w-full h-full bg-gray-800 rounded-lg shadow-xl overflow-hidden border-4 border-gray-700">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
        <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="10" result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
        </defs>
        {/* Walls */}
        <g id="walls">
          {walls.map((wall, index) => (
            <line
              key={`wall-${index}`}
              x1={wall.start.x}
              y1={wall.start.y}
              x2={wall.end.x}
              y2={wall.end.y}
              stroke="#9CA3AF"
              strokeWidth="5"
              strokeLinecap="round"
            />
          ))}
        </g>

        {/* Path */}
        {pathData && (
          <path
            d={pathData}
            fill="none"
            stroke="#34D399"
            strokeWidth="6"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        )}

        {/* POIs */}
        <g id="pois">
          {pois.map((poi) => {
            const isHighlighted = highlightedPoiIds.has(poi.id);
            return (
              <g 
                key={poi.id} 
                transform={`translate(${poi.position.x}, ${poi.position.y})`}
                onClick={() => onPoiClick(poi.id)}
                className="cursor-pointer"
              >
                {isHighlighted && (
                     <circle cx="0" cy="0" r="12" fill="#FBBF24" style={{filter: 'url(#glow)'}} />
                )}
                <circle
                  cx="0"
                  cy="0"
                  r="12"
                  fill={
                      poi.id === startPoi?.id ? '#3B82F6' :
                      poi.id === endPoi?.id ? '#EF4444' :
                      isHighlighted ? '#FBBF24' :
                      '#4F46E5'
                  }
                  stroke="#E5E7EB"
                  strokeWidth="2"
                />
                <text
                  x="0"
                  y="30"
                  fill="#E5E7EB"
                  fontSize="14"
                  textAnchor="middle"
                  className="font-sans pointer-events-none"
                >
                  {poi.name}
                </text>
              </g>
            )
          })}
        </g>

        {/* Current Position */}
        {currentPosition && (
          <circle
            cx={currentPosition.x}
            cy={currentPosition.y}
            r="10"
            fill="#34D399"
            stroke="white"
            strokeWidth="3"
            className="transition-all duration-200 ease-linear"
          />
        )}
      </svg>
    </div>
  );
};

export default Map;
