import * as PIXI from "pixi.js";
import { Game, getMemberTexture } from "../game";
import { InventoryMode } from "../inventory";
import { GameScene, MoveAnimation } from "../scene";
import { Key } from "../types";

class Smoke {
  public sprite: PIXI.Sprite;
  public age = 1;
  public start = 0;
  public end = 1;
  public active = false;

  constructor() {
    this.sprite = new PIXI.Sprite(getMemberTexture("smoke"));
    this.sprite.anchor.set(0.5);
    this.sprite.scale.set(0.1);
    this.sprite.visible = false;
  }
}

export class Scene3 extends GameScene {
  public beach: PIXI.Container;
  public volcan: PIXI.Sprite;
  public boat: PIXI.Sprite;

  public viv: PIXI.Sprite;
  public courage: PIXI.Sprite;

  public inBoat = true;
  public erupting = true;
  public smoke: Smoke[];

  constructor(game: Game) {
    super(game);

    this.smoke = [];

    this.beach = new PIXI.Container();

    const mask = new PIXI.Graphics();
    mask.beginFill(0xff00ff);
    mask.drawRect(0, 0, 416, 320);

    const border = new PIXI.Graphics();
    //    border.beginFill(0xff00ff);
    border.lineStyle({ width: 1, color: 0xff00ff, alignment: 0 });
    border.drawRect(0, 0, 416, 320);

    const sky = new PIXI.Sprite(getMemberTexture("background"));
    this.volcan = new PIXI.Sprite(getMemberTexture("volcano"));
    const shore = new PIXI.Sprite(getMemberTexture("shoreline"));

    this.boat = new PIXI.Sprite(getMemberTexture("VIV.COURAGE.BOAT"));
    this.boat.anchor.set(0.5);
    this.boat.position.set(323, 180);
    this.boat.scale.set(0.2);

    const volcanShore = new PIXI.TilingSprite(getMemberTexture("tile.7")!);
    volcanShore.anchor.set(0.5);
    volcanShore.width = 200;
    volcanShore.height = 32;
    volcanShore.position.set(318, 195);

    const water = new PIXI.TilingSprite(getMemberTexture("tile.1")!);
    water.width = 418;
    water.height = 106;
    water.position.set(-1, 182);

    sky.anchor.set(0.5);
    //sky.position.set(208, 160);
    sky.position.set(208, 135);

    this.volcan.anchor.set(0.5, 0.42);
    this.volcan.position.set(327, 130);

    shore.anchor.set(0.5);
    shore.position.set(210, 304);

    this.beach.addChild(sky);
    this.beach.addChild(this.volcan);
    this.beach.addChild(this.tree(228, 168));
    this.beach.addChild(this.tree(260, 168));
    this.beach.addChild(this.tree(286, 168));
    this.beach.addChild(volcanShore);
    this.beach.addChild(water);
    this.beach.addChild(shore);

    this.beach.addChild(this.char("block.41", 20, 280));
    this.beach.addChild(this.char("koala", 285, 298));
    this.beach.addChild(this.char("ostrich.pct", 58, 271, true));
    this.beach.addChild(this.char("monkey", 92, 288, true));
    this.beach.addChild(this.char("block.45", 162, 286));
    this.beach.addChild(this.char("block.44", 35, 310));
    this.beach.addChild(this.char("block.47", 261, 314));
    this.beach.addChild(this.char("dino", 126, 305, true));
    this.beach.addChild(this.char("lizard", 322, 286));
    this.beach.addChild(this.char("block.48", 346, 308));
    this.beach.addChild(this.char("beetle", 383, 283));
    this.beach.addChild(this.char("block.42", 397, 312));

    this.viv = this.char("player.normal.right.1", 206, 286);
    this.viv.width = 29;
    this.courage = this.char("courage.happy", 245, 286);
    this.viv.visible = false;
    this.courage.visible = false;

    this.beach.addChild(this.viv);
    this.beach.addChild(this.courage);

    this.beach.addChild(this.boat);

    const t = this.tree(399, 168);
    t.width = 28;
    t.height = 27;
    this.beach.addChild(t);

    this.container.addChild(this.beach);
    //this.container.addChild(border);
    this.container.addChild(mask);
    this.beach.mask = mask;

    const boatToBeach: MoveAnimation = {
      sprite: this.boat,
      from: { x: 323, y: 180 },
      to: { x: 230, y: 270 },
      startFrame: 1,
      endFrame: 27,
    };

    this.frameCallbacks.push({
      frame: 1,
      callback: () => {
        this.game.sound.rumble.play();
      },
    });

    this.frameCallbacks.push({
      frame: 28,
      callback: () => {
        this.inBoat = false;
        this.boat.visible = false;
        this.viv.visible = true;
        this.courage.visible = true;
      },
    });

    // 48 -> 115
    // smoke starts at frame ~48 to frame ~114, 33 smokes every 2 frames
    for (let i = 0; i < 33; i++) {
      const start = i * 2 + 1;
      const growEnd = start + 7;
      const end = growEnd + 12;
      const smoke = new Smoke();
      smoke.start = start;
      smoke.end = growEnd;
      this.smoke.push(smoke);
      this.frameCallbacks.push({
        frame: start,
        callback: () => {
          smoke.active = true;
          smoke.sprite.visible = true;
        },
      });
      this.frameCallbacks.push({
        frame: growEnd + 1,
        callback: () => {
          smoke.active = false;
        },
      });
      this.frameCallbacks.push({
        frame: end,
        callback: () => {
          smoke.sprite.visible = false;
        },
      });
      this.moveAnims.push({
        sprite: smoke.sprite,
        from: { x: 335, y: 90 },
        to: { x: 320, y: 44 },
        startFrame: start,
        endFrame: start + 7,
      });
      this.beach.addChild(smoke.sprite);
      this.moveAnims.push({
        sprite: smoke.sprite,
        from: { x: 320, y: 44 },
        to: { x: 228, y: -72 },
        startFrame: start + 7,
        endFrame: start + 7 + 12,
      });
    }

    this.frameCallbacks.push({
      frame: 65,
      callback: () => {
        this.erupting = false;
        this.game.sound.rumble.fade(1, 0, 1000);
      },
    });

    this.moveAnims.push(boatToBeach);
  }

  private char(member: string, x: number, y: number, flip?: boolean) {
    const thing = new PIXI.Sprite(getMemberTexture(member));
    thing.anchor.set(0.5);
    thing.position.set(x, y);
    if (flip) thing.scale.x *= -1;
    return thing;
  }

  private tree(x: number, y: number) {
    const tree = new PIXI.Sprite(getMemberTexture("block.14"));
    tree.anchor.set(0.5);
    tree.width = 26;
    tree.height = 25;
    tree.position.set(x, y);
    return tree;
  }

  public exit(): void {}

  public init(): void {}

  public play(): void {
    this.playing = true;
  }

  protected onFrame(): void {
    if (this.erupting) {
      const odd = this.currentFrame % 2 == 0;
      const x = odd ? 327 : 329;
      const y = odd ? 130 : 130;
      this.volcan.position.set(x, y);
    }

    this.smoke
      .filter((s) => s.active)
      .map((s) => {
        const scale = s.age / (s.end - s.start);
        //console.log(s.start, s.age, s.end, scale);
        s.age++;
        s.sprite.scale.set(Math.min(1, scale));
      });

    if (this.inBoat) {
      // update scale as it moves
      this.boat.scale.set(Math.min(this.currentFrame / 21 + 0.2, 1));
    }
  }
}
