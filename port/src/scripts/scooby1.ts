import { EpisodeScript } from "../script";
import * as PIXI from "pixi.js";
import { getMapRect, getMapsRect, getMemberTexture } from "../game";
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
    this.game.camera.setCameraBounds("0101", "0404");

    this.game.filmLoopData = {
      "block.159": {
        texture: {
          loopTextures: ["block.159b", "block.160"],
          delay: 3,
        }
      },
      "block.150": {
        texture: {
          loopTextures: ["block.150b", "block.151"],
          delay: 1,
        }
      },
      "block.152": {
        texture: {
          loopTextures: ["block.152b", "block.153"],
          delay: 1,
        }
      },
      "block.39": {
        callback(gameObject) {
          // change the inital texture of the ghost
          if (gameObject.member === "block.39") {
            const tex = getMemberTexture("block.39b")!;
            gameObject.sprite.texture = tex;
          }
          // animate it fading in and out
          const alpha = Math.abs(Math.sin(gameObject.frame / 5));
          gameObject.sprite.alpha = alpha;
        },
      }
    };

    this.game.setFilmLoopObjects();

    this.game.addScene("ending", new Scene2(this.game));
  }
}
