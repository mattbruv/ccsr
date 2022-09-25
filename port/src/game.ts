import * as PIXI from "pixi.js";
import { Loader } from "pixi.js";
import { loadAssets } from "./load";
import { GameMapArea, GameObjectType } from "./types";

export class Game {
  public app;

  constructor() {
    this.app = new PIXI.Application({
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
      backgroundColor: 0x6495ed,
      width: 416,
      height: 320,
    });

    loadAssets(() => {
      console.log("Done loading assets!");
      this.init();
    });
  }

  private init() {
    document.body.appendChild(this.app.view);
    this.initObjects();
  }

  private initObjects() {
    const data: GameMapArea[] = Loader.shared.resources["map1"].data;
    const first = data[0];

    for (const obj of first.data) {
      if (obj.data.item.type == GameObjectType.FLOR) {
        console.log(obj);
      }
    }
  }
}