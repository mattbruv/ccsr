export enum Key {
  UP = "ArrowUp",
  DOWN = "ArrowDown",
  LEFT = "ArrowLeft",
  RIGHT = "ArrowRight",
  ENTER = "Enter",
  W = "w",
  A = "a",
  S = "s",
  D = "d",
}

export interface MovableGameObject {
  setPosition(x: number, y: number): void;
  initMove(fromPos: Pos, toPos: Pos): void;
  endMove(): void;
  speed: number;
  inWalkingAnimation: boolean;
  walkAnimStartMS: number;
  lastPos: Pos;
  nextPos: Pos;
}

export interface Pos {
  x: number;
  y: number;
}

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
  COND: GameObjectMoveCond;
  TIMEA: number;
  TIMEB: number;
}

export enum GameObjectMoveCond {
  NONE = 1,
  AUTO,
  PUSH,
  // The following conditions are in the engine but are not implemented
  // and are not present in the map data
  // PULL
  // MOVEX
  // MOVEY
}

export interface GameObjectVisibility {
  visiObj: string;
  visiAct: string;
  inviObj: string;
  inviAct: string;
}
