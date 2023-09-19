import * as PIXI from "pixi.js";
import { CameraMode } from "./camera";
import { EngineType, Game, getMapRect, getMemberTexture } from "./game";
import { MovableGameObject, Pos, Rect } from "./types";
import { intersect, rectAinRectB } from "./collision";

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
  public scooby: PIXI.Sprite;

  public speed: number;
  public status: PlayerStatus;
  public animNum: number;
  public lastMove: number;
  public state: PlayerState;
  public horizontalDirection: PlayerDirection;
  public characterDirection: PlayerDirection;
  public scoobyDirection: PlayerDirection;
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
    this.scooby = new PIXI.Sprite();
    this.status = PlayerStatus.MOVE;
    this.speed = 8;
    this.animNum = 1;
    this.lastMove = 0;
    this.state = PlayerState.NORMAL;
    this.horizontalDirection = PlayerDirection.RIGHT;
    this.characterDirection = PlayerDirection.RIGHT;
    this.scoobyDirection = PlayerDirection.RIGHT;
    this.frameOfAnimation = 1;

    this.posX = 0;
    this.posY = 0;

  }

  public init() {
    this.sprite = PIXI.Sprite.from(this.getTextureString());
    this.sprite.anchor.set(0.5, 0.5);

    if (this.game.engineType === EngineType.Scooby) {
      this.scooby.texture = getMemberTexture("scooby.down.1")!;
      this.scooby.anchor.set(0.5)
      this.scooby.position.set(this.posX, this.posY)
    }
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

    // Only CCSR has footstep sounds
    if (this.game.engineType === EngineType.CCSR) {
      this.game.sound.boat.pause();
      this.game.sound.walk.pause();

      if (this.state == PlayerState.BOAT) {
        this.game.sound.boat.play();
      } else {
        this.game.sound.walk.play();
      }
    }
  }

  public endMove() {
    this.inWalkingAnimation = false;
    this.setPosition(this.nextPos.x, this.nextPos.y);

    if (this.game.camera.getMode() == CameraMode.CENTER_ON_PLAYER) {
      this.game.camera.centerCameraOnPlayer();
    }

    if (this.game.engineType === EngineType.Scooby) {
      this.updateScooby();
    }

    this.game.sound.walk.pause();
    this.game.sound.boat.pause();
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

    if (this.game.engineType === EngineType.Scooby) {
      this.scooby.position.set(this.posX, this.posY)
    }
  }

  private isPerpendicular(dir: PlayerDirection) {
    // console.log("scoob: ", this.scoobyDirection, "shag: ", dir)
    switch (this.scoobyDirection) {
      case PlayerDirection.UP:
      case PlayerDirection.DOWN:
        {
          return [PlayerDirection.LEFT, PlayerDirection.RIGHT].includes(dir);
        }
      case PlayerDirection.LEFT:
      case PlayerDirection.RIGHT:
        {
          return [PlayerDirection.UP, PlayerDirection.DOWN].includes(dir);
        }
      default: return false;
    }

  }

  private getScoobyOffset(thisDir: PlayerDirection, isPerpendicular: boolean): Pos {

    type scoobyOffset = "left" | "top" | "right" | "bottom" |
      "pLeft" | "pTop" | "pRight" | "pBottom";

    /*
      the Y offsets used to be +/-17 instead of 16,
      but this caused a bug in the conditional in a different function,
      causing it to be off by one and make scooby alternate between up/down
      when walking sideways. Changing the Y value fixes this issue.
      This whole scooby code is a giant dumpster fire anyway,
      but we want to support those games and they aren't coming out with more,
      so who cares
    */
    const scoobyOffsetList: { [key in scoobyOffset]: Pos } = {
      left: { x: 48, y: 16 },
      top: { x: 0, y: 60 },
      right: { x: -48, y: 16 },
      bottom: { x: 0, y: -60 },
      pLeft: { x: 48, y: 16 },
      pTop: { x: 0, y: 0 },
      pRight: { x: -48, y: 16 },
      pBottom: { x: 0, y: 0 }
    };

    if (!isPerpendicular) {
      switch (thisDir) {
        case PlayerDirection.LEFT: return scoobyOffsetList.left;
        case PlayerDirection.UP: return scoobyOffsetList.top;
        case PlayerDirection.RIGHT: return scoobyOffsetList.right;
        case PlayerDirection.DOWN: return scoobyOffsetList.bottom;
      }
    }
    else {
      switch (thisDir) {
        case PlayerDirection.LEFT: return scoobyOffsetList.pLeft;
        case PlayerDirection.UP: return scoobyOffsetList.pTop;
        case PlayerDirection.RIGHT: return scoobyOffsetList.pRight;
        case PlayerDirection.DOWN: return scoobyOffsetList.pBottom;
      }
    }
  }

  private scoobyCanMove(thisRect: Rect): boolean {
    const scoob = this.scooby.position;
    const scoobRect = this.getCollisionRectAtPoint(scoob.x, scoob.y);
    return !intersect(scoobRect, thisRect);
  }

  private scoobyGetDelta(shaggyLoc: Pos, thisOffset: Pos): Pos {
    const thisDelta: Pos = { x: 0, y: 0 }
    const thisUnit = 8;
    const thisLoc: Pos = { x: shaggyLoc.x + thisOffset.x, y: shaggyLoc.y + thisOffset.y };
    const myLoc: Pos = { x: this.scooby.position.x, y: this.scooby.position.y }

    // console.log("getDelta thisLoc", thisLoc, "myLoc", myLoc)

    if (myLoc.x < thisLoc.x) {
      thisDelta.x += thisUnit;
    }
    else {
      if (myLoc.x > thisLoc.x) {
        thisDelta.x -= thisUnit;
      }
      else {
        thisDelta.x = 0;
      }
    }

    if (myLoc.y > thisLoc.y) {
      thisDelta.y -= thisUnit;
    }
    else {
      if (myLoc.y < thisLoc.y) {
        thisDelta.y += thisUnit;
      }
      else {
        thisDelta.y = 0;
      }
    }

    return thisDelta;
  }

  private scoobyGetDir(delta: Pos): PlayerDirection | null {
    if (delta.y > 0)
      return PlayerDirection.DOWN
    if (delta.y < 0)
      return PlayerDirection.UP
    if (delta.x > 0)
      return PlayerDirection.RIGHT
    if (delta.x < 0)
      return PlayerDirection.LEFT
    return null;
  }

  public updateScooby() {

    const thisLoc: Pos = this.nextPos;
    const thisDir = this.characterDirection;
    const thisFrame = this.frameOfAnimation;
    const thisSpeed = this.speed;
    let thisRect = this.getCollisionRectAtPoint(thisLoc.x, thisLoc.y);

    const isPerpendicular = this.isPerpendicular(thisDir);
    const thisOffset = this.getScoobyOffset(thisDir, isPerpendicular);
    // console.log("\n scooby dir:", this.scoobyDirection)
    // console.log("chardir: ", this.characterDirection, "is perp:", isPerpendicular)
    // console.log("offset", thisOffset)

    // If scooby's collision rectangle isn't in the players, move him
    if (this.scoobyCanMove(thisRect)) {
      // console.log("thisLoc: ", thisLoc)
      const thisDelta = this.scoobyGetDelta(thisLoc, thisOffset);
      const scooby = this.scooby.position;
      const newLoc: Pos = { x: scooby.x + thisDelta.x, y: this.scooby.y + thisDelta.y };
      // console.log("delta:", thisDelta)
      thisRect = this.getCollisionRectAtPoint(newLoc.x + thisDelta.x, newLoc.y + thisDelta.y);
      const newDir = this.scoobyGetDir(thisDelta);
      if (newDir !== null) {
        this.scoobyDirection = newDir;
        this.scooby.texture = this.getScoobyTexture(newDir, thisFrame)!;
        this.scooby.position.x += thisDelta.x;
        this.scooby.position.y += thisDelta.y;
      }
    }
    else {
      // sprite(me.spriteNum).locZ = me.spriteNum
      // me.pDelta = thisSpeed
    }
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
    const w = Math.min(32, this.sprite.width);
    const h = Math.min(32, this.sprite.height);
    const result = {
      x: x - Math.round(w / 2) + padding,
      y: y - Math.round(h / 2) + padding,
      width: w - padding * 2,
      height: h - padding * 2,
    };

    if (this.game.engineType === EngineType.Scooby) {
      result.x -= padding;
      result.y -= padding;
      result.width = w;
      result.height = h;

      // move to bottom half of 64 height sprite
      result.y += 16;
    };

    return result;
  }

  public getAnimationFrameCount(): number {
    return (this.game.engineType === EngineType.Scooby) ? 3 : 2
  }

  private getScoobyTexture(thisDir: PlayerDirection, thisFrame: number) {
    const textureString = `scooby.${thisDir}.${thisFrame}`;
    // console.log(textureString);
    return getMemberTexture(textureString);

  }

  private getTextureString() {
    const normal = [
      this.state,
      this.horizontalDirection,
      this.frameOfAnimation,
    ];
    const boat = [this.state, this.characterDirection];
    const arr = this.state == PlayerState.NORMAL ? normal : boat;

    if (this.game.engineType === EngineType.Scooby) {
      const shaggyState = [this.state, this.characterDirection, this.frameOfAnimation];
      return shaggyState.join(".") + ".png";
    }

    return arr.join(".") + ".png";
  }
}
