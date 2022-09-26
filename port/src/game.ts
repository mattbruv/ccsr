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
      height: 3320,
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

    const infoSet = new Set();

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
        ];
        if (!view.includes(obj.data.item.type)) {
          continue;
        }
        const move = [
          obj.data.move.U,
          obj.data.move.L,
          obj.data.move.R,
          obj.data.move.D,
        ];
        //if (obj.HSHIFT == 0 || obj.WSHIFT == 0) continue;
        //if (obj.member.includes("tile.3")) {
        // continue;
        // }

        if (!move.some((x) => x != 0)) {
          continue;
        }
        console.log(obj.data.move.COND, obj.data.item.COND);

        const gameObject = new GameObject(obj, area.name);
        this.worldContainer.addChild(gameObject.sprite);
        this.gameObjects.push(gameObject);
      }
    }
    console.log(infoSet);
  }
}
