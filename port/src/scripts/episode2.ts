import { EpisodeScript } from "../script";
import * as PIXI from "pixi.js";
import { getMapRect, getMapsRect } from "../game";
import { Rect } from "../types";
import { Scene2 } from "../scenes/scene2";

const maskOverworld = new PIXI.Graphics();
const maskCrab = new PIXI.Graphics();
const maskHotel = new PIXI.Graphics();

export class Episode2 extends EpisodeScript {
  onNewMap(nextMap: string): void {
    switch (nextMap) {
      case "0701":
      case "0702": {
        this.game.camera.setCameraBounds("0701", "0702");
        this.game.viewport.mask = maskCrab;
        break;
      }
      case "0703":
      case "0704":
      case "0705": {
        this.game.camera.setCameraBounds("0703", "0705");
        this.game.viewport.mask = maskHotel;
        break;
      }
      case "0706": {
        this.game.camera.setCameraBounds("0101", "0706");
        this.game.viewport.mask = maskOverworld;
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

    m = getMapsRect("0701", "0702");
    maskCrab.beginFill(0xff00ff);
    maskCrab.drawRect(m.x, m.y, m.width, m.height);

    m = getMapsRect("0703", "0705");
    maskHotel.beginFill(0xffff00);
    maskHotel.drawRect(m.x, m.y, m.width, m.height);

    this.game.worldContainer.addChild(maskOverworld);
    this.game.worldContainer.addChild(maskCrab);
    this.game.worldContainer.addChild(maskHotel);

    this.game.viewport.mask = maskHotel;

    const startMap = "0705";
    this.game.setMap(startMap);
    this.game.player.setMapAndPosition(startMap, 13, 10);
    this.game.camera.setScale();
    this.game.camera.snapCameraToMap(startMap);

    this.game.filmLoopData = {
      "block.124": [1, 2, 3, 2, 1, 4, 5].map((n) => "robot." + n),
    };

    this.game.setFilmLoopObjects();

    this.game.addScene("ending", new Scene2(this.game));

    const is = [
      "brak",
      "flower",
      "yoyo",
      "turnip",
      "nutlog",
      "wig",
      "octo",
      "burger",
      "pineapple",
    ];

    is.map((i) => this.game.inventory.addItem(i));

    this.game.playScene("ending");
  }
}
