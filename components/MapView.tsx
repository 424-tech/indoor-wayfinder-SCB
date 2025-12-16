import React, { useState } from 'react';
import { MapData, POI, Point } from '../types';
import Map from './Map';
import { MapContainer, TileLayer, ImageOverlay, useMap, Rectangle, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

// Fix Leaflet icon issue safely
try {
    // These might fail in some bundlers if the path isn't standard, better to handle safely
    /* @ts-ignore */
    // import icon from 'leaflet/dist/images/marker-icon.png';
    // /* @ts-ignore */
    // import iconShadow from 'leaflet/dist/images/marker-shadow.png';

    // let DefaultIcon = L.icon({
    //     iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    //     shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    //     iconSize: [25, 41],
    //     iconAnchor: [12, 41]
    // });
    // L.Marker.prototype.options.icon = DefaultIcon;
} catch (e) {
    console.warn("Could not setup Leaflet icons", e);
}

const getBearing = (start: Point, end: Point) => {
    return (Math.atan2(end.y - start.y, end.x - start.x) * 180 / Math.PI) + 90;
};

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
    WALK = 'Walk',
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

    // SCB Medical College and Hospital, Cuttack Coordinates
    const center: L.LatLngExpression = [20.4733, 85.8917];
    const bounds: L.LatLngBoundsExpression = [
        [20.4723, 85.8907], // South-West
        [20.4743, 85.8927]  // North-East
    ];

    return (
        <div className="flex flex-col h-full relative">
            {/* View Controls */}
            <div className="absolute top-4 right-4 z-[1000] flex gap-2 bg-white/90 backdrop-blur p-1.5 rounded-xl shadow-lg border border-white/50">
                {Object.values(ViewMode).map(mode => (
                    <button
                        key={mode}
                        onClick={() => setViewMode(mode)}
                        className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${viewMode === mode
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'text-slate-600 hover:bg-slate-100'
                            }`}
                    >
                        {mode}
                    </button>
                ))}
            </div>

            {/* Floor Selector (Visible in 2D and 3D) - MOVED TO RIGHT-36 TO AVOID QUICK ACCESS MENU */}
            {(viewMode !== ViewMode.OUTDOOR) && (
                <div className="absolute top-20 right-36 z-[3000] flex flex-col gap-2 bg-white p-2 rounded-xl shadow-lg border border-slate-200">
                    {mapData.floors.map(floor => (
                        <button
                            key={floor.id}
                            onClick={() => onFloorChange(floor.id)}
                            className={`w-10 h-10 flex items-center justify-center rounded-lg font-bold text-sm transition-all ${activeFloorId === floor.id
                                ? 'bg-blue-600 text-white shadow-md scale-105'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                        >
                            {floor.level}
                        </button>
                    ))}
                </div>
            )}

            {/* 2D MODE */}
            {viewMode === ViewMode.INDOOR_2D && (
                <div className="flex-1 overflow-hidden bg-slate-100 flex flex-col relative w-full h-full">
                    {/* React Zoom Pan Pinch Wrapper */}
                    <TransformWrapper
                        initialScale={0.8}
                        minScale={0.2}
                        maxScale={8}
                        centerOnInit={true}
                        wheel={{ step: 0.1 }}
                        alignmentAnimation={{ sizeX: 0, sizeY: 0 }}
                    >
                        {({ zoomIn, zoomOut, resetTransform }) => (
                            <React.Fragment>
                                {/* Zoom Controls - moved slightly up to avoid covering footer if any */}
                                <div className="absolute bottom-10 right-36 z-[1000] flex flex-col gap-2 pointer-events-auto">
                                    <button
                                        onClick={() => resetTransform()}
                                        className="w-12 h-12 bg-white rounded-xl shadow-xl border border-slate-100 text-slate-700 flex flex-col items-center justify-center hover:bg-slate-50 active:scale-95 transition-all group"
                                        title="Reset North"
                                    >
                                        <div className="text-red-500 font-bold text-lg leading-none">N</div>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-slate-400 group-hover:text-red-500 transition-colors">
                                            <path fillRule="evenodd" d="M12 2.25a.75.75 0 01.75.75v16.19l6.22-6.22a.75.75 0 111.06 1.06l-7.5 7.5a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 111.06-1.06l6.22 6.22V3a.75.75 0 01.75-.75z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => zoomIn()}
                                        className="w-12 h-12 bg-white rounded-xl shadow-xl border border-slate-100 text-slate-700 flex items-center justify-center text-2xl font-light hover:bg-slate-50 active:scale-95 transition-all"
                                        title="Zoom In"
                                    >
                                        +
                                    </button>
                                    <button
                                        onClick={() => zoomOut()}
                                        className="w-12 h-12 bg-white rounded-xl shadow-xl border border-slate-100 text-slate-700 flex items-center justify-center text-2xl font-light hover:bg-slate-50 active:scale-95 transition-all"
                                        title="Zoom Out"
                                    >
                                        -
                                    </button>
                                    <button
                                        onClick={() => resetTransform()}
                                        className="w-12 h-12 bg-white rounded-xl shadow-xl border border-slate-100 text-slate-700 flex items-center justify-center font-bold text-[10px] uppercase tracking-wider hover:bg-slate-50 active:scale-95 transition-all"
                                        title="Reset View"
                                    >
                                        Fit
                                    </button>
                                </div>

                                <TransformComponent
                                    wrapperStyle={{ width: "100%", height: "100%" }}
                                    contentStyle={{ width: "100%", height: "100%" }}
                                >
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
                                </TransformComponent>
                            </React.Fragment>
                        )}
                    </TransformWrapper>
                </div>
            )}

            {/* WALK MODE - First Person Perspective */}
            {viewMode === ViewMode.WALK && (
                <div className="flex-1 overflow-hidden bg-gradient-to-b from-sky-200 to-slate-300 relative" style={{ perspective: '800px' }}>

                    {/* Camera Container */}
                    <div
                        className="absolute left-1/2 bottom-20 w-0 h-0 transition-transform duration-500 ease-linear will-change-transform"
                        style={{
                            transformStyle: 'preserve-3d',
                            transform: (() => {
                                let bearing = 0;
                                if (path && currentPosition) {
                                    let minD = Infinity;
                                    let closestPathPointIndex = -1;
                                    for (let i = 0; i < path.length; i++) {
                                        const d = Math.hypot(path[i].x - currentPosition.x, path[i].y - currentPosition.y);
                                        if (d < minD) {
                                            minD = d;
                                            closestPathPointIndex = i;
                                        }
                                    }

                                    if (closestPathPointIndex !== -1 && closestPathPointIndex < path.length - 1) {
                                        const nextPoint = path[closestPathPointIndex + 1];
                                        bearing = getBearing(currentPosition, nextPoint);
                                    } else if (path.length > 1) {
                                        bearing = getBearing(path[path.length - 2], path[path.length - 1]);
                                    }
                                }

                                return `rotateX(60deg) rotateZ(${-bearing}deg)`;
                            })()
                        }}
                    >
                        {/* Map World Translated */}
                        <div
                            className="transition-transform duration-75 ease-linear will-change-transform"
                            style={{
                                transform: `translate(${-currentPosition?.x || 0}px, ${-currentPosition?.y || 0}px)`,
                                width: 0, height: 0
                            }}
                        >
                            <div style={{ width: mapData.width, height: mapData.height }}>
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
                    </div>

                    {/* HUD - Directions */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none">
                        <div className="w-16 h-16 rounded-full bg-blue-600 border-4 border-white shadow-xl flex items-center justify-center animate-pulse z-10">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8 text-white">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
                            </svg>
                        </div>
                        <span className="text-slate-600 font-bold bg-white/80 px-3 py-1 rounded-full text-xs shadow-sm uppercase tracking-wider backdrop-blur">
                            Tap 'Play' to Walk
                        </span>
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
                        <Rectangle bounds={bounds} pathOptions={{ color: 'blue', weight: 1, fillOpacity: 0.1 }} />
                        <Marker position={center}>
                            <Popup>
                                <div className="font-bold">SCB Medical Center</div>
                                Current Floor: {activeFloor?.name}
                            </Popup>
                        </Marker>
                    </MapContainer>
                </div>
            )}
        </div>
    );
};

export default MapView;
