import * as PIXI from "pixi.js";
import { Game, getMapRect } from "./game";
import { MovableGameObject, Pos, Rect } from "./types";

export enum PlayerStatus {
  MOVE,
  TALK,
  READ,
  STOP,
}

export enum PlayerState {
  NORMAL = "player.normal",
  BOAT = "player.boat",
}

export enum PlayerDirection {
  LEFT = "left",
  RIGHT = "right",
  UP = "up",
  DOWN = "down",
}

export class Player implements MovableGameObject {
  private game: Game;

  public sprite: PIXI.Sprite;
  public speed: number;
  public status: PlayerStatus;
  public animNum: number;
  public lastMove: number;
  public state: PlayerState;
  public horizontalDirection: PlayerDirection;
  public characterDirection: PlayerDirection;
  public frameOfAnimation: number;
  private posX: number;
  private posY: number;

  public currentMap: string = "";
  public lastMap: string = "0101";

  public inWalkingAnimation: boolean = false;
  public walkAnimStartMS: number = 0;
  public lastPos: Pos = { x: 0, y: 0 };
  public nextPos: Pos = { x: 0, y: 0 };

  constructor(game: Game) {
    this.game = game;
    this.sprite = new PIXI.Sprite();
    this.status = PlayerStatus.MOVE;
    this.speed = 8;
    this.animNum = 1;
    this.lastMove = 0;
    this.state = PlayerState.NORMAL;
    this.horizontalDirection = PlayerDirection.RIGHT;
    this.characterDirection = PlayerDirection.RIGHT;
    this.frameOfAnimation = 1;

    this.posX = 0;
    this.posY = 0;
  }

  public init() {
    this.sprite = PIXI.Sprite.from(this.getTextureString());
    this.sprite.anchor.set(0.5, 0.5);
  }

  public setStatus(status: PlayerStatus) {
    this.status = status;

    if (this.status == PlayerStatus.MOVE) {
      this.game.updateAllVisibility();
    }
  }

  public setPosition(x: number, y: number) {
    this.posX = x;
    this.posY = y;
    this.sprite.position.set(this.posX, this.posY);
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

  public getPosition(): Pos {
    return {
      x: this.posX,
      y: this.posY,
    };
  }

  public setMapAndPosition(map: string, xIndex: number, yIndex: number) {
    this.lastMap = this.currentMap;
    this.currentMap = map;
    const offset = getMapRect(map);
    const x = xIndex * 16 + offset.x;
    const y = yIndex * 16 + offset.y;
    this.setPosition(x, y);
    this.inWalkingAnimation = false;
    this.lastPos = { x, y };
    this.nextPos = { x, y };
  }

  public refreshTexture() {
    const texStr = this.getTextureString();
    const texture =
      PIXI.Loader.shared.resources["textures"].spritesheet?.textures[texStr]!;
    this.sprite.texture = texture;
    this.sprite.texture.update();
  }

  public getCollisionRectAtPoint(x: number, y: number): Rect {
    const padding = 2;
    return {
      x: x - Math.round(this.sprite.width / 2) + padding,
      y: y - Math.round(this.sprite.height / 2) + padding,
      width: this.sprite.width - padding * 2,
      height: this.sprite.height - padding * 2,
    };
  }

  private getTextureString() {
    const normal = [
      this.state,
      this.horizontalDirection,
      this.frameOfAnimation,
    ];
    const boat = [this.state, this.characterDirection];
    const arr = this.state == PlayerState.NORMAL ? normal : boat;
    return arr.join(".") + ".png";
  }
}
