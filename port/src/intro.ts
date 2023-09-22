import * as PIXI from "pixi.js";
import { Game, getMemberTexture } from "./game";

export class Intro {
  public container: PIXI.Container;
  private message: PIXI.Sprite;
  private episode: string;
  public inIntro = true;

  constructor(episode: string) {
    this.container = new PIXI.Container();
    this.episode = episode;
    this.message = new PIXI.Sprite();
    this.message.anchor.set(0.5, 0.5);
    this.container.addChild(this.message);
  }

  public init(game: Game) {
    let tex = "summer.instructs." + this.episode.toString().padStart(2, "0");
    if (this.episode === "scooby-1") tex = "scooby instructions 01"
    if (this.episode === "scooby-2") tex = "scooby instructions 02"

    this.message.texture = getMemberTexture(tex)!;
    this.resize(game);
    game.sound.message.play();

    this.message.interactive = true;
    this.message.buttonMode = true;

    this.message.on("pointerdown", () => {
      this.close(game);
    });
  }

  public close(game: Game) {
    this.message.visible = false;
    game.sound.playTheme();
    this.inIntro = false;
  }

  public resize(game: Game) {
    const w = game.app.renderer.width;
    const h = game.app.renderer.height;

    if (w > h) {
      const ratio = this.message.width / this.message.height;
      const height = h * 0.75;
      this.message.height = height;
      this.message.width = height * ratio;
    } else {
      const ratio = this.message.height / this.message.width;
      const width = w * 0.75;
      this.message.width = width;
      this.message.height = width * ratio;
    }

    this.message.position.set(Math.round(w / 2), Math.round(h / 2));
  }
}
