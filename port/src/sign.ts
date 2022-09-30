import * as PIXI from "pixi.js";
import { Game, getMemberTexture } from "./game";
export class GameSign {
  private game: Game;
  private sprite: PIXI.Sprite | undefined;
  private textElement: HTMLParagraphElement;

  constructor(game: Game) {
    this.game = game;

    // Initialize and style the text HTML element
    this.textElement = document.createElement("p");
    this.textElement.textContent = "hello world ".repeat(100);
    this.textElement.style.position = "absolute";
    this.textElement.style.top = "0";
    this.textElement.style.left = "0";
    this.textElement.style.backgroundColor = "white";
    this.textElement.style.overflowY = "scroll";
    this.textElement.style.display = "none";
    this.textElement.style.border = "1px solid black";
    this.textElement.style.userSelect = "none";
    this.textElement.style.whiteSpace = "break-spaces"; // don't compress whitespace
    this.textElement.style.fontFamily = "arial";

    document.getElementById("game-container")?.appendChild(this.textElement);
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

    const scale = 1;
    this.sprite?.scale.set(scale, scale);

    this.textElement.style.fontSize = 100 * scale + "%";

    const boxWidth = 242 * scale;
    const boxHeight = 140 * scale;

    const halfWidth = this.sprite!.width / 2;
    const halfHeight = this.sprite!.height / 2;

    const leftAdjust = 30 * scale;
    const topAdjust = 30 * scale;

    const left = this.sprite!.position.x - halfWidth + leftAdjust;
    const top = this.sprite!.position.y - halfHeight + topAdjust;

    this.textElement.style.width = boxWidth + "px";
    this.textElement.style.height = boxHeight + "px";
    this.textElement.style.left = left + "px";
    this.textElement.style.top = top + "px";
    this.textElement.style.display = "block";
  }
}
