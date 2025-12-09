
import React from 'react';
import { POI, Point, POIType, Instruction } from '../types';

interface ControlPanelProps {
  pois: POI[];
  startPoiId: string | null;
  endPoiId: string | null;
  onStartChange: (id: string) => void;
  onEndChange: (id: string) => void;
  onFindPath: () => void;
  isPathfinding: boolean;
  path: Point[] | null;
  instructions?: Instruction[];
  distanceTraveled: number;
  totalPathLength: number;
  onStepForward: () => void;
  onStepBackward: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  pois,
  startPoiId,
  endPoiId,
  onStartChange,
  onEndChange,
  onFindPath,
  isPathfinding,
  path,
  instructions,
  distanceTraveled,
  totalPathLength,
  onStepForward,
  onStepBackward,
  searchQuery,
  onSearchChange,
}) => {
  const canStepForward = path && distanceTraveled < totalPathLength;
  const canStepBackward = path && distanceTraveled > 0;

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-2xl border border-gray-700 h-full flex flex-col">
      <h1 className="text-3xl font-bold mb-2 text-indigo-400">Indoor Wayfinder</h1>
      <p className="text-gray-400 mb-6">Select your start and end points or find a place of interest.</p>

      <div className="space-y-6 flex-grow">
        {/* Route Planning */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-200 border-b border-gray-600 pb-2">Plan a Route</h2>
          <div>
            <label htmlFor="start-poi" className="block text-sm font-medium text-gray-300 mb-2">
              Start Location
            </label>
            <select
              id="start-poi"
              value={startPoiId || ''}
              onChange={(e) => onStartChange(e.target.value)}
              className="block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-3 px-4 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-white"
            >
              <option value="" disabled>Choose a starting point</option>
              {pois.map((poi) => (
                <option key={poi.id} value={poi.id} disabled={poi.id === endPoiId}>
                  {poi.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="end-poi" className="block text-sm font-medium text-gray-300 mb-2">
              Destination
            </label>
            <select
              id="end-poi"
              value={endPoiId || ''}
              onChange={(e) => onEndChange(e.target.value)}
              className="block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-3 px-4 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-white"
            >
              <option value="" disabled>Choose a destination</option>
              {pois.map((poi) => (
                <option key={poi.id} value={poi.id} disabled={poi.id === startPoiId}>
                  {poi.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Find a Place */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-200 border-b border-gray-600 pb-2">Find a Place</h2>
          <input
            type="text"
            placeholder="e.g., Cafe or Radiology"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-3 px-4 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-white"
          />
          <div className="flex space-x-2">
            <button onClick={() => onSearchChange(POIType.RESTROOM)} className="flex-1 text-sm py-2 px-2 bg-gray-600 hover:bg-gray-500 rounded-md transition-colors">Restroom</button>
            <button onClick={() => onSearchChange(POIType.CAFE)} className="flex-1 text-sm py-2 px-2 bg-gray-600 hover:bg-gray-500 rounded-md transition-colors">Cafe</button>
            <button onClick={() => onSearchChange(POIType.INFO)} className="flex-1 text-sm py-2 px-2 bg-gray-600 hover:bg-gray-500 rounded-md transition-colors">Info</button>
          </div>
        </div>

      </div>

      <button
        onClick={onFindPath}
        disabled={!startPoiId || !endPoiId || isPathfinding}
        className="w-full flex justify-center py-4 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors duration-200 mt-4"
      >
        {isPathfinding ? 'Calculating...' : 'Find Path'}
      </button>

      {path && path.length > 0 && (
        <div className="mt-4 space-y-3">
          <p className="text-center text-gray-400 text-sm" aria-live="polite">
            Distance: {Math.round(distanceTraveled)} ft / {Math.round(totalPathLength)} ft
          </p>
          <div className="flex justify-between space-x-4">
            <button
              onClick={onStepBackward}
              disabled={!canStepBackward}
              aria-label="Move Backward"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-md font-medium text-white bg-indigo-500 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400 disabled:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Move Backward
            </button>
            <button
              onClick={onStepForward}
              disabled={!canStepForward}
              aria-label="Move Forward"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-md font-medium text-white bg-indigo-500 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400 disabled:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Move Forward
            </button>
          </div>

          {instructions && instructions.length > 0 && (
            <div className="mt-4 border-t border-gray-600 pt-4">
              <h3 className="text-gray-200 font-semibold mb-2">Instructions</h3>
              <ul className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {instructions.map((inst, idx) => (
                  <li key={idx} className="text-sm text-gray-300 flex items-start">
                    <span className="mr-2 mt-1 w-2 h-2 rounded-full bg-indigo-400 flex-shrink-0" />
                    <span>{inst.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ControlPanel;
