import React from "react";
import { Game } from "../src/game";
import { SelectEpisode } from "./Select";
import { Settings } from "./Settings";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

let game: Game; //  = new Game();

class App extends React.Component {
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

  render(): React.ReactNode {
    return (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Settings />
        <SelectEpisode />
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
