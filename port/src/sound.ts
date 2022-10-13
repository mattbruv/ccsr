import { Howl, Howler } from "howler";
export class GameSound {
  public walk: Howl;
  public boat: Howl;
  public bump: Howl;
  public push: Howl;
  public chimes: Howl;
  public message: Howl;
  public secret: Howl;

  constructor(episode: number) {
    const root = "./assets/" + episode + "/sound/";
    this.walk = new Howl({
      src: root + "walk.wav",
      loop: true,
    });
    this.push = new Howl({
      src: root + "push.wav",
      loop: true,
    });
    this.boat = new Howl({
      src: root + "boat.wav",
      loop: true,
    });
    this.bump = new Howl({
      src: root + "bump.wav",
    });
    this.chimes = new Howl({
      src: root + "chimes.wav",
    });
    this.message = new Howl({
      src: root + "message.wav",
    });
    this.secret = new Howl({
      src: root + "discover.wav",
    });
  }

  public once(sound: Howl) {
    if (sound.playing() == false) {
      sound.play();
    }
  }
}
