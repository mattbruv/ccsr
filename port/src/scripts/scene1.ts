import * as PIXI from "pixi.js";
import { Game, getMemberTexture } from "../game";
import { GameScene } from "../scene";

export class Scene1 extends GameScene {
  public pumpHouse: PIXI.Container;

  private pumpBG: PIXI.Sprite;
  private buttercup: PIXI.Sprite;
  private gus: PIXI.Sprite;
  private wheel: PIXI.Sprite;
  private waters: PIXI.Sprite[] = [];

  constructor(game: Game) {
    super(game);
    this.pumpHouse = new PIXI.Container();

    this.pumpBG = new PIXI.Sprite(getMemberTexture("pump house BG"));

    this.buttercup = new PIXI.Sprite(getMemberTexture("block.38"));
    this.buttercup.anchor.set(0.5);
    this.buttercup.position.set(192, 272);

    this.gus = new PIXI.Sprite(getMemberTexture("gus"));
    this.gus.anchor.set(0.5);
    this.gus.position.set(192, 272 + 32);

    this.wheel = new PIXI.Sprite(getMemberTexture("wheel"));
    this.wheel.anchor.set(0.5);
    this.wheel.position.set(64, 121);

    this.pumpHouse.addChild(this.pumpBG);
    this.container.addChild(this.pumpHouse);
    this.container.addChild(this.buttercup);
    this.container.addChild(this.gus);
    this.container.addChild(this.wheel);

    for (let i = 0; i < 5; i++) {
      const water = new PIXI.Sprite(getMemberTexture("Spray4"));
      water.anchor.set(0.5, 1);
      const scaleX = water.width / 14;
      const scaleY = water.height / 11;

      water.scale.set(scaleX, scaleY);
      water.position.set(130 + i * 64, 106 + 28);
      this.waters.push(water);
      this.container.addChild(water);
    }
  }

  public init(): void {
    console.log("init pool");
  }
  public play(): void {
    console.log("play pool");
  }
}
