import React from "react";
import { Game } from "../src/game";

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
      <div id="main">
        <div id="game-container"></div>
      </div>
    );
  }
}

export default App;
