import { Point, MapData, Instruction, POI, Direction, Floor, POIType } from '../types';

// Helper to create a unique key for a point
const pointToKey = (p: Point): string => `${p.x},${p.y}`;

// Euclidean distance heuristic
const heuristic = (a: Point, b: Point): number => {
    return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
};

// Check if a point is walkable (not inside a wall)
const isWalkable = (p: Point, walkableGrid: Set<string>): boolean => {
    return walkableGrid.has(pointToKey(p));
};

// Line segment intersection helper
const doLinesIntersect = (p1: Point, p2: Point, p3: Point, p4: Point): boolean => {
    const ccw = (a: Point, b: Point, c: Point) => (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
    return (
        ccw(p1, p3, p4) * ccw(p2, p3, p4) < 0 &&
        ccw(p1, p2, p3) * ccw(p1, p2, p4) < 0
    );
};

// Check if there is a clear line of sight between two points
const hasLineOfSight = (
    start: Point,
    end: Point,
    walls: Floor['walls'],
    resolution: number
): boolean => {
    // Check intersection with all walls
    for (const wall of walls) {
        if (doLinesIntersect(start, end, wall.start, wall.end)) {
            return false;
        }
    }

    // Also check if the line passes too close to wall endpoints (corner cutting)
    const dist = heuristic(start, end);
    // Optimization: Check fewer points
    const steps = Math.ceil(dist / resolution);

    for (let i = 1; i < steps; i++) {
        const t = i / steps;
        const p = {
            x: start.x + t * (end.x - start.x),
            y: start.y + t * (end.y - start.y)
        };
        // Check proximity to any wall endpoint or segment
        for (const wall of walls) {
            const { start: wStart, end: wEnd } = wall;
            const distSq = (p1: Point, p2: Point) => (p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2;
            const l2 = distSq(wStart, wEnd);
            if (l2 === 0) continue;
            let tWall = ((p.x - wStart.x) * (wEnd.x - wStart.x) + (p.y - wStart.y) * (wEnd.y - wStart.y)) / l2;
            tWall = Math.max(0, Math.min(1, tWall));
            const projection = {
                x: wStart.x + tWall * (wEnd.x - wStart.x),
                y: wStart.y + tWall * (wEnd.y - wStart.y)
            };
            if (distSq(p, projection) < (resolution * 0.4) ** 2) {
                return false;
            }
        }
    }

    return true;
};

// Returns a Map where key is floorId, value is the Set/Grid for that floor
export const createWalkableGrids = (mapData: MapData): Map<string, Set<string>> => {
    const grids = new Map<string, Set<string>>();
    const { gridResolution } = mapData;

    mapData.floors.forEach(floor => {
        const walkable = new Set<string>();
        const { walls, pois } = floor;

        // Calculate Bounding Box of the actual building content
        let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;

        const updateBounds = (p: Point) => {
            minX = Math.min(minX, p.x);
            maxX = Math.max(maxX, p.x);
            minY = Math.min(minY, p.y);
            maxY = Math.max(maxY, p.y);
        };

        walls.forEach(w => {
            updateBounds(w.start);
            updateBounds(w.end);
        });

        pois.forEach(p => updateBounds(p.position));

        // Add padding
        const PADDING = 50;
        minX = Math.floor((minX - PADDING) / gridResolution) * gridResolution;
        maxX = Math.ceil((maxX + PADDING) / gridResolution) * gridResolution;
        minY = Math.floor((minY - PADDING) / gridResolution) * gridResolution;
        maxY = Math.ceil((maxY + PADDING) / gridResolution) * gridResolution;

        // Clamp to map dimensions
        minX = Math.max(0, minX);
        minY = Math.max(0, minY);
        maxX = Math.min(mapData.width, maxX);
        maxY = Math.min(mapData.height, maxY);


        for (let x = minX; x <= maxX; x += gridResolution) {
            for (let y = minY; y <= maxY; y += gridResolution) {
                const point = { x, y };
                let isInsideWall = false;

                // Simple collision check: if a point is too close to any wall line segment
                for (const wall of walls) {
                    const { start, end } = wall;
                    const distSq = (p1: Point, p2: Point) => (p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2;

                    const l2 = distSq(start, end);
                    if (l2 === 0) continue;

                    let t = ((point.x - start.x) * (end.x - start.x) + (point.y - start.y) * (end.y - start.y)) / l2;
                    t = Math.max(0, Math.min(1, t));

                    const projection = {
                        x: start.x + t * (end.x - start.x),
                        y: start.y + t * (end.y - start.y)
                    };

                    if (distSq(point, projection) < (gridResolution * 0.4) ** 2) {
                        isInsideWall = true;
                        break;
                    }
                }

                if (!isInsideWall) {
                    walkable.add(pointToKey(point));
                }
            }
        }
        grids.set(floor.id, walkable);
    });

    return grids;
};

// Path smoothing implementation
const smoothPath = (
    path: Point[],
    walls: Floor['walls'],
    resolution: number
): Point[] => {
    if (path.length <= 2) return path;

    const smoothedPath: Point[] = [path[0]];
    let pivot = path[0];

    let i = 1;
    while (i < path.length - 1) {
        if (!hasLineOfSight(pivot, path[i + 1], walls, resolution)) {
            pivot = path[i];
            smoothedPath.push(pivot);
        }
        i++;
    }

    smoothedPath.push(path[path.length - 1]);
    return smoothedPath;
};

// A* for a SINGLE floor
const findPathOnFloor = (
    start: Point,
    end: Point,
    floorId: string,
    mapData: MapData,
    walkableGrid: Set<string>
): Point[] | null => {
    const { gridResolution } = mapData;
    const floor = mapData.floors.find(f => f.id === floorId);
    if (!floor) return null;

    const snapToGrid = (p: Point): Point => ({
        x: Math.round(p.x / gridResolution) * gridResolution,
        y: Math.round(p.y / gridResolution) * gridResolution,
        floorId: floorId
    });

    const startNode = snapToGrid(start);
    const endNode = snapToGrid(end);
    const startKey = pointToKey(startNode);
    const endKey = pointToKey(endNode);

    if (!walkableGrid.has(startKey) || !walkableGrid.has(endKey)) {
        console.warn(`Points not walkable on floor ${floorId}`);
        return null; // Return null to signal failure
    }

    // A* Algorithm
    const openSet: Point[] = [startNode];
    const cameFrom = new Map<string, Point>();

    const gScore = new Map<string, number>();
    gScore.set(startKey, 0);

    const fScore = new Map<string, number>();
    fScore.set(startKey, heuristic(startNode, endNode));

    const openSetHash = new Set<string>();
    openSetHash.add(startKey);

    while (openSet.length > 0) {
        // Sort by fScore to simulate priority queue (can be optimized with a real MinHeap)
        openSet.sort((a, b) => {
            const fA = fScore.get(pointToKey(a)) ?? Infinity;
            const fB = fScore.get(pointToKey(b)) ?? Infinity;
            return fA - fB;
        });

        const current = openSet.shift()!;
        const currentKey = pointToKey(current);
        openSetHash.delete(currentKey);

        if (currentKey === endKey) {
            // Reconstruct path
            const path: Point[] = [current];
            let curr = current;
            while (cameFrom.has(pointToKey(curr))) {
                curr = cameFrom.get(pointToKey(curr))!;
                path.unshift(curr);
            }

            // Apply smoothing
            return smoothPath(path, floor.walls, gridResolution).map(p => ({ ...p, floorId }));
        }

        const neighbors = [
            { x: current.x + gridResolution, y: current.y },
            { x: current.x - gridResolution, y: current.y },
            { x: current.x, y: current.y + gridResolution },
            { x: current.x, y: current.y - gridResolution },
            // Diagonals for better initial paths (optional but good for A*)
            { x: current.x + gridResolution, y: current.y + gridResolution },
            { x: current.x + gridResolution, y: current.y - gridResolution },
            { x: current.x - gridResolution, y: current.y + gridResolution },
            { x: current.x - gridResolution, y: current.y - gridResolution },
        ];

        for (const neighbor of neighbors) {
            if (!isWalkable(neighbor, walkableGrid)) continue;

            const neighborKey = pointToKey(neighbor);
            const d = heuristic(current, neighbor);
            const tentativeGScore = (gScore.get(currentKey) ?? Infinity) + d;

            if (tentativeGScore < (gScore.get(neighborKey) ?? Infinity)) {
                cameFrom.set(neighborKey, current);
                gScore.set(neighborKey, tentativeGScore);
                fScore.set(neighborKey, tentativeGScore + heuristic(neighbor, endNode));

                if (!openSetHash.has(neighborKey)) {
                    openSet.push(neighbor);
                    openSetHash.add(neighborKey);
                }
            }
        }
    }

    return null; // No path found
}


export const findPath = (
    start: Point,
    end: Point,
    mapData: MapData,
    walkableGrids: Map<string, Set<string>>
): Point[] | null => {

    // 1. Same Floor
    if (start.floorId === end.floorId) {
        const grid = walkableGrids.get(start.floorId!);
        if (!grid) return null;
        return findPathOnFloor(start, end, start.floorId!, mapData, grid);
    }

    // 2. Different Floors
    // Find shared portals (elevators/stairs)
    const startFloor = mapData.floors.find(f => f.id === start.floorId);
    const endFloor = mapData.floors.find(f => f.id === end.floorId);
    if (!startFloor || !endFloor) return null;

    // Find elevators/stairs that exist on BOTH floors (matching by proximity or name/id conventions)
    // Convention: Portals have same X,Y roughly.
    // Let's filter POIs of type ELEVATOR/STAIRS

    const startPortals = startFloor.pois.filter(p => p.type === POIType.ELEVATOR || p.type === POIType.STAIRS);
    const endPortals = endFloor.pois.filter(p => p.type === POIType.ELEVATOR || p.type === POIType.STAIRS);

    let bestPath: Point[] | null = null;
    let minLength = Infinity;

    // naive check: just loop all portal pairs and check which are vertically aligned
    for (const p1 of startPortals) {
        for (const p2 of endPortals) {
            // Check if they are the "same" shaft (approx same X,Y)
            if (Math.abs(p1.position.x - p2.position.x) < 50 && Math.abs(p1.position.y - p2.position.y) < 50) {
                // Valid Connection
                const leg1 = findPathOnFloor(start, p1.position, start.floorId!, mapData, walkableGrids.get(start.floorId!)!);
                const leg2 = findPathOnFloor(p2.position, end, end.floorId!, mapData, walkableGrids.get(end.floorId!)!);

                if (leg1 && leg2) {
                    const totalLen = leg1.length + leg2.length; // Approximate, using node count not distance
                    if (totalLen < minLength) {
                        minLength = totalLen;
                        bestPath = [...leg1, ...leg2];
                    }
                }
            }
        }
    }

    return bestPath;
};


export const generateInstructions = (path: Point[], mapData: MapData): Instruction[] => {
    if (!path || path.length < 2) return [];

    const instructions: Instruction[] = [];

    // Track floor changes
    let currentFloorId = path[0].floorId;
    let floorPathSegment: Point[] = [];

    for (let i = 0; i < path.length; i++) {
        const pt = path[i];

        if (pt.floorId !== currentFloorId) {
            // Floor Change Detected!
            // Process the previous segment
            if (floorPathSegment.length > 0) {
                instructions.push(...generateFloorInstructions(floorPathSegment));
            }

            // Add Floor Change Instruction
            const newFloor = mapData.floors.find(f => f.id === pt.floorId)?.name || 'Unknown Floor';
            instructions.push({
                type: 'move',
                text: `Take elevator/stairs to ${newFloor}`,
                distance: 0
            });

            currentFloorId = pt.floorId;
            floorPathSegment = [pt];
        } else {
            floorPathSegment.push(pt);
        }
    }

    // Process final segment
    if (floorPathSegment.length > 0) {
        if (instructions.length > 0) {
            // Ensure the first point of the new segment connects well logically
            instructions.push(...generateFloorInstructions(floorPathSegment, true));
        } else {
            instructions.push(...generateFloorInstructions(floorPathSegment));
        }
    }

    instructions.push({
        type: 'arrival',
        text: 'You have arrived at your destination',
    });

    // Format the distances
    return instructions.map(inst => ({
        ...inst,
        text: inst.type === 'turn' ? inst.text : (inst.distance ? `${inst.text} for ${Math.round(inst.distance || 0)} feet` : inst.text)
    }));
};

const generateFloorInstructions = (path: Point[], isContinuation = false): Instruction[] => {
    if (path.length < 2 && !isContinuation) return [];

    const insts: Instruction[] = [];
    let currentSegmentDistance = 0;
    const getAngle = (p1: Point, p2: Point) => Math.atan2(p2.y - p1.y, p2.x - p1.x);

    // Initial instruction for this floor
    if (!isContinuation) {
        insts.push({ type: 'move', text: 'Head towards destination', distance: 0 });
    } else {
        insts.push({ type: 'move', text: 'Continue on this floor', distance: 0 });
    }

    for (let i = 0; i < path.length - 1; i++) {
        const p1 = path[i];
        const p2 = path[i + 1];
        const dist = heuristic(p1, p2);
        currentSegmentDistance += dist;

        if (insts.length > 0) {
            const last = insts[insts.length - 1];
            last.distance = (last.distance || 0) + dist;
        }

        if (i < path.length - 2) {
            const p3 = path[i + 2];
            const angle1 = getAngle(p1, p2);
            const angle2 = getAngle(p2, p3);

            let diff = (angle2 - angle1) * 180 / Math.PI;
            // Normalize to -180 to 180
            while (diff <= -180) diff += 360;
            while (diff > 180) diff -= 360;

            const TURN_THRESHOLD = 30; // degrees

            if (Math.abs(diff) > TURN_THRESHOLD) {
                // It's a turn
                const direction: Direction = diff > 0 ? 'right' : 'left';

                insts.push({
                    type: 'turn',
                    direction: direction,
                    text: `Turn ${direction} `,
                    distance: 0
                });
                currentSegmentDistance = 0;
            }
        }
    }

    return insts;
};