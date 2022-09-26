import * as PIXI from "pixi.js";

export function loadAssets(episodeNumber: number, doneCallback: () => void) {
  PIXI.utils.clearTextureCache();
  const assets = [
    {
      name: `textures`,
      url: `./assets/${episodeNumber}/ep${episodeNumber}.json`,
    },
    {
      name: `map`,
      url: `./assets/${episodeNumber}/map${episodeNumber}.json`,
    },
  ];

  PIXI.Loader.shared.reset();

  PIXI.Loader.shared.add(assets);
  PIXI.Loader.shared.onComplete.once(doneCallback);
  PIXI.Loader.shared.load();
}
