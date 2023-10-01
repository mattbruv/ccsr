import * as PIXI from "pixi.js";
import { Game, getMemberTexture } from "../game";
import { GameScene } from "../scene";

export class SceneScooby1 extends GameScene {

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
    this.screenTexture = new PIXI.Sprite(getMemberTexture("ending_1", "ending"));
    this.container.addChild(this.screenTexture)

    this.frameCallbacks.push({
      frame: 1,
      callback: () => this.game.sound.dynamicSoundOnce("door_creak")

    })
    for (let i = 1; i <= 25; i++) {
      this.frameCallbacks.push({
        frame: i,
        callback: () => {
          this.screenTexture.texture = getMemberTexture("ending_" + i, "ending")!
        }
      });
    }

    const noWay = 25 + (3 * 12)

    this.frameCallbacks.push({
      frame: noWay,
      callback: () => {
        this.screenTexture.texture = getMemberTexture("ending_26", "ending")!;
      }
    })

    const wolfSoud = noWay + (2 * 12)

    this.frameCallbacks.push({
      frame: wolfSoud,
      callback: () => {
        this.screenTexture.texture = getMemberTexture("ending_27", "ending")!;
        this.game.sound.dynamicSoundOnce("howl")
      }
    })

    const didYouHearThat = wolfSoud + (3 * 12)

    this.frameCallbacks.push({
      frame: didYouHearThat,
      callback: () => {
        this.screenTexture.texture = getMemberTexture("ending_28", "ending")!;
      }
    })

    const ghostAppears = didYouHearThat + (2 * 12)

    this.frameCallbacks.push({
      frame: ghostAppears,
      callback: () => this.game.sound.dynamicSoundOnce("ghost_02")
    })

    for (let i = 0; i < 17; i++) {
      this.frameCallbacks.push({
        frame: ghostAppears + i,
        callback: () => {
          this.screenTexture.texture = getMemberTexture("ending_" + (i + 29), "ending")!;
        }
      })
    }

    this.frameCallbacks.push({
      frame: ghostAppears + 17,
      callback: () => {
        this.playing = false
        this.screenTexture.interactive = true;
        this.screenTexture.buttonMode = true;
        this.screenTexture.on("pointerdown", () => {
          location.reload();
        });
      }
    })

  }

}
