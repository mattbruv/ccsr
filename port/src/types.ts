export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface GameMapArea {
  name: string;
  roomID: number;
  roomStatus: number;
  data: IGameObject[];
}

export enum GameObjectType {
  FLOR = "FLOR",
  WALL = "WALL",
  CHAR = "char",
  ITEM = "item",
  DOOR = "DOOR",
  WATER = "WATER",
}

export interface IGameObject {
  member: string;
  type: GameObjectType;
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
  message: GameObjectMessage[];
}

export interface GameObjectMessage {
  plrAct: string;
  plrObj: string;
  text: string;
}

export interface GameObjectItem {
  name: string;
  type: GameObjectType;
  visi: GameObjectVisibility;
  COND: (GameObjectCond | null)[];
}

export interface GameObjectCond {
  hasObj: string;
  hasAct: string;
  giveObj: string;
  giveAct: string;
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
