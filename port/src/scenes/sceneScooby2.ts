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
    this.screenTexture = new PIXI.Sprite(getMemberTexture("ending_1")!);
    this.container.addChild(this.screenTexture)
    //this.container.visible = true;
    console.log(this.screenTexture)
  }

}
