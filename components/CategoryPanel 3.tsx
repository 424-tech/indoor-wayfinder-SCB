import React from 'react';

interface CategoryPanelProps {
    onCategorySelect: (poiId: string) => void;
}

const CategoryPanel: React.FC<CategoryPanelProps> = ({ onCategorySelect }) => {
    const categories = [
        { id: 'emergency-west', name: 'Emergency', icon: '🚨', color: 'bg-red-500 hover:bg-red-600' },
        { id: 'pharmacy-west', name: 'Pharmacy', icon: '💊', color: 'bg-green-500 hover:bg-green-600' },
        { id: 'blood-lab', name: 'Labs', icon: '🔬', color: 'bg-purple-500 hover:bg-purple-600' },
        { id: 'cafe', name: 'Cafeteria', icon: '☕', color: 'bg-orange-500 hover:bg-orange-600' },
        { id: 'restroom-west', name: 'Restroom', icon: '🚻', color: 'bg-blue-500 hover:bg-blue-600' },
        { id: 'info-desk', name: 'Info Desk', icon: 'ℹ️', color: 'bg-slate-500 hover:bg-slate-600' },
    ];

    return (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20 pointer-events-auto">
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-4 border border-slate-200">
                <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3 text-center">Quick Access</h3>
                <div className="flex flex-col gap-3">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => onCategorySelect(cat.id)}
                            className={`${cat.color} text-white rounded-xl p-3 flex flex-col items-center gap-1 transition-all transform hover:scale-105 active:scale-95 shadow-lg min-w-[80px]`}
                            title={cat.name}
                        >
                            <span className="text-2xl">{cat.icon}</span>
                            <span className="text-[10px] font-bold uppercase tracking-wide">{cat.name}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CategoryPanel;
