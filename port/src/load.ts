import * as PIXI from "pixi.js";

const assets = [
  { name: "textures1", url: "./assets/1/ep1.json" },
  { name: "map1", url: "./assets/1/map1.json" },
];

export function loadAssets(doneCallback: () => void) {
  PIXI.Loader.shared.add(assets);
  PIXI.Loader.shared.onComplete.once(doneCallback);
  PIXI.Loader.shared.load();
}
