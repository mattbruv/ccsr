import React from "react";
import { Game } from "../src/game";
import { SelectEpisode } from "./Select";
import { Navbar } from "./Navbar";
import { About } from "./About";
import { Settings } from "./Settings";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Cookies from "js-cookie";

import english from "../translations/site/en.json";
import spanish from "../translations/site/es.json";
import portuguese from "../translations/site/pt.json";

/*

Be warned, the React part of this codebase is hideous.
I don't use react much and was kind of figuring things out
as I went.

Translations are done using 'any' because typescript was killing me
and react-i18n is horrible to use with typescript + class components,
so instead of refactoring everything i'm just hacking in
language support very crudely
*/
const translations: any = {
  en: english,
  es: spanish,
  pt: portuguese,
};

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const languages = ["en", "es", "pt"];

function getDefaultLanguage() {
  const c = Cookies.get("lang");
  if (c !== undefined) {
    return c;
  }
  if (languages.includes(navigator.language)) {
    return navigator.language;
  }
  return "en";
}

let game: Game; //  = new Game();

const setSmooth = (value: boolean) => {
  Cookies.set("smooth", value.toString(), { expires: 999 });
  if (game) game.smoothAnimations = value;
};

const setCameraMode = (value: number) => {
  Cookies.set("cameraMode", value.toString(), { expires: 999 });
  if (game) {
    game.camera.setCameraMode(value);
  }
};

const setVolumeTheme = (value: number) => {
  Cookies.set("volumeTheme", value.toString(), { expires: 999 });
  if (game) {
    game.sound.setVolumeTheme(value / 100);
  }
};

const setVolumeMaster = (value: number) => {
  Cookies.set("volumeMaster", value.toString(), { expires: 999 });
  if (game) {
    game.sound.setVolumeMaster(value / 100);
  }
};

function getSettings() {
  return {
    language: getDefaultLanguage(),
    smoothAnimations: getCookieBool("smooth", true),
    cameraMode: getCookieNum("cameraMode", 0),
    fullScreen: getCookieBool("fullscreen", true),
    forceRatio: getCookieBool("ratio", false),
    volumeMaster: getCookieNum("volumeMaster", 100),
    volumeTheme: getCookieNum("volumeTheme", 100),
  };
}

type AppProps = {};

export interface GameSettings {
  language: string;
  cameraMode: number;
  smoothAnimations: boolean;
  fullScreen: boolean;
  forceRatio: boolean;

  volumeMaster: number;
  volumeTheme: number;
}

type AppState = {
  language: any;
  langName: string;
  settings: GameSettings;
  isPlaying: boolean;
  settingsOpen: boolean;
  page: string;
};

function getCookieBool(key: string, or: boolean) {
  if (Cookies.get(key) === undefined) {
    return or;
  }
  return Cookies.get(key) === "true";
}

function getCookieNum(key: string, or: number) {
  const cookie = Cookies.get(key);
  if (cookie === undefined) {
    return or;
  }
  return parseInt(cookie);
}

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      language: translations[getDefaultLanguage()],
      langName: getDefaultLanguage(),
      isPlaying: false,
      settingsOpen: false,
      page: "home",

      settings: getSettings(),
    };
  }

  setLanguage(lang: string) {
    this.setState({ language: translations[lang], langName: lang });
    Cookies.set("lang", lang, { expires: 999 });
    if (game) {
      location.reload();
    }
  }

  loadPage(page: string) {
    this.setState(() => ({ page }));
  }

  loadGame(episode: string) {
    this.setState(
      () => ({ isPlaying: true }),
      () => {
        const s = getSettings();
        game = new Game(episode, s.language);
        setSmooth(s.smoothAnimations);
        setCameraMode(s.cameraMode);
        setVolumeTheme(s.volumeTheme);
        setVolumeMaster(s.volumeMaster);

        document.addEventListener("keydown", (event) => {
          if (!game.keysFlag.has(event.key)) {
            game.keysPressed.add(event.key);
            game.keysFlag.add(event.key);
          }
        });

        document.addEventListener("keyup", (event) => {
          game.keysFlag.delete(event.key);
          game.keysPressed.delete(event.key);
        });
      }
    );
  }

  componentDidMount(): void {
    //game = new Game();
  }

  getPage() {
    switch (this.state.page) {
      case "about":
        return <About />;
      default:
        return (
          <SelectEpisode
            languageString={this.state.langName}
            playCB={(episode: string) => {
              this.loadGame(episode);
            }}
          />
        );
    }
  }

  render(): React.ReactNode {
    return (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Navbar
          t={this.state.language}
          position={this.state.isPlaying ? "fixed" : "static"}
          openPageCB={(page: string) => this.loadPage(page)}
          playing={this.state.isPlaying}
          page={this.state.page}
          openSettingsCB={() => {
            this.setState(() => {
              return {
                settingsOpen: true,
              };
            });
          }}
        />
        <Settings
          cbs={{
            setSmooth,
            setCameraMode,
            setVolumeTheme,
            setVolumeMaster,
            setLanguage: (l: string) => {
              this.setLanguage(l);
            },
          }}
          t={this.state.language}
          game={game}
          settings={this.state.settings}
          closeCB={() => {
            this.setState(() => ({ settingsOpen: false }));
          }}
          open={this.state.settingsOpen}
        />
        {!this.state.isPlaying ? (
          this.getPage()
        ) : (
          <div id="main">
            <div id="game-container"></div>
          </div>
        )}
      </ThemeProvider>
    );
  }
}

export default App;
