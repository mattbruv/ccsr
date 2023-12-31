import * as PIXI from "pixi.js";
import { ImageFile, MapFile } from "./types";
import { Viewport } from "pixi-viewport";
import { MapData } from "./game/types";
import { GameObject, GameObjectRenderSettings, MapRenderSettings } from "./game/renderer";

type GameObjectRenderData = {
  id: number
  hash: string
  sprite: PIXI.TilingSprite
  renderSettings: GameObjectRenderSettings
}

type GameMapRenderData = {
  container: PIXI.Container
  grid: PIXI.Graphics
  border: PIXI.Graphics
  renderSettings: MapRenderSettings
}

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
    let entry = this.gameObjects.get(gameObject.id);
    const textureName = this.getTextureName(gameObject.data.member ?? "missing_texture")
    const texture = PIXI.utils.TextureCache[textureName]
    let update = false

    // Create the entry if it doesn't exist already
    if (!entry) {
      update = true
      entry = this.newGameObjectRenderData(gameObject, texture);
      this.gameObjects.set(gameObject.id, entry);
      let mapData = this.gameMaps.get(gameObject.mapName);
      if (!mapData) {
        mapData = this.newGameMapRenderData(gameObject.mapName)
        this.gameMaps.set(gameObject.mapName, mapData);
        this.viewport.addChild(mapData.container)

        // Set the map's X/Y position to correct spot
        if (gameObject.mapName.length == 4) {
          const x = parseInt(gameObject.mapName.slice(0, 2))
          const y = parseInt(gameObject.mapName.slice(2, 4))
          const posX = x * 32 * 13;
          const posY = y * 32 * 10;
          mapData.container.position.set(posX, posY)
          console.log(x, y, posX, posY, gameObject.mapName)
        }
        else {

        }
      }
      mapData.container.addChild(entry.sprite)
    }
    else {
      update = entry.hash === JSON.stringify(gameObject)
    }

    // Only do a re-render of this object if something has changed
    if (update) {
      console.log("updating!")
      this.renderGameObjectEntry(gameObject, entry);
    }
  }

  private newGameObjectRenderData(gameObject: GameObject, texture: PIXI.Texture): GameObjectRenderData {
    const data: GameObjectRenderData = {
      hash: JSON.stringify(gameObject.data),
      id: gameObject.id,
      sprite: new PIXI.TilingSprite(texture),
      renderSettings: gameObject.renderSettings
    }
    return data
  }

  private newGameMapRenderData(name: string): GameMapRenderData {
    const data: GameMapRenderData = {
      border: new PIXI.Graphics(),
      container: new PIXI.Container(),
      grid: new PIXI.Graphics(),
      renderSettings: {
        mapName: name,
        renderBorder: true,
        renderGrid: true,
        renderOutOfBounds: false,
      }
    }
    data.container.cacheAsBitmap = true;
    return data
  }

  private renderGameObjectEntry(gameObject: GameObject, entry: GameObjectRenderData) {
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
      const textureName = this.getTextureName(gameObject.data.member ?? "missing_texture")
      const texture = PIXI.utils.TextureCache[textureName]
      entry.sprite.texture = texture

      // If the game object is not tiling, set the anchor to the middle
      if (!textureName.includes("tile")) {
        entry.sprite.anchor.set(0.5)
      }
    }

    if (gameObject.data.data?.item?.visi) {
      const { visiAct, visiObj } = gameObject.data.data?.item?.visi;
      if (visiAct || visiObj) {
        entry.sprite.alpha = 0.5
      }
    }
  }

  private getTextureName(texture: string): string {
    let name = texture.toLowerCase()
    if (name.startsWith("tile"))
      name = name.replace(".x", "")
    return name
  }

}

const Renderer = new CcsrRenderer();

export default Renderer;
