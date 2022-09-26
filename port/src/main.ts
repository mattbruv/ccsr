import { Game } from "./game";

const game = new Game();

document.getElementById("alias")!.addEventListener("change", (e) => {
  const value = (e.target as HTMLInputElement).checked;
});

document.getElementById("episode")!.addEventListener("change", (e) => {
  const value = (e.target as HTMLSelectElement).value;
});
