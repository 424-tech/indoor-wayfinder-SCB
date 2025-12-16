import React from 'react';

interface ArrivalScreenProps {
    destinationName: string;
    onDismiss: () => void;
}

const ArrivalScreen: React.FC<ArrivalScreenProps> = ({ destinationName, onDismiss }) => {
    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-md animate-fade-in">
            <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-sm w-full mx-4 text-center transform transition-all scale-100 animate-[fadeIn_0.5s_ease-out]">

                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10 text-green-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                </div>

                <h2 className="text-2xl font-bold text-slate-800 mb-2">You have arrived!</h2>
                <p className="text-slate-500 mb-8">
                    You are now at <br />
                    <span className="text-blue-600 font-bold text-lg">{destinationName}</span>
                </p>

                <button
                    onClick={onDismiss}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all"
                >
                    Done
                </button>

            </div>
        </div>
    );
};

export default ArrivalScreen;
