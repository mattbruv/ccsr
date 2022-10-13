import { Howl } from "howler";
export class GameSound {
  public walk: Howl;
  public boat: Howl;
  public bump: Howl;
  public push: Howl;
  public chimes: Howl;
  public message: Howl;
  public secret: Howl;
  public correct: Howl;
  public incorrect: Howl;
  public click: Howl;
  public win: Howl;
  public lose: Howl;

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
    this.correct = new Howl({
      src: root + "correct.wav",
    });
    this.incorrect = new Howl({
      src: root + "incorrect.wav",
    });
    this.click = new Howl({
      src: root + "click.wav",
    });
    this.win = new Howl({
      src: root + "win.wav",
    });
    this.lose = new Howl({
      src: root + "lose.wav",
    });
  }

  public once(sound: Howl) {
    if (sound.playing() == false) {
      sound.play();
    }
  }
}
