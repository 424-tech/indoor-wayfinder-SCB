import React, { useState } from 'react';
import { MapData, POI, Point } from '../types';
import Map from './Map';
import { MapContainer, TileLayer, ImageOverlay, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapViewProps {
    mapData: MapData;
    startPoi: POI | null;
    endPoi: POI | null;
    path: Point[] | null;
    onPoiClick: (poi: POI) => void;
    activeFloorId: string;
    onFloorChange: (floorId: string) => void;
    currentPosition: Point | null;
}

export enum ViewMode {
    INDOOR_2D = '2D',
    INDOOR_3D = '3D',
    OUTDOOR = 'Outdoor'
}

const MapView: React.FC<MapViewProps> = ({
    mapData,
    startPoi,
    endPoi,
    path,
    onPoiClick,
    activeFloorId,
    onFloorChange,
    currentPosition
}) => {
    const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.INDOOR_2D);
    const [rotation, setRotation] = useState(45);

    const activeFloor = mapData.floors.find(f => f.id === activeFloorId);

    // MOCK Coordinates for the building (roughly corresponding to 2000x1200 px)
    // Let's place it in a real location, e.g., a generic tech park
    const bounds: L.LatLngBoundsExpression = [[40.712, -74.008], [40.714, -74.004]];
    const center: L.LatLngExpression = [40.713, -74.006];

    return (
        <div className="flex flex-col h-full relative">
            {/* View Controls */}
            <div className="absolute top-4 right-4 z-[1000] flex gap-2 bg-white p-2 rounded-lg shadow-md">
                {Object.values(ViewMode).map(mode => (
                    <button
                        key={mode}
                        onClick={() => setViewMode(mode)}
                        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${viewMode === mode
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        {mode}
                    </button>
                ))}
            </div>

            {/* Floor Selector (Visible in 2D and 3D) */}
            {(viewMode !== ViewMode.OUTDOOR) && (
                <div className="absolute top-4 left-4 z-[1000] flex flex-col gap-2 bg-white p-2 rounded-lg shadow-md">
                    {mapData.floors.map(floor => (
                        <button
                            key={floor.id}
                            onClick={() => onFloorChange(floor.id)}
                            className={`w-10 h-10 flex items-center justify-center rounded-full font-bold transition-all ${activeFloorId === floor.id
                                ? 'bg-blue-600 text-white scale-110 shadow-lg'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {floor.level}
                        </button>
                    ))}
                </div>
            )}

            {/* 2D MODE */}
            {viewMode === ViewMode.INDOOR_2D && (
                <div className="flex-1 overflow-hidden p-8 bg-slate-100">
                    <div className="w-full h-full shadow-2xl relative">
                        <Map
                            mapData={mapData}
                            activeFloorId={activeFloorId}
                            startPoi={startPoi}
                            endPoi={endPoi}
                            path={path}
                            onPoiClick={onPoiClick}
                            currentPosition={currentPosition}
                        />
                    </div>
                </div>
            )}

            {/* 3D MODE */}
            {viewMode === ViewMode.INDOOR_3D && (
                <div className="flex-1 overflow-hidden bg-slate-800 perspective-[2000px] flex items-center justify-center relative">

                    {/* Rotation Control */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur px-4 py-2 rounded-full flex gap-4 text-white">
                        <button onClick={() => setRotation(r => r - 45)}>⟲</button>
                        <span className="text-sm font-mono">Rotate</span>
                        <button onClick={() => setRotation(r => r + 45)}>⟳</button>
                    </div>

                    <div
                        className="relative w-[1000px] h-[600px] transition-transform duration-700 ease-out preserve-3d"
                        style={{
                            transformStyle: 'preserve-3d',
                            transform: `rotateX(60deg) rotateZ(${rotation}deg) scale(0.6)`
                        }}
                    >
                        {mapData.floors.map((floor, index) => {
                            const isSelected = floor.id === activeFloorId;
                            const zOffset = index * 150; // Distance between floors

                            return (
                                <div
                                    key={floor.id}
                                    onClick={(e) => { e.stopPropagation(); onFloorChange(floor.id); }}
                                    className={`absolute top-0 left-0 w-full h-full transition-all duration-300 cursor-pointer border-2 ${isSelected ? 'border-blue-500 opacity-100' : 'border-transparent opacity-40 hover:opacity-70'}`}
                                    style={{
                                        transform: `translateZ(${zOffset}px)`,
                                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                        boxShadow: '0 20px 50px rgba(0,0,0,0.2)'
                                    }}
                                >
                                    {/* Floor Label */}
                                    <div className="absolute -left-20 top-0 text-white text-4xl font-bold bg-blue-600 px-4 py-2 rounded transform -rotate-z-45" style={{ transform: `rotateZ(-${rotation}deg)` }}>
                                        L{floor.level}
                                    </div>

                                    <Map
                                        mapData={mapData}
                                        activeFloorId={floor.id}
                                        startPoi={startPoi}
                                        endPoi={endPoi}
                                        path={path}
                                        onPoiClick={onPoiClick}
                                        currentPosition={currentPosition}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* OUTDOOR MODE */}
            {viewMode === ViewMode.OUTDOOR && (
                <div className="flex-1 w-full h-full relative z-0">
                    <MapContainer center={center} zoom={16} style={{ height: '100%', width: '100%' }}>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        {/* We try to overlay the active floor SVG - Note: This requires SVG to be accessible as URL or render specific component. 
                       For now, let's just place a Marker at the building. 
                       Implementing full SVGOverlay with React components is complex. 
                       I will put a Rectangle to show the building bounds.
                   */}
                        <L.Rectangle bounds={bounds} pathOptions={{ color: 'blue', weight: 1, fillOpacity: 0.1 }} />
                        <L.Marker position={center}>
                            <L.Popup>
                                <div className="font-bold">Main Hospital Building</div>
                                Current Floor: {activeFloor?.name}
                            </L.Popup>
                        </L.Marker>
                    </MapContainer>
                </div>
            )}
        </div>
    );
};

export default MapView;
