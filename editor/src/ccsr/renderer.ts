import * as PIXI from "pixi.js";
import { ImageFile, MapFile } from "./types";
import { Viewport } from "pixi-viewport";
import { MapData } from "./game/types";

class CcsrRenderer {
  public app = new PIXI.Application<HTMLCanvasElement>();
  private viewport: Viewport;

  private maps: Map<string, PIXI.Container> = new Map();

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
      //console.log(image.filename);
      PIXI.Assets.add({ alias: image.filename, src: url });
      await PIXI.Assets.load(image.filename);
    }

    // console.log(PIXI.utils.TextureCache);
    // const first = images[0].filename;
    // const sprite = new PIXI.Sprite(PIXI.utils.TextureCache[first]);
    // this.viewport.addChild(sprite);
  }

}

const Renderer = new CcsrRenderer();

export default Renderer;
