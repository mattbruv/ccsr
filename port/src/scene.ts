import * as PIXI from "pixi.js";
import { Game } from "./game";

export interface MoveAnimation {
  sprite: PIXI.Sprite;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  startFrame: number;
  endFrame: number;
}

export abstract class GameScene {
  protected game: Game;

  protected moveAnims: Animation[];

  public container = new PIXI.Container();

  constructor(game: Game) {
    this.game = game;
    this.container.visible = false;
    this.moveAnims = [];
  }

  public abstract init(): void;
  public abstract play(): void;
}
