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

  private theme: Howl;
  private theme1: Howl;
  private theme2: Howl;
  private themeSelect = 1;
  private currentTheme: Howl;

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
    this.theme = new Howl({
      src: root + "theme.main.wav",
    });
    this.theme1 = new Howl({
      src: root + "theme.change.1.wav",
    });
    this.theme2 = new Howl({
      src: root + "theme.change.2.wav",
    });

    this.currentTheme = this.theme;

    this.initTheme();
  }

  public once(sound: Howl) {
    if (sound.playing() == false) {
      sound.play();
    }
  }

  private initTheme() {
    this.theme.stop();
    this.theme1.stop();
    this.theme2.stop();
    //this.theme.play();

    const playMain = () => {
      this.theme.play();
      this.currentTheme = this.theme;
    };

    this.theme.on("end", () => {
      console.log("ON END", this.themeSelect);
      const t = [this.theme1, this.theme2][this.themeSelect - 1];
      this.currentTheme = t;
      t.play();
      this.themeSelect = this.themeSelect == 1 ? 2 : 1;
    });

    this.theme1.on("end", playMain);
    this.theme2.on("end", playMain);
  }

  public playTheme() {
    this.currentTheme.play();
  }

  public isThemePlaying() {
    return (
      this.theme.playing() || this.theme1.playing() || this.theme2.playing()
    );
  }

  public pauseTheme() {
    this.currentTheme.pause();
  }
}
