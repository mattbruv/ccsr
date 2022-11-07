import * as PIXI from "pixi.js";
import { Game, getMemberTexture } from "../game";
import { InventoryMode } from "../inventory";
import { GameScene, MoveAnimation } from "../scene";
import { Key } from "../types";

export class Scene3 extends GameScene {
  public beach: PIXI.Container;

  constructor(game: Game) {
    super(game);
    this.beach = new PIXI.Container();

    const mask = new PIXI.Graphics();
    mask.beginFill(0xff00ff);
    mask.drawRect(0, 0, 416, 320);

    const border = new PIXI.Graphics();
    //    border.beginFill(0xff00ff);
    border.lineStyle({ width: 1, color: 0xff00ff, alignment: 0 });
    border.drawRect(0, 0, 416, 320);

    const sky = new PIXI.Sprite(getMemberTexture("background"));
    const volcan = new PIXI.Sprite(getMemberTexture("volcano"));
    const shore = new PIXI.Sprite(getMemberTexture("shoreline"));
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

    volcan.anchor.set(0.5);
    volcan.position.set(329, 130);

    shore.anchor.set(0.5);
    shore.position.set(210, 304);

    this.beach.addChild(sky);
    this.beach.addChild(volcan);
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

    const t = this.tree(399, 168);
    t.width = 28;
    t.height = 27;
    this.beach.addChild(t);

    this.container.addChild(this.beach);
    //this.container.addChild(border);
    this.container.addChild(mask);
    this.beach.mask = mask;
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

  protected onFrame(): void {}
}
