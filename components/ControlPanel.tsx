
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
  onEmergencyClick?: () => void;
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
  onEmergencyClick,
}) => {
  const canStepForward = path && distanceTraveled < totalPathLength;
  const canStepBackward = path && distanceTraveled > 0;

  return (
    <div className="h-full flex flex-col">
      {/* 0. Emergency Panic Button */}
      <div className="mb-6">
        <button
          onClick={onEmergencyClick}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 px-4 rounded-xl shadow-lg shadow-red-500/30 transform transition-all active:scale-95 flex items-center justify-between group"
        >
          <div className="flex flex-col items-start">
            <span className="text-lg uppercase tracking-wider">Emergency</span>
            <span className="text-[10px] font-medium opacity-80 group-hover:opacity-100">Tap for immediate help</span>
          </div>
          <div className="bg-white/20 p-2 rounded-full animate-pulse">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
        </button>
      </div>

      {/* Search / Filter */}
      <div className="mb-6 space-y-3">
        <label className="text-xs font-bold text-blue-600 uppercase tracking-widest">Quick Find</label>
        <input
          type="text"
          placeholder="Search locations..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="glass-input block w-full rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500 placeholder-slate-400 text-sm shadow-sm"
        />
        <div className="grid grid-cols-3 gap-2">
          <button onClick={() => onSearchChange(POIType.RESTROOM)} className="glass-button text-xs py-2 rounded-lg hover:bg-blue-50 text-slate-600 font-medium">Restroom</button>
          <button onClick={() => onSearchChange(POIType.CAFE)} className="glass-button text-xs py-2 rounded-lg hover:bg-blue-50 text-slate-600 font-medium">Cafe</button>
          <button onClick={() => onSearchChange(POIType.INFO)} className="glass-button text-xs py-2 rounded-lg hover:bg-blue-50 text-slate-600 font-medium">Info</button>
        </div>
      </div>

      <div className="h-px bg-slate-200 my-2"></div>

      {/* Route Planning */}
      <div className="space-y-5 flex-grow mt-4">
        <label className="text-xs font-bold text-blue-600 uppercase tracking-widest">Navigation</label>

        <div className="space-y-4">
          <div className="relative">
            <span className="absolute left-3 top-3.5 w-2 h-2 rounded-full bg-green-500 shadow-sm"></span>
            <select
              id="start-poi"
              value={startPoiId || ''}
              onChange={(e) => onStartChange(e.target.value)}
              className="glass-input block w-full rounded-xl py-3 pl-8 pr-10 focus:ring-2 focus:ring-blue-500 text-sm appearance-none cursor-pointer"
            >
              <option value="" disabled className="text-slate-400">Start Location</option>
              {pois.map((poi) => (
                <option key={poi.id} value={poi.id} disabled={poi.id === endPoiId} className="text-slate-800">
                  {poi.name}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <span className="absolute left-3 top-3.5 w-2 h-2 rounded-full bg-red-500 shadow-sm"></span>
            <select
              id="end-poi"
              value={endPoiId || ''}
              onChange={(e) => onEndChange(e.target.value)}
              className="glass-input block w-full rounded-xl py-3 pl-8 pr-10 focus:ring-2 focus:ring-blue-500 text-sm appearance-none cursor-pointer"
            >
              <option value="" disabled className="text-slate-400">Destination</option>
              {pois.map((poi) => (
                <option key={poi.id} value={poi.id} disabled={poi.id === startPoiId} className="text-slate-800">
                  {poi.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Accessibility Toggle */}
        <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className={`p-1.5 rounded-lg ${isAccessible ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'} transition-colors duration-300`}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-slate-700">Wheelchair Accessible</span>
              <span className="text-[10px] text-slate-500 font-medium">Avoids stairs</span>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={isAccessible} onChange={(e) => onAccessibleChange?.(e.target.checked)} className="sr-only peer" />
            <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <button
          onClick={onFindPath}
          disabled={!startPoiId || !endPoiId || isPathfinding}
          className="primary-button w-full py-4 rounded-xl text-sm font-bold uppercase tracking-wide flex items-center justify-center space-x-2 disabled:bg-slate-300"
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
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 shadow-sm flex justify-between items-center">
            <div>
              <span className="block text-xs text-slate-500 font-medium uppercase tracking-wide">Total Distance</span>
              <span className="text-lg font-bold text-slate-800">{Math.round(totalPathLength)} <span className="text-sm font-normal text-slate-500">ft</span></span>
            </div>
            <div>
              <span className="block text-xs text-slate-500 text-right font-medium uppercase tracking-wide">Progress</span>
              <span className="text-lg font-bold text-blue-600">{Math.round((distanceTraveled / totalPathLength) * 100)}%</span>
            </div>
          </div>

          {/* Play/Pause Button */}
          <button
            onClick={onPlayPause}
            className="primary-button w-full py-4 rounded-xl text-sm font-bold uppercase tracking-wide flex items-center justify-center space-x-2 shadow-lg shadow-blue-500/20"
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
              className="glass-button flex-1 py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium text-slate-600 hover:text-slate-800 bg-white shadow-sm"
            >
              ← Back
            </button>
            <button
              onClick={onStepForward}
              disabled={!canStepForward || isAnimating}
              className="glass-button flex-1 py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium text-slate-600 hover:text-slate-800 bg-white shadow-sm"
            >
              Forward →
            </button>
          </div>

          {instructions && instructions.length > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-200">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Directions</h3>
              <ul className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                {instructions.map((inst, idx) => (
                  <li key={idx} className="text-sm text-slate-700 flex items-start p-3 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                    <span className="mr-3 mt-1.5 min-w-[6px] h-[6px] rounded-full bg-blue-500 shadow-sm" />
                    <span className="leading-relaxed text-sm font-medium">{inst.text}</span>
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
