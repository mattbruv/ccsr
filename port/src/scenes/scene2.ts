import * as PIXI from "pixi.js";
import { Game, getMemberTexture } from "../game";
import { InventoryMode } from "../inventory";
import { GameScene, MoveAnimation } from "../scene";
import { Key } from "../types";

export class Scene2 extends GameScene {
  public court: PIXI.Container;

  public robot: PIXI.Sprite;
  public head: PIXI.Sprite;

  public ballLeftArm: PIXI.Sprite;
  public ballLeftLeg: PIXI.Sprite;

  public ballRightArm: PIXI.Sprite;
  public ballRightLeg: PIXI.Sprite;

  public ballHead: PIXI.Sprite;

  public dexter: PIXI.Sprite;
  public longhair: PIXI.Sprite;

  public dexterWalking = true;
  public longhairWalking = true;

  constructor(game: Game) {
    super(game);
    this.court = new PIXI.Container();

    this.robot = new PIXI.Sprite(getMemberTexture("robot.1"));
    this.robot.anchor.set(0.5);
    this.robot.position.set(416 / 2 - 4, 91);

    this.head = new PIXI.Sprite(getMemberTexture("head"));
    this.head.anchor.set(0.5, 0.5);
    this.head.position.set(416 / 2 - 4, 45);

    //this.head.visible = false;

    this.ballHead = new PIXI.Sprite(getMemberTexture("tennis"));
    this.ballLeftArm = new PIXI.Sprite(getMemberTexture("tennis"));
    this.ballLeftLeg = new PIXI.Sprite(getMemberTexture("tennis"));
    this.ballRightArm = new PIXI.Sprite(getMemberTexture("tennis"));
    this.ballRightLeg = new PIXI.Sprite(getMemberTexture("tennis"));

    this.dexter = new PIXI.Sprite(getMemberTexture("dexter.armor"));
    this.dexter.anchor.set(0.5);
    this.dexter.position.set(171, 319);
    this.dexter.visible = false;

    this.longhair = new PIXI.Sprite(getMemberTexture("player.normal.right.1"));
    this.longhair.anchor.set(0.5);
    this.longhair.position.set(232, 340);

    const mask = new PIXI.Graphics();
    mask.beginFill(0xff00ff);
    mask.drawRect(0, 0, 416, 320);

    const grass = new PIXI.TilingSprite(getMemberTexture("tile.2")!);
    grass.width = 421;
    grass.height = 334;

    const tennisCourt = new PIXI.Sprite(getMemberTexture("101"));
    tennisCourt.anchor.set(0.5);
    tennisCourt.position.set(208, 358);
    //tennisCourt.position.set(10, 10);

    this.court.addChild(grass);
    this.court.addChild(tennisCourt);

    this.court.addChild(this.robot);
    this.court.addChild(this.head);
    this.court.addChild(this.ballHead);
    this.court.addChild(this.ballLeftArm);
    this.court.addChild(this.ballLeftLeg);
    this.court.addChild(this.ballRightArm);
    this.court.addChild(this.ballRightLeg);

    this.court.addChild(this.dexter);
    this.court.addChild(this.longhair);

    this.container.addChild(this.court);
    this.container.addChild(mask);
    this.court.mask = mask;

    this.moveAnims.push({
      sprite: this.dexter,
      from: { x: 171, y: 319 },
      to: { x: 171, y: 191 },
      startFrame: 10,
      endFrame: 75 - 45,
    });

    this.moveAnims.push({
      sprite: this.longhair,
      from: { x: 242, y: 340 },
      to: { x: 274, y: 269 },
      startFrame: 60 - 45,
      endFrame: 69 - 45,
    });

    this.frameCallbacks.push({
      frame: 69 - 45,
      callback: () => {
        this.longhairWalking = false;
      },
    });

    this.frameCallbacks.push({
      frame: 10,
      callback: () => {
        this.dexter.visible = true;
      },
    });

    this.frameCallbacks.push({
      frame: 75 - 45,
      callback: () => {
        this.dexterWalking = false;
      },
    });

    this.frameCallbacks.push({
      frame: 70 - 45,
      callback: () => {
        this.longhair.texture = getMemberTexture("player.normal.left.1")!;
        this.longhair.position.set(279, 260);
      },
    });
  }

  public exit(): void {
    this.game.sound.playTheme();
    this.game.inventory.setMode(InventoryMode.NORMAL);
    //this.game.player.setMapAndPosition("0304", 10, 17);
  }

  public init(): void {}

  public play(): void {
    this.playing = true;
  }

  protected onFrame(): void {
    if (this.dexterWalking) {
      this.dexter.texture =
        this.currentFrame % 2 == 0
          ? getMemberTexture("dexter.armor")!
          : getMemberTexture("dexter.armor.2")!;
    }

    if (this.longhairWalking) {
      this.longhair.texture =
        this.currentFrame % 2 == 0
          ? getMemberTexture("player.normal.right.1")!
          : getMemberTexture("player.normal.right.2")!;
    }

    if (this.game.keyPressed(Key.ENTER)) {
      if (this.game.sign.isOpen()) {
        this.game.sign.closeMessage();
      } else {
        if (this.game.inventory.isOpen()) {
          this.game.inventory.closeInventory();
          //this.calculateEnd();
        }
        /*
        else if (this.sign.visible) {
          this.sign.visible = false;
          this.exitButton.visible = true;
        }*/
      }
      this.game.keysPressed.delete(Key.ENTER);
    }
  }
}
