import * as PIXI from "pixi.js";
import { EpisodeScript } from "../script";
import { Scene2 } from "../scenes/scene2";
import { getMapRect, getMapsRect } from "../game";
import { Rect } from "../types";

const maskOverworld = new PIXI.Graphics();
const maskBookRoom = new PIXI.Graphics();


export class Scooby2 extends EpisodeScript {

  public showFinalRoom = false;


  onNewMap(nextMap: string): void {
    switch (nextMap) {
      case "0301": {
        this.game.camera.setCameraBounds("0301", "0301");
        this.game.viewport.mask = maskBookRoom;
        break;
      }
      default: {
        if (this.showFinalRoom === false && this.game.inventory.has("painting")) {
          const m = getMapRect("0302");
          maskOverworld.drawRect(m.x, m.y, m.width, m.height);
          this.showFinalRoom = true;
        }

        this.game.camera.setCameraBounds("0101", "0303");
        this.game.viewport.mask = maskOverworld;
        break;
      }
    }
  }

  public init(): void {

    let m: Rect = getMapsRect("0101", "0203");
    maskOverworld.beginFill(0xffffff);
    maskOverworld.drawRect(m.x, m.y, m.width, m.height);
    m = getMapRect("0303");
    maskOverworld.drawRect(m.x, m.y, m.width, m.height);

    m = getMapRect("0301");
    maskBookRoom.beginFill(0xff00ff);
    maskBookRoom.drawRect(m.x, m.y, m.width, m.height);

    this.game.worldContainer.addChild(maskOverworld);
    this.game.worldContainer.addChild(maskBookRoom);
    this.game.viewport.mask = maskOverworld;

    const startMap = "0203";
    this.game.setMap(startMap);
    this.game.player.setMapAndPosition(startMap, 15, 16);
    this.game.camera.setScale();
    this.game.camera.snapCameraToMap(startMap);
    this.game.camera.setCameraBounds("0101", "0303");

    this.game.filmLoopData = {};
    this.game.setFilmLoopObjects();

    this.game.addScene("ending", new Scene2(this.game));

    // Fix secret book room BG texture leaking into map 0201
    const wallTexture = this.game.gameObjects.find(
      x => x.mapName === "0301" &&
        x.member == "block.70" &&
        x.location[0] === 1
    );

    if (wallTexture) {
      wallTexture.setVisible(false)
    }
  }
}
