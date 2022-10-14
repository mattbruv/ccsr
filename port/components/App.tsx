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
  settingsOpen: boolean;
  page: string;
};

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      settingsOpen: false,
      page: "home",
    };
  }

  loadPage(page: string) {
    this.setState(() => ({ page }));
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
        return <SelectEpisode />;
    }
  }

  render(): React.ReactNode {
    return (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Navbar
          openPageCB={(page: string) => this.loadPage(page)}
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
        {this.getPage()}
      </ThemeProvider>
      /*
      <div id="main">
        <div id="game-container"></div>
      </div>
      */
    );
  }
}

export default App;
