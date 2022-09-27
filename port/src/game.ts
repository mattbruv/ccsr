import * as PIXI from "pixi.js";
import { Viewport } from "pixi-viewport";
import { Loader } from "pixi.js";
import { loadAssets } from "./load";
import { GameObject } from "./object";
import { GameMapArea, GameObjectType, Rect } from "./types";
import { EpisodeScript } from "./scripts/episodeScript";
import { Episode1 } from "./scripts/episode1";
import { Player } from "./player";

export const MAP_WIDTH = 416;
export const MAP_HEIGHT = 320;

export class Game {
  public app;
  public viewport: Viewport;

  public player: Player = new Player();
  public gameObjects: GameObject[] = [];

  public worldContainer: PIXI.Container;
  public backgroundTexture: PIXI.RenderTexture;
  public backgroundSprite: PIXI.Sprite;
  private currentMap: string = "";

  private script: EpisodeScript;

  constructor() {
    this.app = new PIXI.Application({
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
      backgroundColor: 0xff00ff,
      width: 416,
      height: 320,
      antialias: false,
      //resizeTo: window,
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
    this.viewport.drag().pinch().wheel();
    this.enableDebugControls(false);

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

    // Load Episode 1 assets/scripts
    this.script = new Episode1(this);

    loadAssets(1, () => {
      console.log("Done loading assets!");
      this.init();
    });
  }

  private init() {
    this.player.init();

    this.initObjects();
    this.viewport.addChild(this.player.sprite);

    this.script.init();

    document.getElementById("app")!.appendChild(this.app.view);
  }

  private initObjects() {
    this.backgroundTexture = PIXI.RenderTexture.create({
      width: 4000,
      height: 4000,
    });
    this.viewport.removeChild(this.worldContainer);
    this.worldContainer = new PIXI.Container();
    this.viewport.addChild(this.worldContainer);
    this.gameObjects = [];
    const data: GameMapArea[] = Loader.shared.resources["map"].data;

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

    console.log("Game objects: " + this.gameObjects.length);
    console.log("Scene objects: " + this.worldContainer.children.length);
  }

  private drawObjectToBackground(object: GameObject) {
    this.app.renderer.render(object.sprite, {
      clear: false,
      renderTexture: this.backgroundTexture,
    });
  }

  public setMap(mapName: string) {
    this.currentMap = mapName;
  }

  public getMap(): string {
    return this.currentMap;
  }

  public setCamera(x: number, y: number) {
    this.viewport.position.set(x, y);
  }

  private enableDebugControls(enabled: boolean) {
    const cb = enabled
      ? (x: string) => this.viewport.plugins.resume(x)
      : (x: string) => this.viewport.plugins.pause(x);
    cb("drag");
    cb("pinch");
    cb("wheel");
  }
}

export function getMemberTexture(memberName: string) {
  let name = memberName.toLowerCase();
  name = name + ".png";
  name = name.replace(".x.", ".");
  return PIXI.Loader.shared.resources["textures"].spritesheet?.textures[name];
}

export function getMapRect(mapName: string): Rect {
  const offset = getMapOffset(mapName);
  return {
    x: offset.x * MAP_WIDTH,
    y: offset.y * MAP_HEIGHT,
    width: MAP_WIDTH,
    height: MAP_HEIGHT,
  };
}

/*
    Maps are laid out in a grid pattern, and named XXYY
    X increases left to right, starting at 01
    Y increases top to bottom, starting at 01.
*/
export function getMapOffset(mapName: string) {
  const xIndex = mapName.substring(0, 2);
  const yIndex = mapName.substring(2, 4);

  // Subtract 1 to convert to zero based indexing.
  return {
    x: parseInt(xIndex) - 1,
    y: parseInt(yIndex) - 1,
  };
}

/*
  GPU PROFILING TESTS

  EMPTY            = 14% GPU
  25 TilingSprites = 33% GPU
  34 TilingSprites = 37% GPU
  34 Sprites       = 14% GPU
  1345 Sprites     = 19% GPU
*/
