import * as PIXI from "pixi.js";
import { Loader } from "pixi.js";
import { loadAssets } from "./load";
import { GameObject } from "./object";
import { GameMapArea } from "./types";

export class Game {
  public app;
  private gameObjects: GameObject[] = [];
  private worldContainer: PIXI.Container;

  constructor() {
    this.app = new PIXI.Application({
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
      backgroundColor: 0x6495ed,
      width: 1416,
      height: 1320,
    });

    this.worldContainer = new PIXI.Container();

    this.app.stage.addChild(this.worldContainer);

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

    for (const area of data) {
      for (const obj of area.data) {
        const gameObject = new GameObject(obj, area.name);
        this.worldContainer.addChild(gameObject.sprite);
        this.gameObjects.push(gameObject);
      }
    }
  }
}
