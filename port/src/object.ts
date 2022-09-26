import * as PIXI from "pixi.js";
import { getMemberTexture } from "./game";
import { GameObjectData, GameObjectType, IGameObject } from "./types";

/**
 * Generic class for a game Object.
 *
 * Every object in a game shares common properties,
 * whether they are used or not, the structure
 * of every object in the game is the same.
 */
export class GameObject implements IGameObject {
  member: string;
  type: GameObjectType;
  location: number[];
  width: number;
  height: number;
  WSHIFT: number;
  HSHIFT: number;
  data: GameObjectData;

  readonly mapName: string;
  readonly mapOffsetX: number;
  readonly mapOffsetY: number;

  public posX: number;
  public posY: number;

  public sprite: PIXI.Sprite;

  constructor(obj: IGameObject, mapName: string) {
    console.log(obj);
    this.member = obj.member.toLowerCase();
    this.type = obj.type;
    this.location = obj.location;
    this.width = obj.width;
    this.height = obj.height;
    this.WSHIFT = obj.WSHIFT;
    this.HSHIFT = obj.HSHIFT;
    this.data = obj.data;

    this.mapName = mapName;
    const offset = getMapOffset(this.mapName);
    this.mapOffsetX = offset.x;
    this.mapOffsetY = offset.y;

    const offsetX = this.mapOffsetX * 32 * 13;
    const offsetY = this.mapOffsetY * 32 * 10;
    this.posX = this.location[0] * 16 + offsetX + this.WSHIFT;
    this.posY = this.location[1] * 16 + offsetY + this.HSHIFT;

    if (this.member.includes("tile") === false) {
      this.posX -= Math.round(this.width / 2);
      this.posY -= Math.round(this.height / 2);
    }

    this.sprite = this.isStatic()
      ? new PIXI.TilingSprite(getMemberTexture(this.member)!)
      : new PIXI.Sprite(getMemberTexture(this.member)!);

    this.sprite.position.set(this.posX, this.posY);
    this.sprite.width = this.width;
    this.sprite.height = this.height;
  }

  /**
   * Determines if the game object will ever move or not.
   * Only dynamic objects will be added to the PIXI scene graph.
   * Having thousands of objects in the scene graph which never
   * update just slows down the rendering and adds unnecessary work.
   *
   * @returns true if the game object will ever move or disappear
   */
  public isStatic() {
    // Always include these types of objects' sprites in the scene
    const dynamicTypes = [
      GameObjectType.CHAR, // characters
      GameObjectType.ITEM, // items
    ];

    if (dynamicTypes.includes(this.data.item.type)) {
      return false;
    }

    if (this.data.move.COND !== 1) {
      return false;
    }

    // TODO: vis objects

    return true;
  }
}

/*
    Maps are laid out in a grid pattern, and named XXYY
    X increases left to right, starting at 01
    Y increases top to bottom, starting at 01.
*/
function getMapOffset(mapName: string) {
  const xIndex = mapName.substring(0, 2);
  const yIndex = mapName.substring(2, 4);

  // Subtract 1 to convert to zero based indexing.
  return {
    x: parseInt(xIndex) - 1,
    y: parseInt(yIndex) - 1,
  };
}
