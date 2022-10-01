import * as PIXI from "pixi.js";
import { Game, getMemberTexture } from "./game";
export class GameInventory {
  private game: Game;
  private sprite: PIXI.Sprite;
  private spriteInstructions: PIXI.Sprite;
  private textElement: HTMLParagraphElement;

  private adaptiveScale: boolean = false;

  private originalHeight: number = 0;
  private originalWidth: number = 0;

  private scale = 1;

  private readonly FONT_SCALE = 0.72;

  constructor(game: Game) {
    this.game = game;
    this.sprite = new PIXI.Sprite();
    this.spriteInstructions = new PIXI.Sprite();

    // Initialize and style the text HTML element
    this.textElement = document.createElement("p");
    this.textElement.textContent = "";
    this.textElement.style.position = "absolute";
    this.textElement.style.display = "none";
    this.textElement.style.top = "0";
    this.textElement.style.left = "0";
    //this.textElement.style.backgroundColor = "red";
    this.textElement.style.userSelect = "none";
    this.textElement.style.fontFamily = "arial narrow";
    this.textElement.style.fontStretch = "condensed";

    this.adaptiveScale = true;

    document.getElementById("game-container")?.appendChild(this.textElement);
  }

  public init() {
    this.sprite.texture = getMemberTexture("inventory")!;
    this.sprite.anchor.set(0.5, 0.5);
    this.sprite.visible = false;

    this.spriteInstructions.texture = getMemberTexture("inventory.instruct")!;
    this.spriteInstructions.anchor.set(0.5, 0.5);
    this.spriteInstructions.visible = false;

    this.game.app.stage.addChild(this.sprite);
    this.sprite.addChild(this.spriteInstructions);

    this.originalHeight = this.sprite.height;
    this.originalWidth = this.sprite.width;

    this.resize();
  }

  public openInventory() {
    this.setTextDimensions();

    this.sprite.visible = true;
    this.spriteInstructions.visible = true;

    this.textElement.innerText = "Yes, we have some Bananas!";
    this.textElement.style.display = "block";
  }

  public closeInventory() {
    this.sprite.visible = false;
    this.spriteInstructions.visible = false;

    this.textElement.innerText =
      "I see you, poking around in the developer console";
    this.textElement.style.display = "none";
  }

  private setTextDimensions() {
    const width = 260;
    const height = 20;

    const boxWidth = width * this.scale;
    const boxHeight = height * this.scale;

    const halfWidth = Math.round(this.sprite.width / 2);
    const halfHeight = Math.round(this.sprite.height / 2);

    const l = 25;
    const t = 21;

    const leftAdjust = l * this.scale;
    const topAdjust = t * this.scale;

    const left = this.sprite.position.x - halfWidth + leftAdjust;
    const top = this.sprite.position.y - halfHeight + topAdjust;

    this.textElement.style.width = boxWidth + "px";
    this.textElement.style.height = boxHeight + "px";
    this.textElement.style.left = left + "px";
    this.textElement.style.top = top + "px";
  }

  public resize() {
    const width = this.game.app.renderer.screen.width;
    const height = this.game.app.renderer.screen.height;
    const x = Math.round(width / 2);
    const y = Math.round(height / 2);
    this.sprite.position.set(x, y);
    this.spriteInstructions.position.set(0, 90);

    // In the original game, the message takes up
    // 65% of the screen's height more or less
    const targetHeight = height * 0.65;
    const targetWidth = width * 0.73;
    const scaleY = targetHeight / this.originalHeight;
    const scaleX = targetWidth / this.originalWidth;

    this.scale = 1;
    if (this.adaptiveScale) {
      this.scale = width > height ? scaleY : scaleX;
    }

    this.sprite.scale.set(this.scale, this.scale);

    this.textElement.style.fontSize = 100 * this.scale * this.FONT_SCALE + "%";
    this.setTextDimensions();
  }
}
