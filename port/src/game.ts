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
      width: 416,
      height: 320,
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
    const first = data[0];

    for (const obj of first.data) {
      this.gameObjects.push(new GameObject(obj, first.name));
      const sprite = new PIXI.Sprite(getMemberTexture(obj.member));
      sprite.position.set(Math.random() * 200, Math.random() * 200);
      this.worldContainer.addChild(sprite);
    }

    console.log(this.gameObjects);
  }
}

function getMemberTexture(memberName: string) {
  let name = memberName; //.toLowerCase();
  name = name + ".png";
  name = name.replace(".x.", ".");
  console.log(name);
  return PIXI.Loader.shared.resources["textures1"].spritesheet?.textures[name];
}
