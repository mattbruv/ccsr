import React from "react";
import { Game } from "../src/game";
import { SelectEpisode } from "./Select";
import { Navbar } from "./Navbar";
import { About } from "./About";
import { Settings } from "./Settings";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

let game: Game; //  = new Game();

type AppProps = {};

type AppState = {
  isPlaying: boolean;
  settingsOpen: boolean;
  page: string;
};

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      isPlaying: false,
      settingsOpen: false,
      page: "home",
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
            console.log(this.state.settingsOpen);
            this.setState(() => {
              return {
                settingsOpen: true,
              };
            });
          }}
        />
        <Settings
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
