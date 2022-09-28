import * as PIXI from "pixi.js";
import { getMapRect } from "./game";

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
  public horizontalDirection: PlayerDirection;
  public characterDirection: PlayerDirection;
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

  public setPosition(x: number, y: number) {
    this.posX = x;
    this.posY = y;
    this.sprite.position.set(this.posX, this.posY);
  }

  public getPosition() {
    return {
      x: this.posX,
      y: this.posY,
    };
  }

  public setMapAndPosition(map: string, xIndex: number, yIndex: number) {
    const offset = getMapRect(map);
    const x = xIndex * 16 + offset.x;
    const y = yIndex * 16 + offset.y;
    this.setPosition(x, y);
  }

  public refreshTexture() {
    const texStr = this.getTextureString();
    const texture =
      PIXI.Loader.shared.resources["textures"].spritesheet?.textures[texStr]!;
    this.sprite.texture = texture;
    this.sprite.texture.update();
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
