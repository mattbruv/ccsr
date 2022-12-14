import { EpisodeScript } from "../script";
import { Scene1 } from "../scenes/scene1";
import { getMapsRect } from "../game";
import * as PIXI from "pixi.js";
import { Rect } from "../types";
import { PlayerDirection } from "../player";

const maskOverworld = new PIXI.Graphics();

export class Episode1 extends EpisodeScript {
  onNewMap(nextMap: string): void {}

  public init(): void {
    const m: Rect = getMapsRect("0101", "0606");
    maskOverworld.beginFill(0xffffff);
    maskOverworld.drawRect(m.x, m.y, m.width, m.height);
    this.game.viewport.addChild(maskOverworld);
    this.game.worldContainer.mask = maskOverworld;

    this.game.camera.setCameraBounds("0101", "0606");

    const startMap = "0106";
    this.game.setMap(startMap);
    this.game.player.setMapAndPosition(startMap, 6, 10);

    // imitate the starting position in original episode
    // starts facing left, but facing right after first move
    this.game.player.horizontalDirection = PlayerDirection.LEFT;
    this.game.player.refreshTexture();
    this.game.player.horizontalDirection = PlayerDirection.RIGHT;

    this.game.camera.setScale();
    this.game.camera.snapCameraToMap(startMap);
    this.game.addScene("ending", new Scene1(this.game));
    /*
    // DEBUG STUFF
    const i = [
      "bandaid",
      "ducktape",
      "gum",
      "tape",
      "sock",
      "firstaid", //
      "hammer",
      "chocbar",
      "sunscreen",
      "wrench",
      "tennis",
    ];
    i.map((x) => this.game.inventory.addItem(x));
    this.game.playScene("ending");
    */
  }
}
