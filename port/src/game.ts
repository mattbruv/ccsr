import * as PIXI from "pixi.js";
import { Viewport } from "pixi-viewport";
import { Loader } from "pixi.js";
import { loadAssets } from "./load";
import { GameObject } from "./object";
import { GameMapArea, GameObjectType, Key, Rect } from "./types";
import { EpisodeScript } from "./scripts/episodeScript";
import { Episode1 } from "./scripts/episode1";
import { Player, PlayerDirection, PlayerState, PlayerStatus } from "./player";
import { intersect } from "./collision";

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

  public debugGraphics: PIXI.Graphics;

  private currentMap: string = "";

  private script: EpisodeScript;

  // Key input
  public readonly keysPressed = new Set<string>();

  // frame timing
  private lastUpdate = Date.now();
  private readonly targetFPS = 12;
  private readonly MSperTick = 1000 / this.targetFPS;

  constructor() {
    this.app = new PIXI.Application({
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
      backgroundColor: 0xff00ff,
      width: 416,
      height: 320,
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
    this.viewport.drag().pinch().wheel();
    this.enableDebugControls(true);

    this.worldContainer = new PIXI.Container();

    /*
      We need to create a giant map texture to render
      all the static (non-moving) graphics in the map.

      I tried rendering everything as tiling sprites,
      but it is was too resource demanding.
    */
    this.backgroundTexture = this.newRenderTexture();
    this.backgroundSprite = new PIXI.Sprite();

    this.viewport.addChild(this.worldContainer);
    this.debugGraphics = new PIXI.Graphics();

    //this.app.stage.addChild(this.worldContainer);

    // Load Episode 1 assets/scripts
    this.script = new Episode1(this);

    loadAssets(1, () => {
      console.log("Done loading assets!");
      this.init();
    });

    // Add our update function to run every browser frame
    this.app.ticker.add((dt) => this.update(dt));
  }

  private newRenderTexture() {
    return PIXI.RenderTexture.create({
      width: 4000,
      height: 4000,
    });
  }

  private update(delta: number) {
    const now = Date.now();

    if (this.lastUpdate + this.MSperTick > now) {
      return;
    }
    this.lastUpdate = now;

    if (this.player.status == PlayerStatus.MOVE) {
      const left = this.keyPressed(Key.LEFT) ? -1 : 0;
      const right = this.keyPressed(Key.RIGHT) ? 1 : 0;
      const up = this.keyPressed(Key.UP) ? -1 : 0;
      const down = this.keyPressed(Key.DOWN) ? 1 : 0;
      this.movePlayer(left + right, up + down);
    }
  }

  private movePlayer(dx: number, dy: number) {
    // player isn't moving, stop the walking sound
    if (dx == 0 && dy == 0) {
      // TODO
      return;
    }

    const pos = this.player.getPosition();
    const newX = pos.x + dx * this.player.speed;
    const newY = pos.y + dy * this.player.speed;

    // TODO

    // Check to see if we need to scroll the map
    // This should be a toggleable setting in the future

    // Check interaction with game objects
    // Search through objects in reverse order
    // Get the first object that we collide with

    // This could be a tiny bug if the player's texture is
    //  supposed to change and it's not a 32x32 size
    const newPlayerRect = this.player.getCollisionRectAtPoint(newX, newY);

    const collisionObject = this.gameObjects.find(
      (obj) =>
        obj.data.item.type != GameObjectType.FLOR &&
        intersect(newPlayerRect, obj.getRect())
    );

    if (collisionObject) {
      const g = this.debugGraphics;
      g.clear();
      const r = newPlayerRect;
      const d = collisionObject.getRect();
      const n = this.player.getCollisionRectAtPoint(pos.x, pos.y);
      g.lineStyle({ width: 1, color: 0x00ff00, alignment: 0 });
      g.drawRect(n.x, n.y, n.width, n.height);
      g.lineStyle({ width: 1, color: 0xffff00, alignment: 0 });
      g.drawRect(r.x, r.y, r.width, r.height);
      g.lineStyle({ width: 1, color: 0xff0000, alignment: 0 });
      g.drawRect(d.x, d.y, d.width, d.height);
      console.log("draiwngw!");
      console.log("Player attempted to walk in rect:", newPlayerRect);
      console.log("But hit: ", collisionObject.getRect());
      console.log(collisionObject);
      return;
    }

    // If we find an object...

    // First loop through its messages

    // If the person has a COND, give them an item

    // Switch over object type and handle each case differently

    this.player.setPosition(newX, newY);

    const nextFrame = this.player.frameOfAnimation + 1;
    this.player.frameOfAnimation = nextFrame > 2 ? 1 : nextFrame;

    if (dx > 0) this.player.characterDirection = PlayerDirection.RIGHT;
    if (dx < 0) this.player.characterDirection = PlayerDirection.LEFT;
    if (dx == 0)
      this.player.characterDirection = this.player.horizontalDirection;

    if (this.player.state == PlayerState.NORMAL)
      this.player.horizontalDirection = this.player.characterDirection;

    if (dy > 0) this.player.characterDirection = PlayerDirection.DOWN;
    if (dy < 0) this.player.characterDirection = PlayerDirection.UP;

    this.player.refreshTexture();
  }

  private keyPressed(key: Key) {
    return this.keysPressed.has(key);
  }

  private init() {
    this.player.init();

    this.initObjects();
    this.viewport.addChild(this.player.sprite);
    this.viewport.addChild(this.debugGraphics);

    this.script.init();

    document.getElementById("app")!.appendChild(this.app.view);
  }

  private initObjects() {
    this.backgroundTexture = this.newRenderTexture();
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

  public setCameraOnMap(mapName: string) {
    const data = getMapRect(mapName);
    this.setCamera(-data.x, -data.y);
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
