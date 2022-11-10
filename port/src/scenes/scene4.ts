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

  public deedee: Char;
  public suzie: Char;
  public buttercup: Char;
  public blossom: Char;
  public bubbles: Char;

  public devil: Char;
  public eustace: Char;
  public mojo: Char;
  public cow: Char;
  public mayor: Char;
  public mandark: Char;
  public og: Char;

  public chars: Char[] = [];

  public items: Char[] = [];

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
    this.buttonExit.position.set(319, 295);
    this.buttonExit.on("pointerdown", () => {
      this.game.closeScene();
    });

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

    this.deedee = new Char("block.39");
    this.buttercup = new Char("block.38");
    this.bubbles = new Char("block.127");
    this.blossom = new Char("block.126");
    this.suzie = new Char("block.47");

    this.devil = new Char("block.50");
    this.eustace = new Char("block.44");
    this.mojo = new Char("block.42");
    this.cow = new Char("block.40");
    this.mayor = new Char("block.43");
    this.mandark = new Char("block.154");
    this.og = new Char("block.46");

    this.chars = [
      this.prickles,
      this.baboon,
      this.ed,
      this.bravo,
      this.chicken,
      this.courage,
      this.dexter,

      this.deedee,
      this.buttercup,
      this.bubbles,
      this.blossom,
      this.suzie,

      this.devil,
      this.eustace,
      this.mojo,
      this.mandark,
      this.cow,
      this.mayor,
      this.og,
    ];

    this.chars.map((c) => {
      this.disco.addChild(c.sprite);
    });

    [111, 158, 207, 257, 303].map((x) => {
      const item = new Char("wrong");
      item.sprite.position.set(x, 157);
      this.disco.addChild(item.sprite);
      this.items.push(item);
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
    this.container.addChild(this.buttonExit);
    this.container.addChild(mask);

    this.container.addChild(this.msg);
    this.disco.mask = mask;
  }

  public exit(): void {
    this.game.inventory.girlOrder.visible = false;
    this.game.sound.playTheme();
    this.game.inventory.setMode(InventoryMode.NORMAL);
    this.game.player.characterDirection = PlayerDirection.RIGHT;
    this.game.player.setMapAndPosition("0703", 11, 10);
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
    this.game.inventory.girlOrder.visible = true;
    this.currentFrame = 0;
    this.game.sound.pauseTheme();
    this.game.sound.crowd.play();
    this.game.sound.disco.play();
    this.buttonExit.visible = false;
    this.msg.visible = false;

    this.frameCallbacks = [];
    this.moveAnims = [];

    this.chars.map((c) => {
      c.sprite.visible = true;
      c.sprite.position.set(-500, -500);
    });

    this.preWalk(this.prickles, { x: 216, y: 320 }, { x: 239, y: 219 }, 45, 60);
    this.preWalk(this.baboon, { x: 111, y: 328 }, { x: 135, y: 230 }, 45, 57);
    this.preWalk(this.bravo, { x: 185, y: 320 }, { x: 174, y: 222 }, 45, 56);
    this.preWalk(this.ed, { x: 175, y: 324 }, { x: 148, y: 284 }, 45, 55);
    this.preWalk(this.chicken, { x: 248, y: 320 }, { x: 231, y: 271 }, 45, 59);
    this.preWalk(this.courage, { x: 278, y: 318 }, { x: 288, y: 284 }, 45, 60);
    this.preWalk(this.dexter, { x: 330, y: 322 }, { x: 303, y: 220 }, 45, 53);

    this.preWalk(this.deedee, { x: -9, y: 105 }, { x: 157, y: 125 }, 70, 85);
    this.preWalk(this.bubbles, { x: 411, y: 106 }, { x: 206, y: 126 }, 70, 85);
    this.preWalk(this.buttercup, { x: -7, y: 53 }, { x: 111, y: 126 }, 70, 85);
    this.preWalk(this.blossom, { x: 468, y: 65 }, { x: 303, y: 125 }, 70, 85);
    this.preWalk(this.suzie, { x: -10, y: 140 }, { x: 256, y: 125 }, 70, 85);

    this.items.map((i) => {
      i.sprite.texture = getMemberTexture("wrong")!;
      i.sprite.visible = false;
    });

    this.frameCallbacks.push({
      frame: 100 - 45,
      callback: () => {
        this.game.sign.setOnClose(() => {
          this.game.inventory.setMode(InventoryMode.SELECT);
          this.game.inventory.openInventory();
        });
        this.game.sign.showCharacterMessage(
          "block.35",
          this.game.gameData!.scene["plugMyHoles"]
        );
      },
    });
  }

  public play(): void {
    this.playing = true;
  }

  private showEnd() {
    this.game.sound.disco.stop();
    this.game.sound.crowd.stop();
    this.game.sound.win.play();
    this.endMessage = true;
    this.msg.visible = true;
    this.msg.texture = getMemberTexture("end.win")!;

    this.didWin = true;

    //
  }

  private postWalk(char: Char, x1: number, y1: number, x2: number, y2: number) {
    const start = this.currentFrame + 2;
    const end = this.currentFrame + 2 + 10;
    this.moveAnims.push({
      sprite: char.sprite,
      from: { x: x1, y: y1 },
      to: { x: x2, y: y2 },
      startFrame: start,
      endFrame: end,
    });
  }

  private win() {
    this.endMessage = true;

    this.items.map((i) => (i.sprite.visible = false));

    const boys = [
      this.dexter,
      this.chicken,
      this.courage,
      this.baboon,
      this.ed,
    ];

    this.items.map((i, idx) =>
      boys[idx].sprite.position.set(i.sprite.position.x, i.sprite.position.y)
    );

    this.postWalk(this.devil, -5, 34, 100, 88);
    this.postWalk(this.eustace, 5, 311, 99, 221);
    this.postWalk(this.mojo, 106, 332, 127, 267);
    this.postWalk(this.cow, 210, 329, 208, 278);
    this.postWalk(this.mandark, 416, 259, 320, 220);
    this.postWalk(this.mayor, 365, 322, 289, 267);
    this.postWalk(this.og, 389, 46, 324, 84);

    this.frameCallbacks.push({
      frame: this.currentFrame + 2 + 190 - 140,
      callback: () => {
        this.showEnd();
      },
    });
  }

  private lose() {
    console.log("you lose!");
    this.game.sound.crowd.stop();
    this.game.sound.disco.stop();
    this.endMessage = true;
    this.items.map((i) => (i.sprite.visible = false));
    this.msg.visible = true;
  }

  private calculateEnd() {
    const winning = ["dexter", "chicken", "courage", "baboon", "edd"];
    const chars = [
      this.baboon,
      this.bravo,
      this.ed,
      this.chicken,
      this.dexter,
      this.courage,
    ];

    chars.map((c) => c.sprite.position.set(-500, -500));

    const selected = Array.from(this.game.inventory.selection);

    const won =
      selected.length == 5 &&
      winning.every((s, i) => {
        return s == selected[i];
      });

    console.log(selected, won);

    selected.map((s, i) => {
      this.items[i].sprite.texture = getMemberTexture(s)!;
    });

    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        this.items[i].sprite.visible = true;

        if (i < selected.length && selected[i] == winning[i]) {
          this.game.sound.correct.play();
        } else {
          this.game.sound.incorrect.play();
        }

        if (i == 4) {
          setTimeout(() => {
            if (won) {
              this.win();
            } else {
              this.lose();
            }
          }, 1000);
        }
      }, i * 1000);
      //
    }
  }

  protected onFrame(): void {
    this.floor.tick();

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
