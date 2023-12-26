import * as PIXI from "pixi.js";
import { ImageFile } from "./types";

class CcsrRenderer {
  public app = new PIXI.Application<HTMLCanvasElement>();

  public addView(div: HTMLDivElement): void {
    div.appendChild(this.app.view);
  }

  public async loadImages(images: ImageFile[]) {
    if (!images.length) return;

    for (const image of images) {
      const url = "data:image/png;base64," + image.data;
      PIXI.Assets.add({ alias: "test", src: url });
      await PIXI.Assets.load("test");
      break;
    }

    console.log(PIXI.utils.TextureCache["test"]);

    const sprite = new PIXI.Sprite(PIXI.utils.TextureCache["test"]);
    this.app.stage.addChild(sprite);
  }
}

const Renderer = new CcsrRenderer();

export default Renderer;
