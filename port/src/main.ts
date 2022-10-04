import { Game } from "./game";
import "./style.css";

const game = new Game();

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
