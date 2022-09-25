export interface GameObject {
  member: string;
  type: string;
  location: number[];
  width: number;
  height: number;
  WSHIFT: number;
  HSHIFT: number;
  data: GameObjectData;
}

export interface GameObjectData {
  item: GameObjectItem;
  move: GameObjectMove;
  message: string[];
}

export interface GameObjectItem {
  name: string;
  type: string;
  visi: GameObjectVisibility;
  COND: string[];
}

export interface GameObjectMove {
  U: number;
  D: number;
  L: number;
  R: number;
  COND: number;
  TIMEA: number;
  TIMEB: number;
}

export interface GameObjectVisibility {
  visiObj: string;
  visiAct: string;
  inviObj: string;
  inviAct: string;
}
