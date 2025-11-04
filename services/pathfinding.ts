import { Point, MapData } from '../types';

// Helper to create a unique key for a point
const pointToKey = (p: Point): string => `${p.x},${p.y}`;

// Check if a point is walkable (not inside a wall)
const isWalkable = (p: Point, mapData: MapData, walkableGrid: Set<string>): boolean => {
  return walkableGrid.has(pointToKey(p));
};

export const createWalkableGrid = (mapData: MapData): Set<string> => {
    const walkable = new Set<string>();
    const { width, height, walls, gridResolution } = mapData;

    for (let x = 0; x < width; x += gridResolution) {
        for (let y = 0; y < height; y += gridResolution) {
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
    return walkable;
};


export const findPath = (
  start: Point,
  end: Point,
  mapData: MapData,
  walkableGrid: Set<string>
): Point[] | null => {
  const { gridResolution } = mapData;

  const snapToGrid = (p: Point): Point => ({
    x: Math.round(p.x / gridResolution) * gridResolution,
    y: Math.round(p.y / gridResolution) * gridResolution,
  });

  const startNode = snapToGrid(start);
  const endNode = snapToGrid(end);

  const startKey = pointToKey(startNode);
  const endKey = pointToKey(endNode);

  if (!walkableGrid.has(startKey) || !walkableGrid.has(endKey)) {
    console.warn('Start or end point is not on a walkable path.');
    return null;
  }

  const queue: Point[] = [startNode];
  const visited = new Set<string>([startKey]);
  const parentMap = new Map<string, Point>();

  while (queue.length > 0) {
    const current = queue.shift()!;
    const currentKey = pointToKey(current);

    if (currentKey === endKey) {
      // Reconstruct path
      const path: Point[] = [];
      let crawl: Point | undefined = endNode;
      while (crawl) {
        path.unshift(crawl);
        crawl = parentMap.get(pointToKey(crawl));
      }
      return path;
    }

    const neighbors = [
      { x: current.x + gridResolution, y: current.y },
      { x: current.x - gridResolution, y: current.y },
      { x: current.x, y: current.y + gridResolution },
      { x: current.x, y: current.y - gridResolution },
    ];

    for (const neighbor of neighbors) {
      const neighborKey = pointToKey(neighbor);
      if (
        isWalkable(neighbor, mapData, walkableGrid) &&
        !visited.has(neighborKey)
      ) {
        visited.add(neighborKey);
        parentMap.set(neighborKey, current);
        queue.push(neighbor);
      }
    }
  }

  return null; // No path found
};