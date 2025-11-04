
export interface Point {
  x: number;
  y: number;
}

export enum POIType {
  DEPARTMENT = 'department',
  ENTRANCE = 'entrance',
  ELEVATOR = 'elevator',
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
}

export interface Wall {
  start: Point;
  end: Point;
}

export interface MapData {
  width: number;
  height: number;
  pois: POI[];
  walls: Wall[];
  gridResolution: number;
}
