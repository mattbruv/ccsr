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
      width: 3416,
      height: 2320,
      antialias: false,
      //resizeTo: window,
    });

    //PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

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
        //if (obj.member.toLowerCase().includes("tile")) {
        const view = [
          GameObjectType.CHAR, //
          GameObjectType.ITEM,
          GameObjectType.FLOR,
          GameObjectType.WALL,
          GameObjectType.FLOR,
          GameObjectType.CHAR,
          GameObjectType.DOOR,
          GameObjectType.WATER,
        ];

        if (!view.includes(obj.data.item.type)) {
          continue;
        }

        const gameObject = new GameObject(obj, area.name);
        this.worldContainer.addChild(gameObject.sprite);
        this.gameObjects.push(gameObject);
      }
    }
  }
}
