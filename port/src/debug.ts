import * as PIXI from "pixi.js";
import { Game } from "./game";
import { Rect } from "./types";

export class Debugger {
  private game: Game;
  private g: PIXI.Graphics;

  constructor(game: Game) {
    this.game = game;
    this.g = new PIXI.Graphics();
  }

  public init() {
    this.game.viewport.addChild(this.g);
  }

  public drawCollision(posCurr: Rect, posNew: Rect, obj: Rect) {
    this.clearGraphics();
    this.drawRect(posCurr, {
      width: 1,
      color: 0x00ff00,
      alignment: 0,
    });
    this.drawRect(posNew, {
      width: 1,
      color: 0xffff00,
      alignment: 0,
    });
    this.drawRect(obj, { width: 1, color: 0xff0000, alignment: 0 });
    console.log("Player attempted to walk in rect:", posNew);
    console.log("But hit: ", obj);
  }

  public drawRect(rect: Rect, options?: PIXI.ILineStyleOptions) {
    this.g.lineStyle(options);
    this.g.drawRect(rect.x, rect.y, rect.width, rect.height);
  }

  public clearGraphics() {
    this.g.clear();
  }
}
