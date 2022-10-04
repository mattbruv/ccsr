import * as PIXI from "pixi.js";
import { Viewport } from "pixi-viewport";
import { Loader } from "pixi.js";
import { loadAssets } from "./load";
import { GameObject } from "./object";
import {
  GameMapArea,
  GameObjectCond,
  GameObjectMoveCond,
  GameObjectType,
  Key,
  MovableGameObject,
  Pos,
  Rect,
} from "./types";
import { EpisodeScript } from "./scripts/episodeScript";
import { Episode1 } from "./scripts/episode1";
import { Player, PlayerDirection, PlayerState, PlayerStatus } from "./player";
import { intersect, rectAinRectB } from "./collision";
import { Debugger } from "./debug";
import { GameSign } from "./sign";
import { GameInventory } from "./inventory";

export const MAP_WIDTH = 416;
export const MAP_HEIGHT = 320;

export const UI_WIDTH_PERCENT = 0.6;
export const UI_HEIGHT_PERCENT = 0.5;

export class Game {
  public app;
  public viewport: Viewport;

  public player: Player = new Player();
  public gameObjects: GameObject[] = [];
  public movingObjects: GameObject[] = [];
  public pushedObjects: GameObject[] = [];

  public numMapsX: number = 0;
  public numMapsY: number = 0;
  public worldRect: Rect | undefined;

  private debug: Debugger;

  public worldContainer: PIXI.Container;
  public backgroundTexture: PIXI.RenderTexture;
  public backgroundSprite: PIXI.Sprite;

  public sign: GameSign;
  public inventory: GameInventory;

  private currentMap: string = "";

  private script: EpisodeScript;

  // Key input
  public readonly keysPressed = new Set<string>();

  // frame timing
  private lastUpdate = Date.now();
  private readonly targetFPS = 12;
  private readonly MSperTick = 1000 / this.targetFPS;

  public smoothAnimations = true;

  constructor() {
    this.app = new PIXI.Application({
      resolution: 1,
      autoDensity: true,
      backgroundColor: 0xff00ff,
      width: 416,
      height: 320,
      antialias: false,
      resizeTo: window,
    });

    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
    PIXI.settings.ROUND_PIXELS = true;

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
    this.debug = new Debugger(this);

    // Load Episode 1 assets/scripts
    this.script = new Episode1(this);

    this.sign = new GameSign(this);
    this.inventory = new GameInventory(this);

    loadAssets(1, () => {
      console.log("Done loading assets!");
      this.init();
    });

    // Add our update function to run every browser frame
    this.app.ticker.add((dt) => {
      try {
        this.update(dt);
      } catch (error) {
        this.inventory.closeInventory();
        const message = [
          "Runtime Error! This shouldn't happen! Report this error and what you were doing to GitHub.",
          "",
          "The game might not work as expected from now on.",
          "",
          "Error:",
          (error as Error).message,
        ];
        this.sign.showMessage(message.join("\n"));
        console.log(error);
      }
    });
  }

  public resize() {
    this.sign.resize();
    this.inventory.resize();
  }

  private newRenderTexture() {
    return PIXI.RenderTexture.create({
      width: 4000,
      height: 4000,
    });
  }

  private update(delta: number) {
    const now = Date.now();

    const moveables: MovableGameObject[] = [
      this.player,
      ...this.movingObjects,
      ...this.pushedObjects,
    ];

    if (now < this.lastUpdate + this.MSperTick) {
      if (this.smoothAnimations) {
        for (const obj of moveables) {
          if (obj.inWalkingAnimation) {
            const endTime = obj.walkAnimStartMS + this.MSperTick;
            const completed = this.MSperTick - (endTime - now);
            const percentage = completed / this.MSperTick;
            const dx = percentage * (obj.nextPos.x - obj.lastPos.x);
            const dy = percentage * (obj.nextPos.y - obj.lastPos.y);
            obj.setPosition(obj.lastPos.x + dx, obj.lastPos.y + dy);
          }
        }
        if (this.player.inWalkingAnimation) {
          this.centerCameraOnPlayer();
        }
      }

      return;
    }

    for (const obj of moveables) {
      if (obj.inWalkingAnimation) {
        obj.inWalkingAnimation = false;
        obj.setPosition(obj.nextPos.x, obj.nextPos.y);
        this.centerCameraOnPlayer();
      }
    }

    this.lastUpdate = now;

    if (this.sign.isOpen()) {
      if (this.keyPressed(Key.ENTER)) {
        this.sign.closeMessage();
      }
    } else if (this.inventory.isOpen()) {
      if (this.keyPressed(Key.ENTER)) {
        this.inventory.closeInventory();
      }
    } else {
      if (
        !this.player.inWalkingAnimation &&
        this.player.status == PlayerStatus.MOVE
      ) {
        const left =
          this.keyPressed(Key.LEFT) || this.keyPressed(Key.A) ? -1 : 0;
        const right =
          this.keyPressed(Key.RIGHT) || this.keyPressed(Key.D) ? 1 : 0;
        const up = this.keyPressed(Key.UP) || this.keyPressed(Key.W) ? -1 : 0;
        const down =
          this.keyPressed(Key.DOWN) || this.keyPressed(Key.S) ? 1 : 0;
        this.movePlayer(left + right, up + down);
      }
      if (this.keyPressed(Key.ENTER)) {
        this.inventory.openInventory();
      }
    }
  }

  private updateAutoMoveObjects() {
    console.log(this.movingObjects.length);
  }

  private posAfterDeltaMove(obj: GameObject, dx: number, dy: number): Pos {
    const pos = obj.getRect();
    const newX = pos.x + dx * obj.speed;
    const newY = pos.y + dy * obj.speed;
    return { x: newX, y: newY };
  }

  /*
    Move a game object in x, y direction.
    This is affected by the collision bug with FLORs.
    That being, if a FLOR tile comes before a pushable WALL,
    the floor tile gets preference and everything below it
    is treated like it is a walkable surface, even if it
    is a pushabale wall.

    It probably never appeared in the original game
    becuase objects weren't allowed to be pushed
    outside of the maps that they reside in
  */
  private canMoveGameObject(gameObj: GameObject, toPos: Pos): boolean {
    const newRect: Rect = {
      x: toPos.x,
      y: toPos.y,
      width: gameObj.width,
      height: gameObj.height,
    };

    const mapRect = getMapRect(gameObj.mapName);

    // If the new position is outside of the current map, disallow pushing
    if (rectAinRectB(newRect, mapRect) == false) {
      return false;
    }

    const collisionObject = this.gameObjects.find(
      (obj) =>
        obj !== gameObj &&
        obj.isVisible() &&
        obj.data.item.type != GameObjectType.ITEM &&
        obj.data.item.type != GameObjectType.FLOR &&
        intersect(newRect, obj.getRect())
    );

    // If we aren't going to hit anything, return true
    return collisionObject === undefined;
  }

  private movePlayer(dx: number, dy: number) {
    this.debug.updateItemText();

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
      (obj) => obj.isVisible() && intersect(newPlayerRect, obj.getRect())
    );

    if (collisionObject === undefined) {
      console.log("No game object was found where you tried to walk!");
      return;
    }

    // Determine if this object has a message to show.
    const messages = collisionObject.data.message;

    // TODO: possibly try to clean up this mess in the future
    // It just looks sloppy, but I wrote it this way to match
    // the logic of the original game.
    let message = "";

    if (messages.length > 0) {
      console.log(collisionObject);
      // Find the message which is relavant to our player's state
      for (const m of messages) {
        if (!m.plrAct && !m.plrObj) {
          message = m.text;
          continue;
        }
        if (!m.plrObj && m.plrAct) {
          if (this.inventory.hasAct(m.plrAct)) {
            message = m.text;
            //break;
          }
          continue;
        }
        if (m.plrObj && !m.plrAct) {
          if (this.inventory.hasItem(m.plrObj)) {
            message = m.text;
            //break;
          }
          continue;
        }
        if (m.plrObj && m.plrAct) {
          if (
            this.inventory.hasItem(m.plrObj) &&
            this.inventory.hasAct(m.plrAct)
          ) {
            message = m.text;
            //break;
          }
        }
      }
    }

    if (message) {
      if (
        collisionObject.data.item.type == GameObjectType.CHAR ||
        collisionObject.data.item.type == GameObjectType.ITEM
      ) {
        this.sign.showCharacterMessage(collisionObject.member, message);
      } else {
        this.sign.showMessage(message);
      }
    }

    const conds = collisionObject.data.item.COND.filter(
      (c): c is GameObjectCond => c !== null
    );

    let getItem = false;
    let condIndex = -1;

    if (conds.length > 0) {
      for (const c of conds) {
        condIndex++;
        if (!c.hasObj && !c.hasAct) {
          getItem = true;
          continue;
        }
        if (!c.hasObj && c.hasAct) {
          if (this.inventory.hasAct(c.hasAct)) {
            getItem = true;
          }
          break;
          // Possible bug? Check this if there are problems in game
          // continue;
        }
        if (c.hasObj && !c.hasAct) {
          if (this.inventory.hasItem(c.hasObj)) {
            getItem = true;
            this.inventory.removeItem(c.hasObj);
          }
          break;
        }
        if (c.hasObj && c.hasAct) {
          if (
            this.inventory.hasItem(c.hasObj) &&
            this.inventory.hasAct(c.hasAct)
          ) {
            getItem = true;
            this.inventory.removeItem(c.hasObj);
          }
          break;
        }
      }
    }

    if (getItem) {
      const c = conds[condIndex];
      if (
        c.giveObj &&
        !this.inventory.hasItem(c.giveObj) &&
        !this.inventory.hasAct("got" + c.giveObj)
      ) {
        this.inventory.addItem(c.giveObj);
        // TODO: gItemLog?
      }
      if (c.giveAct && !this.inventory.hasAct(c.giveAct)) {
        this.inventory.addAct(c.giveAct);
        // TODO: gActionLog?
      }
    }

    let inWater = false;

    // Switch over object type and handle each case differently
    switch (collisionObject.data.item.type) {
      case GameObjectType.FLOR:
        break;
      case GameObjectType.WALL: {
        if (collisionObject.data.move.COND == GameObjectMoveCond.PUSH) {
          const toPos = this.posAfterDeltaMove(collisionObject, dx, dy);
          if (this.canMoveGameObject(collisionObject, toPos)) {
            const lastPos = {
              x: collisionObject.posX,
              y: collisionObject.posY,
            };
            collisionObject.initMove(lastPos, toPos);
            this.pushedObjects.push(collisionObject);
            break;
          }
          return;
        }
        //const objRect = collisionObject.getRect();
        //const currRect = this.player.getCollisionRectAtPoint(pos.x, pos.y);
        //this.debug.drawCollision(currRect, newPlayerRect, objRect);
        //console.log(collisionObject);
        return;
      }
      case GameObjectType.CHAR: {
        if (collisionObject.data.move.COND == GameObjectMoveCond.PUSH) {
          const toPos = this.posAfterDeltaMove(collisionObject, dx, dy);
          if (this.canMoveGameObject(collisionObject, toPos)) {
            const fromPos = {
              x: collisionObject.posX,
              y: collisionObject.posY,
            };
            collisionObject.initMove(fromPos, toPos);
            this.pushedObjects.push(collisionObject);
            break;
          }
          return;
        }
        return;
      }
      case GameObjectType.ITEM: {
        this.removeGameObject(collisionObject);
        break;
      }
      case GameObjectType.WATER: {
        // only allow water travel if you have a boat
        if (!this.inventory.hasItem("scuba")) {
          this.sign.showMessage("You can't just walk into water!!!");
          return;
        }
        inWater = true;
        break;
      }
      default:
        console.log(collisionObject);
        break;
    }

    const newState = inWater ? PlayerState.BOAT : PlayerState.NORMAL;
    this.player.state = newState;

    const lastPos = this.player.getPosition();
    const nextPos = { x: newX, y: newY };
    this.player.initMove(lastPos, nextPos);

    // Update map and do bookkeeping when leaving a zone
    if (this.player.currentMap != collisionObject.mapName) {
      //
      this.player.lastMap = this.player.currentMap;
      this.player.currentMap = collisionObject.mapName;
      this.resetMovableObjects(this.player.lastMap);
    }

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
    this.centerCameraOnPlayer();
  }

  public updateAllVisibility() {
    this.gameObjects.map((obj) => this.updateVisibility(obj));
  }

  private updateVisibility(object: GameObject) {
    let showObj = true;
    let secret = false;
    const v = object.data.item.visi;

    if (v.visiObj || v.visiAct) {
      if (
        this.inventory.hasItem(v.visiObj) ||
        this.inventory.hasAct(v.visiAct)
      ) {
        showObj = true;
        secret = true;
      } else {
        showObj = false;
      }
    } else {
      const hasItem = this.inventory.hasItem(v.inviObj);
      const hasAct = this.inventory.hasAct(v.inviAct);
      showObj = hasItem || hasAct ? false : true;
    }
    // TODO: If secret and sprite is visible, play secret sound
    object.setVisible(showObj);
  }

  private removeGameObject(object: GameObject) {
    object.sprite.parent.removeChild(object.sprite);
    const index = this.gameObjects.findIndex((o) => o === object);
    this.gameObjects.splice(index, 1);
  }

  public centerCameraOnPlayer() {
    const pos = this.player.getPosition();
    const x =
      -pos.x * this.viewport.scale.x + this.app.renderer.screen.width / 2;
    const y =
      -pos.y * this.viewport.scale.y + this.app.renderer.screen.height / 2;
    this.viewport.position.set(x, y);
  }

  private resetMovableObjects(mapName: string) {
    this.gameObjects
      .filter(
        (obj) =>
          obj.data.move.COND == GameObjectMoveCond.PUSH &&
          obj.mapName == mapName &&
          (obj.posX != obj.originalPosX || obj.posY != obj.originalPosY)
      )
      .map((obj) => obj.setPosition(obj.originalPosX, obj.originalPosY));
  }

  private keyPressed(key: Key) {
    return this.keysPressed.has(key);
  }

  private init() {
    this.player.init();

    this.initObjects();
    this.initWorldInfo();

    this.viewport.addChild(this.player.sprite);

    this.debug.init();
    this.sign.init();
    this.inventory.init();

    this.script.init();

    this.app.renderer.addListener("resize", () => {
      this.resize();
    });

    document.getElementById("game-container")!.appendChild(this.app.view);
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
    // We must sort them by objects that use tiles first to render it properly,
    // but we don't want to actually mess up the order of the original data.
    const objs = this.gameObjects.filter((x) => x.isStatic());
    [...objs]
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

    // Reverse the order of game objects from bottom to top
    // THIS IS IMPORTANT FOR HOW THE COLLISION IS DETERMINED
    this.gameObjects.reverse();

    this.updateAllVisibility();

    // Get a collection of movable objects to update each frame
    this.movingObjects = this.gameObjects.filter((obj) => {
      return obj.data.move.COND === GameObjectMoveCond.AUTO;
    });

    console.log("Game objects: " + this.gameObjects.length);
    console.log("Scene objects: " + this.worldContainer.children.length);

    this.movingObjects.map((m) => {
      const rect = m.getMoveBounds();
      this.debug.drawRect(rect, { width: 1, color: 0xff0000, alignment: 0 });
    });
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

  private initWorldInfo() {
    const mapSet = new Set<string>();
    this.gameObjects.map((obj) => mapSet.add(obj.mapName));
    const xMax = Math.max(
      ...Array.from(mapSet).map((s) => parseInt(s.slice(0, 2)))
    );
    const yMax = Math.max(
      ...Array.from(mapSet).map((s) => parseInt(s.slice(2, 4)))
    );
    this.numMapsX = xMax;
    this.numMapsY = yMax;
    this.worldRect = {
      x: 0,
      y: 0,
      width: this.numMapsX * MAP_WIDTH,
      height: this.numMapsY * MAP_HEIGHT,
    };
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
