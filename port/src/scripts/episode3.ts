import * as PIXI from "pixi.js";
import { getMapRect, getMapsRect } from "../game";
import { EpisodeScript } from "../script";
import { GameObjectMoveCond, Rect } from "../types";

const maskOverworld = new PIXI.Graphics();
const maskMaze = new PIXI.Graphics();
const maskHotel = new PIXI.Graphics();

export class Episode3 extends EpisodeScript {
  onNewMap(nextMap: string): void {
    switch (nextMap) {
      case "0706": {
        this.game.camera.setCameraBounds("0101", "0706");
        break;
      }
      default: {
        this.game.camera.setCameraBounds("0101", "0606");
        break;
      }
    }
    console.log("next map!", nextMap);
  }

  onDoor(nextMap: string): void {
    switch (nextMap) {
      case "0701":
      case "0703":
      case "0702": {
        this.game.viewport.mask = maskMaze;
        break;
      }
      case "0704":
      case "0705": {
        this.game.viewport.mask = maskHotel;
        break;
      }
      case "0706": {
        this.game.viewport.mask = maskOverworld;
      }
      default: {
        this.game.viewport.mask = maskOverworld;
        break;
      }
    }
  }

  public init(): void {
    this.game.camera.setCameraBounds("0706", "0706");

    let m: Rect = getMapsRect("0101", "0606");
    maskOverworld.beginFill(0xffffff);
    maskOverworld.drawRect(m.x, m.y, m.width, m.height);
    m = getMapRect("0706");
    maskOverworld.drawRect(m.x, m.y, m.width, m.height);

    m = getMapsRect("0701", "0703");
    maskMaze.beginFill(0xff00ff);
    maskMaze.drawRect(m.x, m.y, m.width, m.height);

    m = getMapsRect("0704", "0705");

    maskHotel.beginFill(0xffff00);
    maskHotel.drawRect(m.x, m.y, m.width, m.height);

    this.game.worldContainer.addChild(maskOverworld);
    this.game.worldContainer.addChild(maskMaze);
    this.game.worldContainer.addChild(maskHotel);

    this.game.viewport.mask = maskOverworld;

    const startMap = "0706";
    this.game.setMap(startMap);
    this.game.player.setMapAndPosition(startMap, 13, 11);
    this.game.camera.setScale();
    this.game.camera.snapCameraToMap(startMap);

    this.game.filmLoopData = {
      "block.100": ["a", "b"].map((n) => "block.100 " + n),
    };

    this.game.setFilmLoopObjects();

    // prevent maze objects from moving
    // some objects in the maze are set to move when they shouldn't
    this.game.gameObjects
      .filter((o) => o.mapName == "0702")
      .map((o) => (o.data.move.COND = GameObjectMoveCond.NONE));
  }
}
