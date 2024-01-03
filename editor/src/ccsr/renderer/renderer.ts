import * as PIXI from "pixi.js";
import { ImageFile } from "../types";
import { Viewport } from "pixi-viewport";
import { GameMap, GameMapRenderData, GameObject, GameObjectRenderData } from "./types"
import { newGameObjectRenderData, newGameMapRenderData, getTextureName, getMapLocation } from "./helpers";
import { useStore } from "../../store";

class CcsrRenderer {
  public app = new PIXI.Application<HTMLCanvasElement>();
  private viewport: Viewport;

  private gameMaps: Map<string, GameMapRenderData> = new Map();
  private gameObjects: Map<number, GameObjectRenderData> = new Map();

  constructor() {
    this.viewport = new Viewport({
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      worldWidth: this.app.view.width,
      worldHeight: this.app.view.height,
      events: this.app.renderer.events,
    });

    this.app.stage.addChild(this.viewport);

    this.viewport.drag().pinch().wheel();

    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
    PIXI.settings.ROUND_PIXELS = true;
  }

  public reset() {
    PIXI.utils.destroyTextureCache();
    PIXI.utils.clearTextureCache()
    this.viewport.removeChildren()
    this.gameMaps.clear()
    this.gameObjects.clear()
  }

  public addView(div: HTMLDivElement): void {
    div.appendChild(this.app.view);
    this.resizeTo(div);
  }

  public resizeTo(element: HTMLElement) {
    this.app.resizeTo = element;
    console.log("resized to: ", this.app.view.width, this.app.view.height);
  }

  public async unloadImages(images: ImageFile[]) {
    for (const image of images) {
      const url = "data:image/png;base64," + image.data;
      await PIXI.Assets.unload(image.filename.toLowerCase())
    }
  }

  public async loadImages(images: ImageFile[]) {
    if (!images.length) return;

    for (const image of images) {
      const url = "data:image/png;base64," + image.data;
      PIXI.Assets.add({ alias: image.filename.toLowerCase(), src: url });
      await PIXI.Assets.load(image.filename.toLowerCase());
    }
  }

  public renderWorld(gameMaps: GameMap[], gameObjects: GameObject[]) {

    for (const gameObject of gameObjects) {
      let entry = this.gameObjects.get(gameObject.id)
      if (!entry) {
        const textureName = getTextureName(gameObject.data.member ?? "missing_texture")
        const texture = PIXI.Texture.from(textureName);
        entry = newGameObjectRenderData(gameObject, texture)
        this.gameObjects.set(gameObject.id, entry)
      }

      this.renderGameObject(entry, gameObject)
    }

    //debugger
    // Render each game map in the world
    for (const gameMap of gameMaps) {
      let entry = this.gameMaps.get(gameMap.name);
      // console.log(gameMap.name, gameMap.renderSettings.renderOutOfBounds)

      // Create this map if it doesn't exist
      if (!entry) {
        entry = newGameMapRenderData(gameMap.name)
        this.gameMaps.set(gameMap.name, entry)
        this.viewport.addChild(entry.mapContainer)
        // Set the map's X/Y position to correct spot
        const location = getMapLocation(gameMap.name)
        entry.mapContainer.position.set(location.x, location.y)
        entry.mapContainer.mask = entry.mask
      }

      this.renderGameMap(entry, gameMap)

      const objectsInMap = gameObjects.filter(x => x.mapName === gameMap.name);

      // Add each game object in this map to its children
      for (const gameObject of objectsInMap) {
        const obj = this.gameObjects.get(gameObject.id)
        if (obj) {
          entry.objectContainer.addChild(obj.sprite)
        }
      }

    }

    console.log(this)
  }

  private renderGameMap(entry: GameMapRenderData, map: GameMap) {
    // disable caching as bitmap while we make changes to our object
    entry.mapContainer.cacheAsBitmap = false
    entry.border.visible = map.renderSettings.renderBorder
    entry.grid.visible = map.renderSettings.renderGrid
    // Do not mask the map container if we want to render out of bounds objects
    entry.mapContainer.mask = (map.renderSettings.renderOutOfBounds) ? null : entry.mask

    // Set cache as bitmap to true to reset our cached texture again
    entry.mapContainer.cacheAsBitmap = true
  }

  private renderGameObject(entry: GameObjectRenderData, gameObject: GameObject) {
    const hash = JSON.stringify(gameObject)

    // If our sprite is already rendered correctly, don't do anything
    if (entry.hash === hash)
      return

    if (gameObject.data.width) {
      entry.sprite.width = gameObject.data.width
    }
    if (gameObject.data.height) {
      entry.sprite.height = gameObject.data.height
    }

    if (gameObject.data.location) {
      const x = gameObject.data.location.x ?? 0
      const y = gameObject.data.location.y ?? 0
      const WSHIFT = gameObject.data.WSHIFT ?? 0
      const HSHIFT = gameObject.data.HSHIFT ?? 0
      const posX = x * 16 + WSHIFT;
      const posY = y * 16 + HSHIFT;
      entry.sprite.position.set(posX, posY);
    }

    if (gameObject.data.member) {
      const textureName = getTextureName(gameObject.data.member ?? "missing_texture")
      if (textureName === "block.49") {
        const store = useStore()
        debugger
      }
      const texture = PIXI.Texture.from(textureName);
      entry.sprite.texture = texture

      // If the game object is not tiling, set the anchor to the middle
      // And make its texture stretch to fill the entire area
      if (!textureName.includes("tile")) {
        entry.sprite.anchor.set(0.5)
        entry.sprite.width = entry.sprite.texture.width
        entry.sprite.height = entry.sprite.texture.height
      }
    }

    if (gameObject.data.data?.item?.visi) {
      const { visiAct, visiObj } = gameObject.data.data?.item?.visi;
      if (visiAct || visiObj) {
        entry.sprite.alpha = 0.5
      }
    }

    entry.hash = hash
  }
}

const Renderer = new CcsrRenderer();

export default Renderer;
