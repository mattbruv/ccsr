import * as PIXI from "pixi.js";
import { Game } from "./game";
import { Pos } from "./types";

export interface MoveAnimation {
  sprite: PIXI.Sprite;
  from: Pos;
  to: Pos;
  startFrame: number;
  endFrame: number;
}

export interface FrameCallback {
  frame: number;
  callback: () => void;
}

export abstract class GameScene {
  protected game: Game;

  protected moveAnims: MoveAnimation[];
  protected frameCallbacks: FrameCallback[];

  protected currentFrame = 0;

  public readonly frameRate = 1000 / 12;
  public lastUpdate = 0;

  protected playing = false;

  public container = new PIXI.Container();

  constructor(game: Game) {
    this.game = game;
    this.container.visible = false;
    this.moveAnims = [];
    this.frameCallbacks = [];
  }

  public isPlaying(): boolean {
    return this.playing;
  }

  public stopPlaying() {
    this.playing = false;
  }

  public tick(timeNow: number) {
    const anims = this.moveAnims.filter(
      (anim) =>
        this.currentFrame >= anim.startFrame &&
        this.currentFrame < anim.endFrame
    );

    anims.map((anim) => {
      const now = timeNow - this.lastUpdate;
      const p = now / this.frameRate;
      const animDeltaX = anim.to.x - anim.from.x;
      const animDeltaY = anim.to.y - anim.from.y;
      const totalFrames = anim.endFrame - anim.startFrame;
      const distX = animDeltaX / totalFrames;
      const distY = animDeltaY / totalFrames;
      const origX = anim.from.x + distX * (this.currentFrame - anim.startFrame);
      const origY = anim.from.y + distY * (this.currentFrame - anim.startFrame);
      const dx = distX * p;
      const dy = distY * p;
      const x = origX + dx;
      const y = origY + dy;
      anim.sprite.position.set(x, y);
    });
  }

  public nextFrame(timeNow: number) {
    this.lastUpdate = timeNow;
    this.currentFrame++;

    // set any animated stuff to their current position
    const anims = this.moveAnims.filter(
      (anim) =>
        this.currentFrame >= anim.startFrame &&
        this.currentFrame <= anim.endFrame
    );

    anims.map((anim) => {
      const p =
        (this.currentFrame - anim.startFrame) /
        (anim.endFrame - anim.startFrame);
      const dx = (anim.to.x - anim.from.x) * p;
      const dy = (anim.to.y - anim.from.y) * p;
      const x = anim.from.x + dx;
      const y = anim.from.y + dy;
      anim.sprite.position.set(x, y);
    });

    // Call any callbacks for this specific frame
    this.frameCallbacks
      .filter((cb) => cb.frame === this.currentFrame)
      .map((cb) => {
        cb.callback();
      });

    this.onFrame();
  }

  public abstract init(): void;
  public abstract play(): void;
  public abstract exit(): void;
  protected abstract onFrame(): void;
}
