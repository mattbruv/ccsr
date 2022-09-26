import { Game } from "./game";
import { loadAssets } from "./load";
import "./style.css";

const game = new Game();

document.getElementById("alias")!.addEventListener("change", (e) => {
  const value = (e.target as HTMLInputElement).checked;
});

document.getElementById("episode")!.addEventListener("change", (e) => {
  const episode = parseInt((e.target as HTMLSelectElement).value);
  loadEpisode(episode);
});

function loadEpisode(episodeNumber: number) {
  loadAssets(episodeNumber, () => {
    game.initObjects();
  });
}

document.addEventListener("keydown", (e) => {
  const key = e.key;
  const episodes = ["1", "2", "3", "4"];
  if (episodes.includes(key)) {
    loadEpisode(parseInt(key));
    (document.getElementById("episode")! as HTMLSelectElement).value = key;
  }
});
