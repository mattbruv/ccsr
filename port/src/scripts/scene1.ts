import * as PIXI from "pixi.js";
import { Game, getMemberTexture } from "../game";
import { InventoryMode } from "../inventory";
import { GameScene, MoveAnimation } from "../scene";
import { Key } from "../types";

export class Scene1 extends GameScene {
  public pumpHouse: PIXI.Container;
  public poolArea: PIXI.Container;

  private pumpBG: PIXI.Sprite;
  private buttercup: PIXI.Sprite;
  private gus: PIXI.Sprite;
  private wheel: PIXI.Sprite;
  private waters: PIXI.Sprite[] = [];
  private items: PIXI.Sprite[] = [];
  private waterIntervals: number[] = [];

  private poolWater: PIXI.Sprite;
  private exitButton: PIXI.Sprite;

  private sign: PIXI.Sprite;
  private message: PIXI.Sprite;

  private turningWheel = false;

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

    this.sign = new PIXI.Sprite(getMemberTexture("sign.bkg"));
    this.sign.anchor.set(0.5);
    this.message = new PIXI.Sprite(getMemberTexture("rating.1"));
    this.message.anchor.set(0.5);
    this.message.position.y -= 5;
    this.sign.position.set(this.poolArea.width / 2, this.poolArea.height / 2);
    this.sign.addChild(this.message);
    this.poolArea.addChild(this.sign);

    // Append scenes
    this.container.addChild(this.pumpHouse);
    this.container.addChild(this.poolArea);

    this.exitButton.visible = false;

    this.container.scale.set(2);
  }

  private addPoolChar(member: string, x: number, y: number) {
    const sprite = new PIXI.Sprite(getMemberTexture(member));
    sprite.anchor.set(0.5);
    sprite.position.set(x, y);
    this.poolArea.addChild(sprite);
  }

  public exit(): void {
    this.game.player.setMapAndPosition("0304", 10, 17);
  }

  public init(): void {
    this.buttercup.position.set(192, 272);
    this.gus.position.set(192, 272 + 32);

    this.pumpHouse.visible = true;
    this.poolArea.visible = false;

    this.items.map((i) => (i.visible = false));
    this.waters.map((w) => (w.visible = false));

    this.waterIntervals.map((i) => window.clearInterval(i));
    this.waterIntervals = [];

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

    this.moveAnims = [];
    this.moveAnims.push(moveLeft);
    this.moveAnims.push(moveUp);
    this.moveAnims.push(moveGusUp);
    this.moveAnims.push(moveGusRight);

    this.frameCallbacks = [];

    // turn gus right
    this.frameCallbacks.push({
      frame: 6,
      callback: () => (this.gus.scale.x = -1),
    });

    // turn gus left
    this.frameCallbacks.push({
      frame: 12,
      callback: () => (this.gus.scale.x = 1),
    });

    this.frameCallbacks.push({
      frame: 23,
      callback: () => (this.turningWheel = true),
    });

    this.frameCallbacks.push({
      frame: 40,
      callback: () => (this.turningWheel = false),
    });

    // create water callbacks
    for (let i = 0; i < this.waters.length; i++) {
      this.frameCallbacks.push({
        frame: 54 + i * 3,
        callback: () => {
          this.waters[i].visible = true;
          this.waters[i].texture = getMemberTexture("Spray1")!;

          let size = 1;
          let j = 0;
          const interval = window.setInterval(() => {
            if (size > 8) {
              j = j + 1 >= 4 ? 0 : j + 1;
              this.waters[i].texture = getMemberTexture("Spray" + (j + 5))!;
              return;
            }
            this.waters[i].texture = getMemberTexture("Spray" + size)!;
            size++;
          }, this.frameRate);
          this.waterIntervals.push(interval);
        },
      });
      this.frameCallbacks.push({
        frame: 54 + i * 3 + 1,
        callback: () => {},
      });
    }

    this.frameCallbacks.push({
      frame: 81,
      callback: () => {
        this.game.sign.setOnClose(() => {
          this.game.inventory.setMode(InventoryMode.SELECT);
          this.game.inventory.openInventory();
        });
        this.game.sign.showCharacterMessage("block.38", "Oh shit, oh fuck!");
      },
    });

    this.currentFrame = -1;
  }

  public play(): void {
    this.playing = true;
  }

  private displayEnd(selected: Set<string>, required: Set<string>) {
    const count = [...selected].filter((i) => required.has(i)).length;
    const rating = Math.max(Math.min(6 - count, 5), 1);

    const waterPos = [
      { x: 258, y: 159, w: 225, h: 193 },
      { x: 258, y: 159, w: 225, h: 193 },
      { x: 258, y: 158, w: 229, h: 197 },
      { x: 258, y: 155, w: 235, h: 203 },
      { x: 258, y: 151, w: 241, h: 209 },
    ];

    this.message.texture = getMemberTexture("rating." + rating)!;
    this.sign.visible = true;
    this.pumpHouse.visible = false;
    this.poolArea.visible = true;
    this.poolWater.visible = count > 0;
    this.poolWater.position.set(waterPos[count].x, waterPos[count].y);
    this.poolWater.width = waterPos[count].w;
    this.poolWater.height = waterPos[count].h;

    if (count == 5) {
      this.exitButton.texture = getMemberTexture("play.next.episode")!;
      alert("You won, nothing else to go back to!");
    } else {
      this.exitButton.texture = getMemberTexture("exit.pool")!;
      this.exitButton.on("pointerdown", () => {
        this.game.closeScene();
      });
    }
  }

  private calculateEnd() {
    const selected = this.game.inventory.selection;
    const required = new Set(["gum", "ducktape", "bandaid", "sock", "tape"]);

    const arr = [...selected];

    for (let i = 0; i < required.size; i++) {
      if (i < arr.length) {
        // if this is a correct item, stop water.
        this.items[i].texture = getMemberTexture(arr[i])!;
      } else {
        this.items[i].texture = getMemberTexture("wrong")!;
      }

      setTimeout(() => {
        if (i < arr.length) {
          if (required.has(arr[i])) {
            this.waters[i].visible = false;
          }
        }
        this.items[i].visible = true;

        if (i == 4) {
          setTimeout(() => {
            this.displayEnd(selected, required);
          }, 1000);
        }
      }, i * 1000 + 1000);
    }
  }

  protected onFrame(): void {
    if (this.game.keyPressed(Key.ENTER)) {
      if (this.game.sign.isOpen()) {
        this.game.sign.closeMessage();
      } else {
        if (this.game.inventory.isOpen()) {
          this.game.inventory.closeInventory();
          this.calculateEnd();
        } else if (this.sign.visible) {
          this.sign.visible = false;
          this.exitButton.visible = true;
        }
      }
      this.game.keysPressed.delete(Key.ENTER);
    }

    if (this.turningWheel) {
      const ts = ["wheel", "block.121"];
      this.wheel.texture = getMemberTexture(ts[this.currentFrame % 2])!;
    }
  }
}
