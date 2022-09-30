import * as PIXI from "pixi.js";
import { Game, getMemberTexture } from "./game";
export class GameSign {
  private game: Game;
  private sprite: PIXI.Sprite | undefined;
  constructor(game: Game) {
    this.game = game;
  }

  public init() {
    this.sprite = new PIXI.Sprite(getMemberTexture("sign.bkg"));
    this.sprite.anchor.set(0.5, 0.5);
    this.game.app.stage.addChild(this.sprite);
    this.resize();
  }

  public resize() {
    const width = this.game.app.renderer.screen.width;
    const height = this.game.app.renderer.screen.height;
    const x = Math.round(width / 2);
    const y = Math.round(height / 2);
    this.sprite?.position.set(x, y);
  }
}
