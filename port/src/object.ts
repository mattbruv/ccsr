import * as PIXI from "pixi.js";
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

  public sprite: PIXI.Sprite;

  constructor(obj: IGameObject, mapName: string) {
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

    this.sprite = new PIXI.Sprite(getMemberTexture(this.member)!);

    const offsetX = this.mapOffsetX * 32 * 13;
    const offsetY = this.mapOffsetY * 32 * 10;
    this.sprite.position.x = this.location[0] * 16 + this.WSHIFT + offsetX;
    this.sprite.position.y = this.location[1] * 16 + this.HSHIFT + offsetY;

    if (this.member.includes("tile") === false) {
      this.sprite.position.x -= Math.round(this.width / 2);
      this.sprite.position.y -= Math.round(this.height / 2);
      //console.log(this.member);
      //this.sprite.anchor.set(0.5, 0.5);
    }

    this.sprite.width = this.width;
    this.sprite.height = this.height;
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

function getMemberTexture(memberName: string) {
  let name = memberName;
  name = name + ".png";
  name = name.replace(".x.", ".");
  return PIXI.Loader.shared.resources["textures1"].spritesheet?.textures[name];
}
