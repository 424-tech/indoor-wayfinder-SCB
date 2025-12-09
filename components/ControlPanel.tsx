
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
  isAccessible?: boolean;
  onAccessibleChange?: (val: boolean) => void;
  isAnimating?: boolean;
  onPlayPause?: () => void;
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
  isAccessible = false,
  onAccessibleChange,
  isAnimating = false,
  onPlayPause,
}) => {
  const canStepForward = path && distanceTraveled < totalPathLength;
  const canStepBackward = path && distanceTraveled > 0;

  return (
    <div className="h-full flex flex-col">
      {/* Search / Filter */}
      <div className="mb-6 space-y-3">
        <label className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">Quick Find</label>
        <input
          type="text"
          placeholder="Search locations..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="glass-input block w-full rounded-xl py-3 px-4 focus:ring-2 focus:ring-indigo-500 placeholder-white/30 text-sm"
        />
        <div className="grid grid-cols-3 gap-2">
          <button onClick={() => onSearchChange(POIType.RESTROOM)} className="glass-button text-xs py-2 rounded-lg hover:bg-indigo-500/20">Restroom</button>
          <button onClick={() => onSearchChange(POIType.CAFE)} className="glass-button text-xs py-2 rounded-lg hover:bg-indigo-500/20">Cafe</button>
          <button onClick={() => onSearchChange(POIType.INFO)} className="glass-button text-xs py-2 rounded-lg hover:bg-indigo-500/20">Info</button>
        </div>
      </div>

      <div className="h-px bg-white/10 my-2"></div>

      {/* Route Planning */}
      <div className="space-y-5 flex-grow mt-4">
        <label className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">Navigation</label>

        <div className="space-y-4">
          <div className="relative">
            <span className="absolute left-3 top-3.5 w-2 h-2 rounded-full bg-green-400"></span>
            <select
              id="start-poi"
              value={startPoiId || ''}
              onChange={(e) => onStartChange(e.target.value)}
              className="glass-input block w-full rounded-xl py-3 pl-8 pr-10 focus:ring-2 focus:ring-indigo-500 text-sm appearance-none"
            >
              <option value="" disabled className="text-gray-500">Start Location</option>
              {pois.map((poi) => (
                <option key={poi.id} value={poi.id} disabled={poi.id === endPoiId} className="bg-gray-800">
                  {poi.name}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <span className="absolute left-3 top-3.5 w-2 h-2 rounded-full bg-red-400"></span>
            <select
              id="end-poi"
              value={endPoiId || ''}
              onChange={(e) => onEndChange(e.target.value)}
              className="glass-input block w-full rounded-xl py-3 pl-8 pr-10 focus:ring-2 focus:ring-indigo-500 text-sm appearance-none"
            >
              <option value="" disabled className="text-gray-500">Destination</option>
              {pois.map((poi) => (
                <option key={poi.id} value={poi.id} disabled={poi.id === startPoiId} className="bg-gray-800">
                  {poi.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Accessibility Toggle */}
        <div className="flex items-center justify-between bg-black/20 p-3 rounded-xl border border-white/5">
          <div className="flex items-center space-x-3">
            <div className={`p-1.5 rounded-lg ${isAccessible ? 'bg-indigo-500' : 'bg-gray-700'} transition-colors duration-300`}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-200">Wheelchair Accessible</span>
              <span className="text-[10px] text-gray-400">Avoids stairs</span>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={isAccessible} onChange={(e) => onAccessibleChange?.(e.target.checked)} className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
          </label>
        </div>

        <button
          onClick={onFindPath}
          disabled={!startPoiId || !endPoiId || isPathfinding}
          className="primary-button w-full py-4 rounded-xl text-sm font-bold uppercase tracking-wide flex items-center justify-center space-x-2"
        >
          {isPathfinding ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Calculating...</span>
            </>
          ) : (
            <span>Start Navigation</span>
          )}
        </button>
      </div>


      {path && path.length > 0 && (
        <div className="mt-6 space-y-4 animate-fade-in">
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex justify-between items-center">
            <div>
              <span className="block text-xs text-gray-400">Total Distance</span>
              <span className="text-lg font-bold text-white">{Math.round(totalPathLength)} <span className="text-sm font-normal text-gray-400">ft</span></span>
            </div>
            <div>
              <span className="block text-xs text-gray-400 text-right">Progress</span>
              <span className="text-lg font-bold text-indigo-400">{Math.round((distanceTraveled / totalPathLength) * 100)}%</span>
            </div>
          </div>

          {/* Play/Pause Button */}
          <button
            onClick={onPlayPause}
            className="primary-button w-full py-4 rounded-xl text-sm font-bold uppercase tracking-wide flex items-center justify-center space-x-2"
          >
            {isAnimating ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
                </svg>
                <span>Pause</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                </svg>
                <span>Play Route</span>
              </>
            )}
          </button>

          {/* Manual Controls */}
          <div className="flex justify-between space-x-3">
            <button
              onClick={onStepBackward}
              disabled={!canStepBackward || isAnimating}
              className="glass-button flex-1 py-2 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed text-sm"
            >
              ← Back
            </button>
            <button
              onClick={onStepForward}
              disabled={!canStepForward || isAnimating}
              className="glass-button flex-1 py-2 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed text-sm"
            >
              Forward →
            </button>
          </div>

          {instructions && instructions.length > 0 && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Directions</h3>
              <ul className="space-y-3 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                {instructions.map((inst, idx) => (
                  <li key={idx} className="text-sm text-gray-200 flex items-start p-2 rounded-lg hover:bg-white/5 transition-colors">
                    <span className="mr-3 mt-1 min-w-[6px] h-[6px] rounded-full bg-indigo-400" />
                    <span className="leading-relaxed text-sm opacity-90">{inst.text}</span>
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
