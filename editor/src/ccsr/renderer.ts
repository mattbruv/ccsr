import * as PIXI from "pixi.js";
import { ImageFile, MapFile } from "./types";
import { Viewport } from "pixi-viewport";
import { MapData } from "./game/types";
import { GameObject } from "./game/renderer";

type GameObjectEntry = {
  id: number
  hash: string
  sprite: PIXI.TilingSprite
}

class CcsrRenderer {
  public app = new PIXI.Application<HTMLCanvasElement>();
  private viewport: Viewport;

  private gameMaps: Map<string, PIXI.Container> = new Map();
  private objectEntries: Map<number, GameObjectEntry> = new Map();

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
    this.viewport.removeChildren();
    this.gameMaps.clear();
    this.objectEntries.clear();
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
    for (const object of gameObjects.filter(x => x.mapName === "0106")) {

      this.renderGameObject(object)
    }
    console.log(this)
  }

  private renderGameObject(gameObject: GameObject) {
    let entry = this.objectEntries.get(gameObject.id);
    const textureName = this.getTextureName(gameObject.data.member ?? "missing_texture")
    const texture = PIXI.utils.TextureCache[textureName]
    let update = false

    // Create the entry if it doesn't exist already
    if (!entry) {
      update = true
      entry = {
        id: gameObject.id,
        hash: JSON.stringify(gameObject),
        sprite: new PIXI.TilingSprite(texture)
      }
      this.objectEntries.set(gameObject.id, entry);
      let mapContainer = this.gameMaps.get(gameObject.mapName);
      if (!mapContainer) {
        mapContainer = new PIXI.Container()
        this.gameMaps.set(gameObject.mapName, mapContainer);
        this.viewport.addChild(mapContainer)
      }
      mapContainer.addChild(entry.sprite)
    }
    else {
      update = entry.hash === JSON.stringify(gameObject)
    }

    // Only do a re-render of this object if something has changed
    if (update) {
      this.renderGameObjectEntry(gameObject, entry);
    }
  }

  private renderGameObjectEntry(gameObject: GameObject, entry: GameObjectEntry) {
    if (gameObject.data.width) {
      entry.sprite.width = gameObject.data.width
    }
    if (gameObject.data.height) {
      entry.sprite.height = gameObject.data.height
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
