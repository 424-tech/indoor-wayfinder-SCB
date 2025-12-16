import React from 'react';
import { Instruction } from '../types';

interface NavigationHUDProps {
    activeInstruction?: Instruction;
    distanceToNext: number; // or string
    totalDistanceRemaining: number;
    onStopNavigation: () => void;
}

const NavigationHUD: React.FC<NavigationHUDProps> = ({
    activeInstruction,
    distanceToNext,
    totalDistanceRemaining,
    onStopNavigation,
}) => {
    return (
        <div className="absolute top-4 left-4 right-4 z-30 flex flex-col items-center pointer-events-none">

            {/* Top Banner - Next Instruction */}
            <div className="glass-panel bg-white/90 backdrop-blur-xl border border-blue-100 p-4 rounded-2xl shadow-2xl flex items-center justify-between w-full max-w-lg pointer-events-auto animate-fade-in">
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 text-white">
                        {/* Dynamic Arrow based on instruction/bearing could go here, for now generic Turn Icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-7 h-7">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l6-6m0 0l-6-6m6 6H9a6 6 0 000 12h3" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 leading-tight">
                            {activeInstruction ? activeInstruction.text : "Follow the path"}
                        </h2>
                        <p className="text-slate-500 text-sm font-medium">
                            {/* Placeholder for dynamic distance to next turn */}
                            In 20 ft
                        </p>
                    </div>
                </div>

                <div className="text-right">
                    <span className="block text-2xl font-black text-blue-600">{Math.round(totalDistanceRemaining)} <span className="text-sm font-bold text-slate-400">ft</span></span>
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Remaining</span>
                </div>
            </div>

            {/* Bottom Button - Stop */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 pointer-events-auto">
                <button
                    onClick={onStopNavigation}
                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-full font-bold shadow-lg shadow-red-500/40 flex items-center space-x-2 transition-all hover:scale-105 active:scale-95"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
                    </svg>
                    <span>Exit Navigation</span>
                </button>
            </div>

        </div>
    );
};

export default NavigationHUD;
