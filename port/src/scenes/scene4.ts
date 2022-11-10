import * as PIXI from "pixi.js";
import { Sprite } from "pixi.js";
import { Game, getMemberTexture } from "../game";
import { InventoryMode } from "../inventory";
import { PlayerDirection } from "../player";
import { GameScene, MoveAnimation } from "../scene";
import { Key, Pos } from "../types";

class Char {
  sprite: PIXI.Sprite;

  constructor(texture: string) {
    this.sprite = new PIXI.Sprite(getMemberTexture(texture));
    this.sprite.anchor.set(0.5);
    this.sprite.position.set(-500, -500);
  }
}

class Floor {
  public container: PIXI.Container;
  public strips: PIXI.TilingSprite[] = [];

  public colors = ["red", "purple", "green", "yellow", "orange"];
  public frames = [0, 1, 2, 3, 4, 3, 2, 1, 0];

  constructor() {
    this.container = new PIXI.Container();
    this.container.pivot.set(0.5);

    for (let i = 0; i < 9; i++) {
      const strip = new PIXI.TilingSprite(
        getMemberTexture(this.colors[this.frames[i]])!
      );
      strip.width = 32;
      strip.height = 255;
      strip.position.x = i * 32;
      this.strips.push(strip);
      this.container.addChild(strip);
    }
  }

  public tick() {
    for (let i = 0; i < this.strips.length; i++) {
      const frame = (this.frames[i] + 4) % 5;
      this.frames[i] = frame;
      this.strips[i].texture = getMemberTexture(this.colors[frame])!;
    }
  }
}

export class Scene4 extends GameScene {
  public disco: PIXI.Container;

  public didWin = false;

  public msg: PIXI.Sprite;

  public buttonExit: PIXI.Sprite;

  public floor: Floor;

  public endMessage = false;

  public prickles: Char;
  public dexter: Char;
  public chicken: Char;
  public ed: Char;
  public bravo: Char;
  public courage: Char;
  public baboon: Char;

  public chars: Char[] = [];

  constructor(game: Game) {
    super(game);
    this.disco = new PIXI.Container();

    this.msg = new PIXI.Sprite(getMemberTexture("end.lose"));

    this.msg.visible = false;

    this.msg.anchor.set(0.5);

    this.msg.position.set(208, 160);

    const wall1 = new PIXI.Sprite(getMemberTexture("block.170"));
    const wall2 = new PIXI.Sprite(getMemberTexture("block.170"));
    const wall3 = new PIXI.Sprite(getMemberTexture("block.170"));

    [wall1, wall2, wall3].map((w) => {
      w.anchor.set(0.5);
      w.width = 157;
      w.height = 46;
      this.disco.addChild(w);
    });

    wall1.position.set(78, 22);
    wall2.position.set(235, 22);
    wall3.position.set(392, 22);

    const discoBall = new PIXI.Sprite(getMemberTexture("block.122"));
    discoBall.anchor.set(0.5, 0.47);
    discoBall.position.set(206, 16);
    discoBall.scale.set(3.3);

    this.buttonExit = new PIXI.Sprite(getMemberTexture("exit.danceFloor"));
    this.buttonExit.interactive = true;
    this.buttonExit.buttonMode = true;
    this.buttonExit.visible = false;
    this.buttonExit.anchor.set(0.5);
    this.buttonExit.position.set(102, 290);

    /*
    // debug stuff
    this.court.interactive = true;
    this.court.on("pointerdown", (e: PIXI.InteractionEvent) => {
      const pos = e.data.global;

      console.log(
        pos.x / this.game.camera.scaleX - 8,
        pos.y / this.game.camera.scaleY
      );
    });
    */

    // Initialize all characaters
    this.prickles = new Char("player.normal.left.1");
    this.baboon = new Char("block.45");
    this.ed = new Char("block.48");
    this.bravo = new Char("block.35");
    this.chicken = new Char("block.41");
    this.courage = new Char("block.37");
    this.dexter = new Char("block.36");

    this.chars = [
      this.prickles,
      this.baboon,
      this.ed,
      this.bravo,
      this.chicken,
      this.courage,
      this.dexter,
    ];

    this.chars.map((c) => {
      this.disco.addChild(c.sprite);
    });

    this.floor = new Floor();
    this.floor.container.position.set(
      208 - this.floor.container.width / 2,
      172 - this.floor.container.height / 2
    );

    const mask = new PIXI.Graphics();
    mask.beginFill(0xff00ff);
    mask.drawRect(0, 0, 416, 320);

    this.disco.addChild(discoBall);

    this.container.addChild(this.floor.container);
    this.container.addChild(this.disco);
    this.container.addChild(mask);

    this.container.addChild(this.msg);
    this.disco.mask = mask;
  }

  public exit(): void {
    this.game.sound.playTheme();
    this.game.inventory.setMode(InventoryMode.NORMAL);
    this.game.player.characterDirection = PlayerDirection.RIGHT;
    this.game.player.setMapAndPosition("0101", 8, 17);
  }

  public preWalk(char: Char, from: Pos, to: Pos, start: number, end: number) {
    this.moveAnims.push({
      sprite: char.sprite,
      from,
      to,
      startFrame: start - 45,
      endFrame: end - 45,
    });
  }

  public init(): void {
    this.currentFrame = 0;
    this.game.sound.pauseTheme();

    this.frameCallbacks = [];
    this.moveAnims = [];

    this.chars.map((c) => {
      c.sprite.position.set(-500, -500);
    });

    this.preWalk(this.prickles, { x: 216, y: 320 }, { x: 239, y: 219 }, 45, 60);
    this.preWalk(this.baboon, { x: 111, y: 328 }, { x: 135, y: 230 }, 45, 57);
    this.preWalk(this.bravo, { x: 185, y: 320 }, { x: 174, y: 222 }, 45, 56);
    this.preWalk(this.ed, { x: 175, y: 324 }, { x: 148, y: 284 }, 45, 55);
    this.preWalk(this.chicken, { x: 248, y: 320 }, { x: 231, y: 271 }, 45, 59);
    this.preWalk(this.courage, { x: 278, y: 318 }, { x: 288, y: 284 }, 45, 60);
    this.preWalk(this.dexter, { x: 330, y: 322 }, { x: 303, y: 220 }, 45, 53);
  }

  public play(): void {
    this.playing = true;
  }

  private showEnd() {
    this.game.sound.win.play();
    this.endMessage = true;
    this.msg.visible = true;
    this.msg.texture = getMemberTexture("end.win")!;

    this.didWin = true;
    //
  }

  private win() {}

  private lose() {}

  private calculateEnd() {}

  protected onFrame(): void {
    //this.floor.tick();

    if (this.game.keyPressed(Key.ENTER)) {
      if (this.endMessage) {
        this.endMessage = false;
        this.msg.visible = false;
        this.buttonExit.visible = true;

        if (this.didWin) {
          this.buttonExit.on("pointerdown", () => {
            location.reload();
          });
        }
      }

      if (this.game.sign.isOpen()) {
        this.game.sign.closeMessage();
      } else {
        if (this.game.inventory.isOpen()) {
          this.game.inventory.closeInventory();
          this.calculateEnd();
        }
      }
      this.game.keysPressed.delete(Key.ENTER);
    }
  }
}
