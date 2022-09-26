import * as PIXI from "pixi.js";
import { Loader, Sprite } from "pixi.js";
import { loadAssets } from "./load";
import { GameObject } from "./object";
import { GameMapArea, GameObjectType } from "./types";

export class Game {
  public app;
  private gameObjects: GameObject[] = [];
  private worldContainer: PIXI.Container;
  private backgroundTexture: PIXI.RenderTexture;

  constructor() {
    this.app = new PIXI.Application({
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
      backgroundColor: 0xff00ff,
      width: 1416,
      height: 320,
      antialias: false,
      //resizeTo: window,
    });

    //PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

    this.worldContainer = new PIXI.Container();

    /*
      We need to create a giant map texture to render
      all the static (non-moving) graphics in the map.

      I tried rendering everything as tiling sprites,
      but it is was too resource demanding.
    */
    this.backgroundTexture = PIXI.RenderTexture.create({
      width: 4000,
      height: 4000,
    });

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
        const gameObject = new GameObject(obj, area.name);
        this.worldContainer.addChild(gameObject.sprite);
        this.gameObjects.push(gameObject);
      }
      break;
    }
    console.log(this.gameObjects.length);
    console.log(this.worldContainer.children.length);
    console.log(infoSet);
  }
}

export function getMemberTexture(memberName: string) {
  let name = memberName.toLowerCase();
  name = name + ".png";
  name = name.replace(".x.", ".");
  return PIXI.Loader.shared.resources["textures1"].spritesheet?.textures[name];
}
