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
      "block.159": {
        texture: {
          loopTextures: ["block.159b", "block.160"],
          delay: 3,
        }
      },
      "block.39": {
        texture: {
          loopTextures: ["block.39b"],
          delay: 4,
        }
      }
    };

    this.game.setFilmLoopObjects();

    this.game.addScene("ending", new Scene2(this.game));
  }
}
