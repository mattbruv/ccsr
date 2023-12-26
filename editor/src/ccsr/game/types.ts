type MapData = (MapMetadata | MapObject)[];

enum MapDataType {
  Metadata,
  Object,
}

/**
 * I don't think this is used in the actual game for anything
 */
type MapMetadata = {
  dataType: MapDataType.Metadata;

  roomid: string;
  roomStatus: number;
};

/**
 * Represents some object in the game world
 */
type MapObject = {
  dataType: MapDataType.Object;

  /** The name of the texture to use for this object */
  member: string;

  /** The type of game object */
  type: string;

  /** X, Y starting offset of this object within the map */
  location: MapObjectLocation;

  /** The width in pixels of this game object */
  width: number;

  /** The X-offset shift amount */
  WSHIFT: number;

  /** The height in piexels of this game object */
  height: number;

  /** The Y-offset shift amount */
  HSHIFT: number;

  /** Data related to this game object */
  data: MapObjectData;
};

type MapObjectLocation = {
  x: number;
  y: number;
};

type MapObjectData = {
  item: MapObjectItem;
  move: MapObjectMove;
  message: MapObjectMessage[];
};

type MapObjectItem = {
  name: string;
  type: string;
  visi: MapObjectVisibility;
  COND: MapObjectCond;
};

type MapObjectMove = {
  U: number;
  d: number;
  L: number;
  R: number;
  COND: number;
  TIMEA: number;
  TIMEB: number;
};

type MapObjectMessage = {
  text: string;
  plrObj: string;
  plrAct: string;
};

type MapObjectVisibility = {
  visiObj: string;
  visiAct: string;
  inviObj: string;
  inviAct: string;
};

type MapObjectCond = string[];
