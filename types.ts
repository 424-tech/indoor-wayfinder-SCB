

export interface Point {
  x: number;
  y: number;
  floorId?: string; // Optional for backward compat during migration, but will be used
}

export enum POIType {
  DEPARTMENT = 'department',
  ENTRANCE = 'entrance',
  ELEVATOR = 'elevator',
  STAIRS = 'stairs',
  RESTROOM = 'restroom',
  CAFE = 'cafe',
  INFO = 'info',
  PHARMACY = 'pharmacy',
  WARDS = 'wards',
  THEATRE = 'theatre',
}

export interface POI {
  id: string;
  name: string;
  position: Point;
  type?: POIType;
  floorId: string;
}

export interface Wall {
  start: Point;
  end: Point;
  floorId: string;
}

export interface Floor {
  id: string;
  name: string;
  level: number;
  pois: POI[];
  walls: Wall[];
}

export interface MapData {
  width: number;
  height: number;
  floors: Floor[];
  gridResolution: number;
}

export type Direction = 'forward' | 'left' | 'right' | 'backward';

export interface Instruction {
  type: 'turn' | 'move' | 'arrival';
  direction?: Direction;
  distance?: number;
  text: string;
}
