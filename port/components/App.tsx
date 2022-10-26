import React from "react";
import { Game } from "../src/game";
import { SelectEpisode } from "./Select";
import { Navbar } from "./Navbar";
import { About } from "./About";
import { Settings } from "./Settings";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Cookies from "js-cookie";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

let game: Game; //  = new Game();

const setSmooth = (value: boolean) => {
  Cookies.set("smooth", value.toString());
  if (game) game.smoothAnimations = value;
};

const setVolumeTheme = (value: number) => {
  Cookies.set("volumeTheme", value.toString());
  if (game) {
    game.sound.setVolumeTheme(value / 100);
  }
};

function getSettings() {
  return {
    smoothAnimations: getCookieBool("smooth", true),
    fullScreen: getCookieBool("fullscreen", true),
    forceRatio: getCookieBool("ratio", false),
    volumeMaster: getCookieNum("volumeMaster", 100),
    volumeTheme: getCookieNum("volumeTheme", 100),
  };
}

type AppProps = {};

export interface GameSettings {
  smoothAnimations: boolean;
  fullScreen: boolean;
  forceRatio: boolean;

  volumeMaster: number;
  volumeTheme: number;
}

type AppState = {
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
      isPlaying: false,
      settingsOpen: false,
      page: "home",

      settings: getSettings(),
    };
  }

  loadPage(page: string) {
    this.setState(() => ({ page }));
  }

  loadGame(episode: number) {
    this.setState(
      () => ({ isPlaying: true }),
      () => {
        game = new Game(episode);
        const s = getSettings();
        setSmooth(s.smoothAnimations);
        setVolumeTheme(s.volumeTheme);
      }
    );
  }

  componentDidMount(): void {
    //game = new Game();

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

  getPage() {
    switch (this.state.page) {
      case "about":
        return <About />;
      default:
        return (
          <SelectEpisode
            playCB={(episode: number) => {
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
          cbs={{ setSmooth, setVolumeTheme }}
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
