import * as PIXI from "pixi.js";
import { ImageFile } from "./types";

class CcsrRenderer {
  public app = new PIXI.Application<HTMLCanvasElement>();

  public addView(div: HTMLDivElement): void {
    div.appendChild(this.app.view);
    this.resizeTo(div);
  }

  public resizeTo(element: HTMLElement) {
    this.app.resizeTo = element;
  }

  public async loadImages(images: ImageFile[]) {
    if (!images.length) return;

    for (const image of images) {
      const url = "data:image/png;base64," + image.data;
      PIXI.Assets.add({ alias: image.filename, src: url });
      await PIXI.Assets.load(image.filename);
    }

    console.log(PIXI.utils.TextureCache);
    const first = images[0].filename;
    const sprite = new PIXI.Sprite(PIXI.utils.TextureCache[first]);
    this.app.stage.addChild(sprite);
  }
}

const Renderer = new CcsrRenderer();

export default Renderer;
