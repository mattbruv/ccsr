import * as PIXI from "pixi.js";
import { Game, getMemberTexture } from "../game";
import { GameScene } from "../scene";

export class Scene1 extends GameScene {
  public pumpHouse: PIXI.Container;

  private pumpBG: PIXI.Sprite;
  private buttercup: PIXI.Sprite;

  constructor(game: Game) {
    super(game);
    this.pumpHouse = new PIXI.Container();

    this.pumpBG = new PIXI.Sprite(getMemberTexture("pump house BG"));
    this.buttercup = new PIXI.Sprite(getMemberTexture("block.38"));
    this.buttercup.anchor.set(0.5);
    this.buttercup.position.set(192, 272);
    this.pumpHouse.addChild(this.pumpBG);
    this.container.addChild(this.pumpHouse);
    this.container.addChild(this.buttercup);
  }

  public init(): void {
    console.log("init pool");
  }
  public play(): void {
    console.log("play pool");
  }
}
