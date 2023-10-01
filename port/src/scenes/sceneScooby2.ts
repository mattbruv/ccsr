import * as PIXI from "pixi.js";
import { Game, getMemberTexture } from "../game";
import { GameScene } from "../scene";

export class SceneScooby2 extends GameScene {

  public screenTexture: PIXI.Sprite;

  public init(): void {
    this.game.sound.pauseTheme();
    //throw new Error("Method not implemented.");
  }
  public play(): void {
    this.playing = true;
    //throw new Error("Method not implemented.");
  }
  public exit(): void {
    //throw new Error("Method not implemented.");
  }
  protected onFrame(): void {
    //throw new Error("Method not implemented.");
  }
  constructor(game: Game) {
    super(game);
    this.screenTexture = new PIXI.Sprite(getMemberTexture("ending_1"));
    this.container.addChild(this.screenTexture)

    // add unmasking frames
    const unmaskingFrame = (0 * 12);

    for (let i = 0; i < 14; i++) {
      this.frameCallbacks.push({
        frame: unmaskingFrame + i,
        callback: () => {
          this.screenTexture.texture = getMemberTexture("ending_" + (i + 2))!
        }
      });
    }

    const fadeFrame = unmaskingFrame + 14 + (3 * 12);
    for (let i = 0; i < 12; i++) {
      this.frameCallbacks.push({
        frame: fadeFrame + i,
        callback: () => {
          this.screenTexture.texture = getMemberTexture("ending_" + (i + 15))!
        }
      })
    }

    const scoobFrame = fadeFrame + 12 + (4 * 12)

    this.frameCallbacks.push({
      frame: scoobFrame,
      callback: () => {
        this.screenTexture.texture = getMemberTexture("ending_27")!;
        this.game.sound.dynamicSoundOnce("scooby dooby doo")
      }
    })

    this.frameCallbacks.push({
      frame: scoobFrame + (4 * 12),
      callback: () => {
        this.screenTexture.texture = getMemberTexture("ending_28")!;
        this.playing = false;

        this.screenTexture.interactive = true;
        this.screenTexture.buttonMode = true;
        this.screenTexture.on("pointerdown", () => {
          location.reload();
        });
      }
    })

  }

}
