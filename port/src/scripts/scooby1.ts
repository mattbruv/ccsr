import { EpisodeScript } from "../script";
import * as PIXI from "pixi.js";
import { getMapRect, getMapsRect } from "../game";
import { Rect } from "../types";
import { Scene2 } from "../scenes/scene2";


export class Scooby1 extends EpisodeScript {
  onNewMap(nextMap: string): void {
  }

  public init(): void {
    const startMap = "0201";
    this.game.setMap(startMap);
    this.game.player.setMapAndPosition(startMap, 12, 16);
    this.game.camera.setScale();
    this.game.camera.snapCameraToMap(startMap);

    this.game.filmLoopData = {
      "block.159": ["block.159b", "block.160"],
      "block.39": ["block.39b"]
      // "block.124": [1, 2, 3, 2, 1, 4, 5].map((n) => "robot." + n),
    };

    this.game.setFilmLoopObjects();

    this.game.addScene("ending", new Scene2(this.game));
  }
}
