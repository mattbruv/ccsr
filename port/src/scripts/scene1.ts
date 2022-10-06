import * as PIXI from "pixi.js";
import { Game, getMemberTexture } from "../game";
import { GameScene, MoveAnimation } from "../scene";

export class Scene1 extends GameScene {
  public pumpHouse: PIXI.Container;
  public poolArea: PIXI.Container;

  private pumpBG: PIXI.Sprite;
  private buttercup: PIXI.Sprite;
  private gus: PIXI.Sprite;
  private wheel: PIXI.Sprite;
  private waters: PIXI.Sprite[] = [];
  private items: PIXI.Sprite[] = [];

  private poolWater: PIXI.Sprite;
  private exitButton: PIXI.Sprite;

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
    this.pumpHouse.addChild(this.pumpHouse);
    this.pumpHouse.addChild(this.buttercup);
    this.pumpHouse.addChild(this.gus);
    this.pumpHouse.addChild(this.wheel);

    for (let i = 0; i < 5; i++) {
      const water = new PIXI.Sprite(getMemberTexture("Spray4"));
      water.anchor.set(0.5, 1);
      const scaleX = water.width / 14;
      const scaleY = water.height / 11;

      water.scale.set(scaleX, scaleY);
      water.position.set(130 + i * 64, 106 + 28);
      this.waters.push(water);
      this.pumpHouse.addChild(water);

      const it = ["ducktape", "tape", "sock", "gum", "bandaid"];

      const item = new PIXI.Sprite(getMemberTexture(it[i]));
      item.anchor.set(0.5);
      item.position.set(128 + i * 64, 135);
      this.items.push(item);
      this.pumpHouse.addChild(item);
    }

    // Initialize pool area objects
    this.poolArea = new PIXI.Container();

    const bgTop = new PIXI.Sprite(getMemberTexture("poolside01"));
    const bgBottom = new PIXI.Sprite(getMemberTexture("poolside02"));
    bgBottom.position.set(75, 173);
    this.poolWater = new PIXI.Sprite(getMemberTexture("poolwater"));
    this.poolWater.alpha = 0.5;
    this.poolWater.anchor.set(0.5);
    this.poolWater.position.set(258, 150);
    const diveboard = new PIXI.Sprite(getMemberTexture("diveboardnew"));
    diveboard.anchor.set(0.5);
    diveboard.position.set(132, 138);

    this.poolArea.addChild(bgTop);
    this.poolArea.addChild(this.poolWater);
    this.poolArea.addChild(bgBottom);
    this.poolArea.addChild(diveboard);
    this.addPoolChar("block.45", 222, 206);
    this.addPoolChar("block.43", 178, 208);
    this.addPoolChar("block.42", 112, 171);
    this.addPoolChar("block.39", 111, 96);
    this.addPoolChar("block.37", 111, 48);
    this.addPoolChar("block.41", 159, 16);
    this.addPoolChar("block.40", 230, 12);
    this.addPoolChar("block.47", 289, 16);
    this.addPoolChar("block.36", 337, 16);
    this.addPoolChar("block.46", 401, 63);
    this.addPoolChar("block.44", 401, 131);
    this.addPoolChar("block.35", 400, 191);
    this.addPoolChar("block.48", 307, 272);
    this.exitButton = new PIXI.Sprite(getMemberTexture("exit.pool"));
    this.exitButton.anchor.set(0.5);
    this.exitButton.position.set(99, 290);
    this.exitButton.interactive = true;
    this.exitButton.buttonMode = true;
    this.poolArea.addChild(this.exitButton);

    // Append scenes
    this.container.addChild(this.pumpHouse);
    this.container.addChild(this.poolArea);
  }

  private addPoolChar(member: string, x: number, y: number) {
    const sprite = new PIXI.Sprite(getMemberTexture(member));
    sprite.anchor.set(0.5);
    sprite.position.set(x, y);
    this.poolArea.addChild(sprite);
  }

  public init(): void {
    this.pumpHouse.visible = true;
    this.poolArea.visible = false;

    this.items.map((i) => (i.visible = false));
    this.waters.map((w) => (w.visible = false));

    // keyframe movement/events
    const moveLeft: MoveAnimation = {
      sprite: this.buttercup,
      from: { x: 192, y: 272 },
      to: { x: 64, y: 272 },
      startFrame: 1,
      endFrame: 11,
    };

    const moveUp: MoveAnimation = {
      sprite: this.buttercup,
      from: { x: 64, y: 272 },
      to: { x: 64, y: 159 },
      startFrame: 11,
      endFrame: 23,
    };

    const moveGusUp: MoveAnimation = {
      sprite: this.gus,
      from: { x: this.gus.position.x, y: this.gus.position.y },
      to: { x: 192, y: 255 },
      startFrame: 1,
      endFrame: 6,
    };

    const moveGusRight: MoveAnimation = {
      sprite: this.gus,
      from: { x: 192, y: 255 },
      to: { x: 240, y: 255 },
      startFrame: 6,
      endFrame: 12,
    };

    this.moveAnims.push(moveLeft);
    this.moveAnims.push(moveUp);
    this.moveAnims.push(moveGusUp);
    this.moveAnims.push(moveGusRight);

    this.currentFrame = -1;
  }

  public play(): void {
    this.playing = true;
    console.log("play pool");
  }

  protected onFrame(): void {
    if (this.currentFrame == 50) {
      this.playing = false;
      this.currentFrame = 0;
    }
  }
}
