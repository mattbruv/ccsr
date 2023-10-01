import * as PIXI from "pixi.js";
import { EpisodeScript } from "../script";
import { getMemberTexture } from "../game";
import { SceneScooby1 } from "../scenes/sceneScooby1";


export class Scooby1 extends EpisodeScript {
  onNewMap(nextMap: string): void {
  }

  public init(): void {
    const startMap = "0201";
    this.game.setMap(startMap);
    this.game.player.setMapAndPosition(startMap, 11, 16);
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

    // Fix ghosts
    /*
      When the map data is loaded as-is, the ghosts are supposed to move
      but they don't, probably because of inconsistencies in my engine.
      Instead of fixing the problem, we're going to do a hacky fix to the objects
      causing the problems.

      The devs appeared to put invisible walls in front of both ghosts.
      The problem is that the ghosts clip into them in my version, causing them not to move.
    */
    const ghost1 = this.game.gameObjects.find(o => o.mapName === "0204" && o.member === "block.39");
    if (ghost1) {
      ghost1.width = 60;
      /*
      ghost1.lastPos.x += 2;
      ghost1.movePos.x += 2;
      ghost1.setPosition(ghost1.posX + 2, ghost1.posY)
      */
      //ghost1.inWalkingAnimation = true;
      //ghost1.data.move.L = 0;
      //ghost1.data.move.R = 0;
    }
    const ghost2 = this.game.gameObjects.find(o => o.mapName === "0104" && o.member === "block.41");
    if (ghost2) {
      ghost2.data.move.L = 0;
      ghost2.data.move.R = 0;
      //ghost2.data.item.visi.visiAct = "";
    }

    const wall = this.game.gameObjects.find(o => o.mapName === "0104" && o.height === 208);
    if (wall) {
      wall.width = 10;
    }

    // remove any objects in top right map
    this.game.gameObjects = this.game.gameObjects.filter(o => o.mapName !== "0401");

    // fix messed up placement of mansion on first map
    const mansion = this.game.gameObjects.find(o => o.mapName === "0101" && o.member === "block.36");
    if (mansion) {
      mansion.sprite.position.y += 7;
    }


    this.game.addScene("ending", new SceneScooby1(this.game));
  }
}
