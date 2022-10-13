import { Howl, Howler } from "howler";
export class GameSound {
  public walk: Howl;

  constructor(episode: number) {
    const root = "./assets/" + episode + "/sound/";
    this.walk = new Howl({
      src: root + "walk.wav",
      loop: true,
    });
  }
}
