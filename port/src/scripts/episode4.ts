import * as PIXI from "pixi.js";
import { getMapRect, getMapsRect } from "../game";
import { Scene4 } from "../scenes/scene4";
import { EpisodeScript } from "../script";
import { Rect } from "../types";

const maskOverworld = new PIXI.Graphics();
const maskDisco = new PIXI.Graphics();
const maskHotel = new PIXI.Graphics();

export class Episode4 extends EpisodeScript {
  onNewMap(nextMap: string): void {
    switch (nextMap) {
      case "0703": {
        this.game.camera.setCameraBounds("0703", "0703");
        this.game.viewport.mask = maskDisco;
        break;
      }
      case "0706": {
        this.game.camera.setCameraBounds("0101", "0706");
        this.game.viewport.mask = maskOverworld;
        break;
      }
      case "0705":
      case "0704": {
        this.game.camera.setCameraBounds("0704", "0705");
        this.game.viewport.mask = maskHotel;
        break;
      }
      default: {
        this.game.camera.setCameraBounds("0101", "0606");
        this.game.viewport.mask = maskOverworld;
        break;
      }
    }
  }

  public init(): void {
    let m: Rect = getMapsRect("0101", "0606");
    maskOverworld.beginFill(0xffffff);
    maskOverworld.drawRect(m.x, m.y, m.width, m.height);
    m = getMapRect("0706");
    maskOverworld.drawRect(m.x, m.y, m.width, m.height);

    m = getMapRect("0703");
    maskDisco.beginFill(0xffff00);
    maskDisco.drawRect(m.x, m.y, m.width, m.height);

    m = getMapsRect("0704", "0705");

    maskHotel.beginFill(0xffff00);
    maskHotel.drawRect(m.x, m.y, m.width, m.height);

    this.game.worldContainer.addChild(maskOverworld);
    this.game.worldContainer.addChild(maskDisco);
    this.game.worldContainer.addChild(maskHotel);

    this.game.viewport.mask = maskDisco;

    const startMap = "0703";
    this.game.setMap(startMap);
    this.game.player.setMapAndPosition(startMap, 11, 10);
    this.game.camera.setScale();
    this.game.camera.snapCameraToMap(startMap);
    this.game.camera.setCameraBounds("0703", "0703");

    this.game.filmLoopData = {
      "block.165": ["orange", "yellow", "green", "purple", "red"],
      "block.166": ["yellow", "green", "purple", "red", "orange"],
      "block.167": ["green", "purple", "red", "orange", "yellow"],
      "block.168": ["purple", "red", "orange", "yellow", "green"],
      "block.169": ["red", "orange", "yellow", "green", "purple"],
    };

    this.game.setFilmLoopObjects();
    this.game.addScene("ending", new Scene4(this.game));

    this.game.playScene("ending");
  }
}
