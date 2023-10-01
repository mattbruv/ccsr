import * as PIXI from "pixi.js";
import { TilingSprite } from "pixi.js";
import { getMapOffset, getMemberTexture } from "./game";
import {
  GameObjectData,
  GameObjectMoveCond,
  GameObjectType,
  IGameObject,
  MovableGameObject,
  Pos,
  Rect,
} from "./types";

export const MOVE_DIRECTIONS: [number, number][] = [
  [0, -1],
  [-1, 0],
  [0, 1],
  [1, 0],
];

/**
 * Generic class for a game Object.
 *
 * Every object in a game shares common properties,
 * whether they are used or not, the structure
 * of every object in the game is the same.
 */
export class GameObject implements IGameObject, MovableGameObject {
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

  public readonly originalPosX: number;
  public readonly originalPosY: number;

  private visible = true;

  public sprite: PIXI.Sprite;
  public speed: number = 8;
  public inWalkingAnimation: boolean = false;
  public walkAnimStartMS: number = 0;
  public lastPos: Pos;
  public nextPos: Pos;

  public moveDirection = -1;
  public movePos: Pos = { x: 0, y: 0 };

  /*
    Some objects in the original game were "Film Loops"
    which is just a keyframed animation wrapped up in a cast member.
    We can mimic this behavior by telling the game which objects
    are animated on startup, and what their animation frames are,
    and have the engine update the textures of those every frame.
  */
  public frame = 0;
  public frameIndex = 0;
  public isFrameObject = false;

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

    const offsetX = this.mapOffsetX * 32 * 13;
    const offsetY = this.mapOffsetY * 32 * 10;
    this.posX = this.location[0] * 16 + offsetX + this.WSHIFT;
    this.posY = this.location[1] * 16 + offsetY + this.HSHIFT;

    if (this.member.includes("tile") === false) {
      this.posX -= Math.round(this.width / 2);
      this.posY -= Math.round(this.height / 2);
    }

    // HACK to fix broken floor tile in hotel in episodes 2, 3, and 4
    // It spans across map boundaries.
    // In the original game this probably was cut off or didn't render at all,
    // but in the remake where everything is rendered at once, this bad tile
    // causes problems visually and breaks map collision detection
    // So let's just shove it down one tile's space so it is fully in its map
    if (this.posX == 2608 && this.posY == 1248 && this.member == "block.119") {
      this.posY += 32;
    }

    this.originalPosX = this.posX;
    this.originalPosY = this.posY;

    this.lastPos = { x: this.originalPosX, y: this.originalPosY };
    this.nextPos = this.lastPos;
    this.movePos = this.lastPos;

    const objTexture = getMemberTexture(this.member)!;

    // make  this object a tiling sprite if it includes "tile"
    // and the width/height is bigger than the texture
    const tileRepeat = this.member.toLowerCase().includes("tile")

    this.sprite =
      tileRepeat // && this.isStatic()
        ? new PIXI.TilingSprite(getMemberTexture(this.member)!)
        : new PIXI.Sprite(getMemberTexture(this.member)!);

    // HACK to fix ocean walls on the north eastern side
    // of the maps in episodes 2-4
    // they spill over into other levels, so they need to be adjusted
    if (
      this.member.includes("tile.1.x") &&
      this.data.item.type == GameObjectType.WALL
    ) {
      const tile = this.sprite as TilingSprite;
      if (tile.tilePosition) {
        tile.x -= 16;
        this.width = 16;
      }
    }

    this.sprite.position.set(this.posX, this.posY);
    this.sprite.width = this.width;
    this.sprite.height = this.height;
  }

  public initMove(fromPos: Pos, toPos: Pos) {
    this.inWalkingAnimation = true;
    this.lastPos = fromPos;
    this.nextPos = toPos;
    this.walkAnimStartMS = Date.now();
  }
  public endMove() {
    this.inWalkingAnimation = false;
    this.setPosition(this.nextPos.x, this.nextPos.y);
  }

  public getMoveBounds(): Rect {
    // bounds for each side seem to be taken from
    // the edge of the sprite + n * 16
    // where n is the move number
    const move = this.data.move;

    const t = 16;

    const top = this.originalPosY - move.U * t;
    const bottom = this.originalPosY + this.height + move.D * t;

    const left = this.originalPosX - move.L * t;
    const right = this.originalPosX + this.width + move.R * t;

    const bounds: Rect = {
      x: left,
      y: top,
      height: bottom - top,
      width: right - left,
    };

    return bounds;
  }

  public isVisible() {
    return this.visible;
  }

  public setVisible(isVisible: boolean) {
    this.visible = isVisible;
    this.sprite.visible = isVisible;
  }

  public setPosition(x: number, y: number) {
    this.posX = x;
    this.posY = y;
    this.sprite.position.set(x, y);
  }

  public getRect(): Rect {
    return {
      x: this.posX,
      y: this.posY,
      width: this.width,
      height: this.height,
    };
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

    if (this.data.move.COND !== GameObjectMoveCond.NONE) {
      return false;
    }

    if (Object.values(this.data.item.visi).join("") !== "") {
      return false;
    }

    if (this.isFrameObject) {
      return false;
    }

    return true;
  }
}
