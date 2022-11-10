import * as PIXI from "pixi.js";
import { Sprite } from "pixi.js";
import { Game, getMemberTexture } from "../game";
import { InventoryMode } from "../inventory";
import { PlayerDirection } from "../player";
import { GameScene, MoveAnimation } from "../scene";
import { Key } from "../types";

export class Scene4 extends GameScene {
  public disco: PIXI.Container;

  public didWin = false;

  public msg: PIXI.Sprite;

  public buttonExit: PIXI.Sprite;

  public endMessage = false;

  constructor(game: Game) {
    super(game);
    this.disco = new PIXI.Container();

    this.msg = new PIXI.Sprite(getMemberTexture("end.lose"));

    this.msg.visible = false;

    this.msg.anchor.set(0.5);

    this.msg.position.set(208, 160);

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

    const mask = new PIXI.Graphics();
    mask.beginFill(0xff00ff);
    mask.drawRect(0, 0, 416, 320);

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

  public init(): void {
    this.currentFrame = 0;
    this.game.sound.pauseTheme();

    this.frameCallbacks = [];
    this.moveAnims = [];
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
