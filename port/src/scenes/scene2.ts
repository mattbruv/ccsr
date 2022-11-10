import * as PIXI from "pixi.js";
import { Sprite } from "pixi.js";
import { Game, getMemberTexture } from "../game";
import { InventoryMode } from "../inventory";
import { GameScene, MoveAnimation } from "../scene";
import { Key } from "../types";

export class Scene2 extends GameScene {
  public court: PIXI.Container;

  public robot: PIXI.Sprite;
  public head: PIXI.Sprite;
  public HD = [
    { x: 204, y: 59 },
    { x: 204, y: 189 },
    { x: 204, y: 317 },
  ];

  public ballLeftArm: PIXI.Sprite;
  public LA = [
    { x: 128, y: 96 },
    { x: 65, y: 121 },
    { x: -200, y: -200 },
  ];

  public ballLeftLeg: PIXI.Sprite;
  public LL = [
    { x: 154, y: 114 },
    { x: 61, y: 152 },
    { x: 13, y: 197 },
  ];

  public ballRightArm: PIXI.Sprite;
  public RA = [
    { x: 282, y: 96 },
    { x: 362, y: 153 },
    { x: 1000, y: 1000 },
  ];

  public ballRightLeg: PIXI.Sprite;
  public RL = [
    { x: 254, y: 114 },
    { x: 354, y: 120 },
    { x: 420, y: 120 },
  ];

  public ballHead: PIXI.Sprite;

  public dexter: PIXI.Sprite;
  public longhair: PIXI.Sprite;

  public dexterWalking = true;
  public longhairWalking = true;

  public isStomping = true;

  public itemSprites: PIXI.Sprite[] = [];

  constructor(game: Game) {
    super(game);
    this.court = new PIXI.Container();

    this.robot = new PIXI.Sprite(getMemberTexture("robot.1"));
    this.robot.height = this.robot.height * 1.2;
    this.robot.anchor.set(0.5);
    this.robot.position.set(416 / 2 - 4, 91);

    this.head = new PIXI.Sprite(getMemberTexture("head"));
    this.head.height = this.head.height * 1.2;
    this.head.anchor.set(0.5, 0.5);
    this.head.position.set(416 / 2 - 4, 35);

    //this.head.visible = false;

    this.ballHead = new PIXI.Sprite(getMemberTexture("tennis"));
    this.ballLeftArm = new PIXI.Sprite(getMemberTexture("tennis"));
    this.ballLeftLeg = new PIXI.Sprite(getMemberTexture("tennis"));
    this.ballRightArm = new PIXI.Sprite(getMemberTexture("tennis"));
    this.ballRightLeg = new PIXI.Sprite(getMemberTexture("tennis"));

    this.ballHead.anchor.set(0.5);
    this.ballLeftArm.anchor.set(0.5);
    this.ballLeftLeg.anchor.set(0.5);
    this.ballRightLeg.anchor.set(0.5);
    this.ballRightArm.anchor.set(0.5);

    this.ballHead.scale.set(0.6);
    this.ballLeftArm.scale.set(0.6);
    this.ballLeftLeg.scale.set(0.6);
    this.ballRightArm.scale.set(0.6);
    this.ballRightLeg.scale.set(0.6);

    this.court.interactive = true;
    this.court.on("pointerdown", (e: PIXI.InteractionEvent) => {
      const pos = e.data.global;
      console.log(
        pos.x / this.game.camera.scaleX - 8,
        pos.y / this.game.camera.scaleY
      );
    });

    this.ballHead.position.set(204, 59);
    this.ballLeftArm.position.set(128, 96);
    this.ballLeftLeg.position.set(154, 114);
    this.ballRightArm.position.set(282, 96);
    this.ballRightLeg.position.set(254, 114);

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
      to: { x: 171, y: 193 },
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

    this.frameCallbacks.push({
      frame: 45,
      callback: () => {
        this.game.sign.setOnClose(() => {
          this.game.inventory.setMode(InventoryMode.SELECT);
          this.game.inventory.openInventory();
        });
        this.game.sign.showCharacterMessage(
          "block.130",
          this.game.gameData!.scene["plugMyHoles"]
        );
      },
    });

    const itemlocs = [
      [158, 122], //
      [253, 126],
      [128, 88],
      [288, 86],
      [204, 48],
    ];

    itemlocs.map((pos) => {
      const s = new Sprite(getMemberTexture("wrong"));
      s.anchor.set(0.5);
      s.position.set(pos[0], pos[1]);
      s.visible = true;
      this.itemSprites.push(s);
      this.court.addChild(s);
    });

    //this.itemSprites[0].texture = getMemberTexture("wig")!;
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

  private calculateEnd() {
    const winning = ["turnip", "nutlog", "wig", "octo", "burger", "pineapple"];
    const chosen = Array.from(this.game.inventory.selection);
    const won = chosen.every((i) => winning.includes(i));

    for (let i = 0; i < chosen.length; i++) {
      this.itemSprites[i].texture = getMemberTexture(chosen[i])!;
    }

    console.log(chosen, won);
  }

  protected onFrame(): void {
    const robotframe = this.currentFrame % 7;
    const robotlookup = [1, 2, 3, 2, 1, 4, 5];

    if (this.isStomping) {
      this.robot.texture = getMemberTexture(
        `robot.${robotlookup[robotframe].toString()}`
      )!;
    }

    const lf = (this.currentFrame + 3) % 3;
    const hf = (this.currentFrame + 3 - 1) % 3;
    const rf = (this.currentFrame + 3 - 2) % 3;

    this.ballLeftArm.position.set(this.LA[lf].x, this.LA[lf].y);
    this.ballRightArm.position.set(this.RA[rf].x, this.RA[rf].y);
    this.ballLeftLeg.position.set(this.LL[lf].x, this.LL[lf].y);
    this.ballRightLeg.position.set(this.RL[hf].x, this.RL[hf].y);
    this.ballHead.position.set(this.HD[hf].x, this.HD[hf].y);

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
          this.calculateEnd();
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
