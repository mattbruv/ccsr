import * as PIXI from "pixi.js";
import { Viewport } from "pixi-viewport";
import { Loader } from "pixi.js";
import { loadAssets } from "./load";
import { GameObject } from "./object";
import { GameMapArea } from "./types";

export class Game {
  private app;
  private viewport: Viewport;
  private gameObjects: GameObject[] = [];
  private worldContainer: PIXI.Container;
  private backgroundTexture: PIXI.RenderTexture;
  private backgroundSprite: PIXI.Sprite;

  constructor() {
    this.app = new PIXI.Application({
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
      backgroundColor: 0xff00ff,
      width: 2496, // 1416, // 2496
      height: 2080, // 320,
      antialias: false,
      resizeTo: window,
    });

    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

    this.viewport = new Viewport({
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      worldWidth: 4000,
      worldHeight: 4000,

      interaction: this.app.renderer.plugins.interaction,
      // the interaction module is important for wheel to work properly
      // when renderer.view is placed or scaled
    });

    this.app.stage.addChild(this.viewport);
    this.viewport.drag().pinch().wheel(); //.decelerate();

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
    this.backgroundSprite = new PIXI.Sprite();

    this.viewport.addChild(this.worldContainer);
    //this.app.stage.addChild(this.worldContainer);

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

    // Convert all objects in map data to GameObjects
    for (const area of data) {
      for (const obj of area.data) {
        // Either the parser is bugged or there is a bug in the map data
        // for episode 2, there's an object which is bad. Skip past it.
        if (obj.member === undefined) {
          continue;
        }
        const gameObject = new GameObject(obj, area.name);
        this.gameObjects.push(gameObject);
      }
    }

    // Loop through all static objects and render them to the background
    this.gameObjects
      .filter((x) => x.isStatic())
      .sort((a, b) =>
        // We have to sort here to draw the objects that use tiles first
        a.member.includes("tile") && !b.member.includes("tile") ? -1 : 1
      )
      .map((obj) => {
        this.drawObjectToBackground(obj);
      });

    // Update background sprite texture and add it to scene
    this.backgroundSprite.texture = this.backgroundTexture;
    this.backgroundSprite.texture.update();
    this.worldContainer.addChild(this.backgroundSprite);

    // Now add all of the dyanmic sprites to the scene.
    this.gameObjects
      .filter((x) => !x.isStatic())
      .map((obj) => {
        this.worldContainer.addChild(obj.sprite);
      });

    console.log("Game Objects: " + this.gameObjects.length);
    console.log("Scene objects: " + this.worldContainer.children.length);
  }

  private drawObjectToBackground(object: GameObject) {
    this.app.renderer.render(object.sprite, {
      clear: false,
      renderTexture: this.backgroundTexture,
    });
  }
}

export function getMemberTexture(memberName: string) {
  let name = memberName.toLowerCase();
  name = name + ".png";
  name = name.replace(".x.", ".");
  return PIXI.Loader.shared.resources["textures1"].spritesheet?.textures[name];
}

/*
  GPU PROFILING TESTS

  EMPTY            = 14% GPU
  25 TilingSprites = 33% GPU
  34 TilingSprites = 37% GPU
  34 Sprites       = 14% GPU
  1345 Sprites     = 19% GPU
*/
