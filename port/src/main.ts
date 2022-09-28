import { Game } from "./game";
import "./style.css";

const game = new Game();

document.addEventListener("keydown", (event) => {
  game.keysPressed.add(event.key);
});

document.addEventListener("keyup", (event) => {
  game.keysPressed.delete(event.key);
});
