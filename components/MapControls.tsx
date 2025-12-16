import React from 'react';

interface MapControlsProps {
    onZoomIn: () => void;
    onZoomOut: () => void;
    onRecenter: () => void;
    bearing?: number; // For compass rotation
}

const MapControls: React.FC<MapControlsProps> = ({
    onZoomIn,
    onZoomOut,
    onRecenter,
    bearing = 0
}) => {
    return (
        <div className="absolute bottom-6 right-6 z-20 flex flex-col gap-2 pointer-events-auto">

            {/* Compass */}
            <button
                className="w-12 h-12 bg-white rounded-full shadow-lg border-2 border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-all relative overflow-hidden"
                title="North Indicator"
            >
                <div
                    className="absolute inset-0 flex items-center justify-center transition-transform duration-300"
                    style={{ transform: `rotate(${-bearing}deg)` }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-red-500">
                        <path fillRule="evenodd" d="M12 2.25a.75.75 0 01.75.75v16.19l6.22-6.22a.75.75 0 111.06 1.06l-7.5 7.5a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 111.06-1.06l6.22 6.22V3a.75.75 0 01.75-.75z" clipRule="evenodd" />
                    </svg>
                </div>
                <span className="absolute top-1 text-[10px] font-bold text-slate-700">N</span>
            </button>

            {/* Zoom In */}
            <button
                onClick={onZoomIn}
                className="w-12 h-12 bg-white rounded-full shadow-lg border-2 border-slate-200 flex items-center justify-center hover:bg-blue-50 hover:border-blue-300 transition-all text-slate-700 font-bold text-xl"
                title="Zoom In"
            >
                +
            </button>

            {/* Zoom Out */}
            <button
                onClick={onZoomOut}
                className="w-12 h-12 bg-white rounded-full shadow-lg border-2 border-slate-200 flex items-center justify-center hover:bg-blue-50 hover:border-blue-300 transition-all text-slate-700 font-bold text-xl"
                title="Zoom Out"
            >
                −
            </button>

            {/* Re-center */}
            <button
                onClick={onRecenter}
                className="w-12 h-12 bg-white rounded-full shadow-lg border-2 border-slate-200 flex items-center justify-center hover:bg-blue-50 hover:border-blue-300 transition-all"
                title="Re-center Map"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-slate-700">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
                </svg>
            </button>
        </div>
    );
};

export default MapControls;
