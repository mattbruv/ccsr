import * as PIXI from "pixi.js";
import {
  EngineType,
  Game,
  getMemberTexture,
  UI_HEIGHT_PERCENT,
  UI_WIDTH_PERCENT,
} from "./game";
import { PlayerStatus } from "./player";
export class GameSign {
  private game: Game;
  private sprite: PIXI.Sprite;
  private characterSprite: PIXI.Sprite;
  private textElement: HTMLParagraphElement;

  private adaptiveScale: boolean = false;
  private originalHeight: number = 0;
  private originalWidth: number = 0;

  private isMessageShowing = false;
  private isCharacterMessage = false;
  private engine: EngineType;

  private onCloseCallback: (() => void) | undefined;

  private scale = 1;

  constructor(game: Game, engine: EngineType) {
    this.game = game;
    this.engine = engine;

    this.sprite = new PIXI.Sprite();
    this.characterSprite = new PIXI.Sprite();

    this.onCloseCallback = undefined;

    // Initialize and style the text HTML element
    this.textElement = document.createElement("p");
    this.textElement.textContent = "";
    this.textElement.style.position = "absolute";
    this.textElement.style.display = "none";
    this.textElement.style.top = "0";
    this.textElement.style.left = "0";
    this.textElement.style.backgroundColor = "white";
    this.textElement.style.color = "black";
    this.textElement.style.overflowY = "scroll";
    this.textElement.style.border = "1px solid black";
    this.textElement.style.userSelect = "none";
    this.textElement.style.whiteSpace = "break-spaces"; // don't compress whitespace
    this.textElement.style.fontFamily = "arial";

    this.textElement.style.lineHeight = "normal";

    this.adaptiveScale = true;

    document.getElementById("game-container")?.appendChild(this.textElement);
  }

  public isOpen() {
    return this.isMessageShowing;
  }

  public setOnClose(callback: () => void) {
    this.onCloseCallback = callback;
  }

  public init() {
    this.sprite.texture = getMemberTexture("sign.bkg")!;
    this.sprite.anchor.set(0.5, 0.5);
    this.sprite.visible = false;

    this.sprite.interactive = true;
    this.sprite.on("touchstart", () => {
      this.closeMessage()
    })

    this.characterSprite = new PIXI.Sprite();
    this.characterSprite.anchor.set(0.5, 0.5);
    this.characterSprite.visible = true;

    this.game.app.stage.addChild(this.sprite);
    this.sprite.addChild(this.characterSprite);

    this.originalHeight = this.sprite.height;
    this.originalWidth = this.sprite.width;
    this.resize();
  }

  public showCharacterMessage(charName: string, message: string) {
    this.game.sound.once(this.game.sound.message);
    this.game.inventory.closeInventory();
    this.game.player.setStatus(PlayerStatus.READ);
    this.isCharacterMessage = true;
    this.isMessageShowing = true;
    this.setTextDimensions(false);

    this.sprite.texture = getMemberTexture("talk.bkg")!;
    this.sprite.visible = true;

    this.characterSprite.texture = getMemberTexture(charName + ".face")!;
    this.characterSprite.visible = true;

    this.textElement.innerText = message;
    this.textElement.style.display = "block";
  }

  public showMessage(message: string) {
    this.game.sound.once(this.game.sound.message);
    this.game.inventory.closeInventory();
    this.game.player.setStatus(PlayerStatus.READ);
    this.isCharacterMessage = false;
    this.isMessageShowing = true;
    this.setTextDimensions(true);

    this.sprite.texture = getMemberTexture("sign.bkg")!;
    this.sprite.visible = true;

    this.textElement.innerText = message;
    this.textElement.style.display = "block";
  }

  private setTextDimensions(isSign: boolean) {
    let width = isSign ? 242 : 165;
    let height = isSign ? 136 : 160;

    let l = isSign ? 30 : 120;
    let t = isSign ? 34 : 18;

    // tweak for scooby
    if (this.engine == EngineType.Scooby) {
      if (!isSign) {
        l -= 10;
        width -= 8;
        height -= 5;
      }
      else {
        l += 30;
        width -= 30;
        height += 24;
        t -= 20;
      }
    }

    const boxWidth = width * this.scale;
    const boxHeight = height * this.scale;

    const halfWidth = Math.round(this.sprite.width / 2);
    const halfHeight = Math.round(this.sprite.height / 2);


    const leftAdjust = l * this.scale;
    const topAdjust = t * this.scale;

    const left = this.sprite.position.x - halfWidth + leftAdjust;
    const top = this.sprite.position.y - halfHeight + topAdjust;

    this.textElement.style.width = boxWidth + "px";
    this.textElement.style.height = boxHeight + "px";
    this.textElement.style.left = left + "px";
    this.textElement.style.top = top + "px";
  }

  public closeMessage() {
    this.game.player.setStatus(PlayerStatus.MOVE);
    this.isMessageShowing = false;
    this.sprite.visible = false;
    this.characterSprite.visible = false;
    this.textElement.innerText =
      "I see you, poking around in the developer console";
    this.textElement.style.display = "none";

    if (this.onCloseCallback !== undefined) {
      this.onCloseCallback();
      this.onCloseCallback = undefined;
    }
  }

  public resize() {
    const width = this.game.app.renderer.screen.width;
    const height = this.game.app.renderer.screen.height;
    const x = Math.round(width / 2);
    const y = Math.round(height / 2);
    this.sprite.position.set(x, y);
    this.characterSprite.position.set(-88, -25);

    if (this.engine === EngineType.Scooby) {
      this.characterSprite.anchor.set(0);
      this.characterSprite.position.set(-148, -90);
    }

    // In the original game, the message takes up
    // 65% of the screen's height more or less
    const targetHeight = height * UI_HEIGHT_PERCENT;
    const targetWidth = width * UI_WIDTH_PERCENT;
    const scaleY = targetHeight / this.originalHeight;
    const scaleX = targetWidth / this.originalWidth;

    this.scale = 1;
    if (this.adaptiveScale) {
      this.scale = width > height ? scaleY : scaleX;
    }

    this.sprite.scale.set(this.scale, this.scale);

    this.textElement.style.fontSize = 90 * this.scale + "%";
    this.setTextDimensions(!this.isCharacterMessage);
  }
}
