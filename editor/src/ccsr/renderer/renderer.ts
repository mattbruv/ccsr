import * as PIXI from "pixi.js";
import { ImageFile } from "../types";
import { Viewport } from "pixi-viewport";
import { GameMapRenderData, GameObject, GameObjectRenderData } from "./types"
import { newGameObjectRenderData, newGameMapRenderData, getTextureName } from "./helpers";

const MAP_WIDTH_PIXELS = 32 * 13;
const MAP_HEIGHT_PIXELS = 32 * 10;

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
    PIXI.utils.clearTextureCache()
    PIXI.utils.destroyTextureCache();
    this.gameObjects.forEach(x => x.sprite.destroy())
    //this.gameMaps.forEach(x => x.children.forEach(y => y.destroy()))
    this.viewport.children.forEach(x => x.destroy())
    this.viewport.removeChildren();
    this.gameMaps.clear();
    this.gameObjects.clear();
  }

  public addView(div: HTMLDivElement): void {
    div.appendChild(this.app.view);
    this.resizeTo(div);
  }

  public resizeTo(element: HTMLElement) {
    this.app.resizeTo = element;
    console.log("resized to: ", this.app.view.width, this.app.view.height);
  }

  public async loadImages(images: ImageFile[]) {
    if (!images.length) return;

    for (const image of images) {
      const url = "data:image/png;base64," + image.data;
      PIXI.Assets.add({ alias: image.filename.toLowerCase(), src: url });
      await PIXI.Assets.load(image.filename.toLowerCase());
    }
  }

  public renderObjects(gameObjects: GameObject[]) {
    for (const object of gameObjects) {//}.filter(x => x.mapName.includes("010") && x.mapName.length === 4)) {

      this.renderGameObject(object)
    }
    console.log(this)
  }

  private renderGameObject(gameObject: GameObject) {
    let renderObject = this.gameObjects.get(gameObject.id);
    const textureName = getTextureName(gameObject.data.member ?? "missing_texture")
    const texture = PIXI.utils.TextureCache[textureName]

    // Create the entry if it doesn't exist already
    if (!renderObject) {
      renderObject = newGameObjectRenderData(gameObject, texture);
      this.gameObjects.set(gameObject.id, renderObject);
      let mapData = this.gameMaps.get(gameObject.mapName);
      if (!mapData) {
        mapData = newGameMapRenderData(gameObject.mapName)
        this.gameMaps.set(gameObject.mapName, mapData);
        this.viewport.addChild(mapData.container)

        // Set the map's X/Y position to correct spot
        if (gameObject.mapName.length == 4) {
          const x = parseInt(gameObject.mapName.slice(0, 2))
          const y = parseInt(gameObject.mapName.slice(2, 4))
          const posX = x * MAP_WIDTH_PIXELS
          const posY = y * MAP_HEIGHT_PIXELS
          mapData.container.position.set(posX, posY)
          console.log(x, y, posX, posY, gameObject.mapName)
        }
        else {

        }
      }
      mapData.container.addChild(renderObject.sprite)
    }

    this.renderGameObjectEntry(gameObject, renderObject);
  }

  private renderGameObjectEntry(gameObject: GameObject, render: GameObjectRenderData) {
    const hash = JSON.stringify(gameObject)

    // If our sprite is already rendered correctly, don't do anything
    if (render.hash === hash)
      return

    if (gameObject.data.width) {
      render.sprite.width = gameObject.data.width
    }
    if (gameObject.data.height) {
      render.sprite.height = gameObject.data.height
    }

    if (gameObject.data.location) {
      const x = gameObject.data.location.x ?? 0
      const y = gameObject.data.location.y ?? 0
      const WSHIFT = gameObject.data.WSHIFT ?? 0
      const HSHIFT = gameObject.data.HSHIFT ?? 0
      const posX = x * 16 + WSHIFT;
      const posY = y * 16 + HSHIFT;
      render.sprite.position.set(posX, posY);
    }

    if (gameObject.data.member) {
      const textureName = getTextureName(gameObject.data.member ?? "missing_texture")
      const texture = PIXI.utils.TextureCache[textureName]
      render.sprite.texture = texture

      // If the game object is not tiling, set the anchor to the middle
      // And make its texture stretch to fill the entire area
      if (!textureName.includes("tile")) {
        render.sprite.anchor.set(0.5)
        render.sprite.width = render.sprite.texture.width
        render.sprite.height = render.sprite.texture.height
      }
    }

    if (gameObject.data.data?.item?.visi) {
      const { visiAct, visiObj } = gameObject.data.data?.item?.visi;
      if (visiAct || visiObj) {
        render.sprite.alpha = 0.5
      }
    }

    render.hash = hash
  }
}

const Renderer = new CcsrRenderer();

export default Renderer;
