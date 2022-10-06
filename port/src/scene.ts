import * as PIXI from "pixi.js";
import { Game } from "./game";

export abstract class GameScene {
  protected game: Game;

  public container = new PIXI.Container();

  constructor(game: Game) {
    this.game = game;
    this.container.visible = false;
  }

  public abstract init(): void;
  public abstract play(): void;
}
