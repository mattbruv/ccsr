import * as PIXI from "pixi.js";
import { Game, getMemberTexture, randBetween } from "../game";
import { GameScene, MoveAnimation } from "../scene";
import { Key } from "../types";

class Lava {
  public sprite: PIXI.Sprite;
  public age = 1;
  public end = 10;
  public start = 0;
  public angle: number = 0;

  constructor() {
    this.sprite = new PIXI.Sprite(getMemberTexture("lava"));
    this.sprite.anchor.set(0.5);
    //this.sprite.scale.set(0.1);
    this.setAngle(randBetween(-25, 25));
  }

  public setAngle(angle: number) {
    this.angle = angle;
    this.sprite.angle = angle + 45;
  }
}

class Smoke {
  public sprite: PIXI.Sprite;
  public age = 1;
  public start = 0;
  public end = 1;
  public active = false;

  constructor() {
    this.sprite = new PIXI.Sprite(getMemberTexture("smoke"));
    this.sprite.anchor.set(0.5);
    //this.sprite.scale.set(0.1);
    this.sprite.visible = false;
  }
}

export class Scene3 extends GameScene {
  public beach: PIXI.Container;
  public volcan: PIXI.Sprite;
  public boat: PIXI.Sprite;

  public viv: PIXI.Sprite;
  public courage: PIXI.Sprite;

  public message: PIXI.Sprite;
  public button: PIXI.Sprite;

  public inBoat = true;
  public erupting = true;
  public smoke: Smoke[];
  public lava: Lava[];

  public showingMessage = false;

  constructor(game: Game) {
    super(game);

    this.smoke = [];
    this.lava = [];

    this.button = new PIXI.Sprite(getMemberTexture("play.next.episode"));
    this.button.interactive = true;
    this.button.buttonMode = true;
    this.button.on("pointerdown", () => {
      location.reload();
    });
    this.button.visible = false;
    this.button.anchor.set(0.5);
    this.button.position.set(98, 26);

    this.message = new PIXI.Sprite(getMemberTexture("end.message"));
    this.message.anchor.set(0.5);
    this.message.position.set(209, 139);
    this.message.visible = false;

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

    const chicken = this.char("block.41", 20, 280);
    //chicken.angle = -45;
    chicken.rotation = -0.7853981633974483;
    this.beach.addChild(chicken);
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
    this.container.addChild(this.message);
    this.container.addChild(this.button);
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

    // play lava sound
    this.frameCallbacks.push({
      frame: 42,
      callback: () => {
        this.game.sound.volcano.play();
      },
    });

    this.frameCallbacks.push({
      frame: 67,
      callback: () => {
        this.game.sound.volcano.fade(1, 0, 1000);
      },
    });

    this.frameCallbacks.push({
      frame: 75,
      callback: () => {
        this.game.sound.win.play();
        this.showingMessage = true;
        this.message.visible = true;
      },
    });

    // lava from 135 degrees to 45 degrees
    // just gonna generate them randomly, it doesn't have to be perfectly matching
    for (let i = 0; i < 10; i++) {
      const lava = new Lava();
      lava.sprite.visible = false;
      this.lava.push(lava);
      this.beach.addChild(lava.sprite);

      const start = 42 + i * 3;
      lava.start = start;

      //lava.setAngle(-45);

      const dist = randBetween(75, 120);

      const radians = (lava.angle * Math.PI) / 180;
      console.log("angle", lava.angle, "radians", radians);

      const toX = 335 + Math.sin(radians) * dist;
      const toY = 90 - Math.cos(Math.abs(radians)) * dist;

      console.log("from", 335, 90, "to", toX, toY);

      this.moveAnims.push({
        sprite: lava.sprite,
        from: { x: 335, y: 80 },
        to: { x: toX, y: toY },
        startFrame: start,
        endFrame: start + 10,
      });
    }

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

  public init(): void {
    this.game.sound.pauseTheme();
  }

  public play(): void {
    this.playing = true;
  }

  protected onFrame(): void {
    if (this.game.keyPressed(Key.ENTER)) {
      if (this.showingMessage == true) {
        this.message.visible = false;
        this.showingMessage = false;
        this.button.visible = true;
      }
    }

    if (this.erupting) {
      const odd = this.currentFrame % 2 == 0;
      const x = odd ? 327 : 329;
      const y = odd ? 130 : 130;
      this.volcan.position.set(x, y);
    }

    this.lava
      .filter((l) => l.age < 10 && l.start <= this.currentFrame)
      .map((l) => {
        l.sprite.visible = true;
        l.age++;
        if (l.age <= 6) {
          const size = l.age / 5;
          l.sprite.scale.set(size);
        }
        if (l.age >= 5) {
          const alpha = 1 - l.age / 10;
          l.sprite.alpha = alpha;
          //console.log(l.age, 1 - l.age / 10);
        }
      });

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
