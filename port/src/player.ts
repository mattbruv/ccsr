import * as PIXI from "pixi.js";

export enum PlayerStatus {
  MOVE,
  TALK,
  READ,
  STOP,
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

  constructor() {
    this.sprite = new PIXI.Sprite();
    this.status = PlayerStatus.MOVE;
    this.speed = 8;
    this.animNum = 1;
    this.lastMove = 0;
    this.pocket = [];
  }

  public init() {
    this.sprite = PIXI.Sprite.from("player.normal.left.1.png");
  }
}
