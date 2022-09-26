import * as PIXI from "pixi.js";
import { Loader } from "pixi.js";
import { loadAssets } from "./load";
import { GameObject } from "./object";
import { GameMapArea, GameObjectType } from "./types";

export class Game {
  public app;
  private gameObjects: GameObject[] = [];
  private worldContainer: PIXI.Container;

  constructor() {
    this.app = new PIXI.Application({
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
      backgroundColor: 0x6495ed,
      width: 2416,
      height: 2320,
      antialias: false,
      //resizeTo: window,
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
        if (obj.member.toLowerCase().includes("tile")) {
          continue;
        }
        const gameObject = new GameObject(obj, area.name);
        this.worldContainer.addChild(gameObject.sprite);
        this.gameObjects.push(gameObject);
      }
    }
    console.log(
      this.gameObjects.filter((x) => !x.member.includes("tile")).length
    );
    console.log(this.gameObjects.length);
  }
}
