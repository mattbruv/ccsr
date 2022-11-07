import { EpisodeScript } from "../script";
import { Scene1 } from "../scenes/scene1";
import { getMapRect, getMapsRect } from "../game";
import * as PIXI from "pixi.js";
import { Rect } from "../types";

const maskOverworld = new PIXI.Graphics();

export class Episode1 extends EpisodeScript {
  onNewMap(nextMap: string): void {}

  onDoor(nextMap: string): void {}

  public init(): void {
    const m: Rect = getMapsRect("0101", "0606");
    maskOverworld.beginFill(0xffffff);
    maskOverworld.drawRect(m.x, m.y, m.width, m.height);
    this.game.viewport.addChild(maskOverworld);
    this.game.worldContainer.mask = maskOverworld;

    this.game.camera.setCameraBounds("0101", "0606");

    const startMap = "0106";
    this.game.setMap(startMap);
    this.game.player.setMapAndPosition(startMap, 6, 8);
    this.game.camera.setScale();
    this.game.camera.snapCameraToMap(startMap);
    this.game.addScene("ending", new Scene1(this.game));
  }
}
