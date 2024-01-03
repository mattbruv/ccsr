import * as PIXI from "pixi.js";

export function loadAssets(
  episodeNumber: string,
  language: string,
  doneCallback: () => void
) {
  const root = "./assets/" + episodeNumber + "/";
  const assets = [
    {
      name: `textures`,
      url: root + "ep" + episodeNumber + ".json",
    },
    {
      name: "ending",
      url: root + "ep" + episodeNumber + "_ending.json",
    },
    {
      name: `map`,
      url: root + "map" + episodeNumber + ".json",
    },
    {
      name: "game",
      url: root + language + "/game.json",
    },
    {
      name: "messages",
      url: root + language + "/messages.json",
    },
  ];

  if (language !== "en") {
    assets.push({
      name: "translated",
      url: root + language + "/ep" + episodeNumber + ".json",
    });
  }

  PIXI.Loader.shared.reset();
  PIXI.Loader.shared.add(assets);
  PIXI.Loader.shared.onComplete.once(doneCallback);
  PIXI.Loader.shared.load();
}
