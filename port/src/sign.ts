import * as PIXI from "pixi.js";
import { Game, getMemberTexture } from "./game";
export class GameSign {
  private game: Game;
  private sprite: PIXI.Sprite | undefined;
  private textElement: HTMLParagraphElement;

  private adaptiveScale: boolean = false;
  private originalHeight: number = 0;
  private originalWidth: number = 0;

  constructor(game: Game) {
    this.game = game;

    // Initialize and style the text HTML element
    this.textElement = document.createElement("p");
    this.textElement.textContent = "";
    this.textElement.style.position = "absolute";
    this.textElement.style.display = "none";
    this.textElement.style.top = "0";
    this.textElement.style.left = "0";
    this.textElement.style.backgroundColor = "white";
    this.textElement.style.overflowY = "scroll";
    this.textElement.style.border = "1px solid black";
    this.textElement.style.userSelect = "none";
    this.textElement.style.whiteSpace = "break-spaces"; // don't compress whitespace
    this.textElement.style.fontFamily = "arial";

    this.adaptiveScale = true;

    document.getElementById("game-container")?.appendChild(this.textElement);
  }

  public init() {
    this.sprite = new PIXI.Sprite(getMemberTexture("sign.bkg"));
    this.sprite.anchor.set(0.5, 0.5);
    this.sprite.visible = false;
    this.game.app.stage.addChild(this.sprite);
    this.originalHeight = this.sprite.height;
    this.originalWidth = this.sprite.width;
    this.resize();
  }

  public showMessage(message: string) {
    this.game.showingMessage = true;
    this.sprite!.visible = true;
    this.textElement.innerText = message;
    this.textElement.style.display = "block";
  }

  public closeMessage() {
    this.sprite!.visible = false;
    this.textElement.innerText =
      "I see you, poking around in the developer console";
    this.textElement.style.display = "none";
  }

  public resize() {
    const width = this.game.app.renderer.screen.width;
    const height = this.game.app.renderer.screen.height;
    const x = Math.round(width / 2);
    const y = Math.round(height / 2);
    this.sprite?.position.set(x, y);

    console.log(this.sprite?.height);

    // In the original game, the message takes up
    // 65% of the screen's height more or less
    const targetHeight = height * 0.65;
    const targetWidth = width * 0.73;
    const scaleY = targetHeight / this.originalHeight;
    const scaleX = targetWidth / this.originalWidth;

    let scale = 1;
    if (this.adaptiveScale) {
      scale = width > height ? scaleY : scaleX;
    }

    this.sprite?.scale.set(scale, scale);

    this.textElement.style.fontSize = 100 * scale + "%";

    const boxWidth = 242 * scale;
    const boxHeight = 136 * scale;

    const halfWidth = Math.round(this.sprite!.width / 2);
    const halfHeight = Math.round(this.sprite!.height / 2);

    const leftAdjust = 30 * scale;
    const topAdjust = 34 * scale;

    const left = this.sprite!.position.x - halfWidth + leftAdjust;
    const top = this.sprite!.position.y - halfHeight + topAdjust;

    this.textElement.style.width = boxWidth + "px";
    this.textElement.style.height = boxHeight + "px";
    this.textElement.style.left = left + "px";
    this.textElement.style.top = top + "px";
  }
}
