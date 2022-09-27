import * as PIXI from "pixi.js";

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
  }

  public init() {
    this.sprite = PIXI.Sprite.from(this.getTextureString());
  }

  private getTextureString() {
    const normal = [this.state, this.direction, this.frameOfAnimation];
    const boat = [this.state, this.direction];
    const arr = this.state == PlayerState.NORMAL ? normal : boat;
    return arr.join(".") + ".png";
  }
}
