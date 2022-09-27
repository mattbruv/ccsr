import * as PIXI from "pixi.js";
import { getMapOffset, getMapRect } from "./game";

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

export class Player {
  public sprite: PIXI.Sprite;
  public speed: number;
  public status: PlayerStatus;
  public animNum: number;
  public lastMove: number;
  public pocket: string[];
  public state: PlayerState;
  public direction: PlayerDirection;
  public frameOfAnimation: number;
  private posX: number;
  private posY: number;

  constructor() {
    this.sprite = new PIXI.Sprite();
    this.status = PlayerStatus.MOVE;
    this.speed = 8;
    this.animNum = 1;
    this.lastMove = 0;
    this.pocket = [];
    this.state = PlayerState.NORMAL;
    this.direction = PlayerDirection.RIGHT;
    this.frameOfAnimation = 1;

    this.posX = 0;
    this.posY = 0;
  }

  public init() {
    this.sprite = PIXI.Sprite.from(this.getTextureString());
    this.sprite.anchor.set(0.5, 0.5);
  }

  public setPosition(x: number, y: number) {
    this.posX = x;
    this.posY = y;
    this.sprite.position.set(this.posX, this.posY);
  }

  public setMapAndPosition(map: string, xIndex: number, yIndex: number) {
    // sprite(pSprite).loc = point(gPlayerStartLoc[1] * 16, gPlayerStartLoc[2] * 16)
    const offset = getMapRect(map);
    const x = xIndex * 16 + offset.x;
    const y = yIndex * 16 + offset.y;
    this.setPosition(x, y);
  }

  private getTextureString() {
    const normal = [this.state, this.direction, this.frameOfAnimation];
    const boat = [this.state, this.direction];
    const arr = this.state == PlayerState.NORMAL ? normal : boat;
    return arr.join(".") + ".png";
  }
}
