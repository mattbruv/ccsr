import * as PIXI from "pixi.js";

const assets = [
  { name: "textures1", url: "./assets/1/ep1.json" },
  { name: "map1", url: "./assets/1/map1.json" },

  /*
  { name: "textures2", url: "./assets/2/ep2.json" },
  { name: "map2", url: "./assets/2/map2.json" },

  { name: "textures3", url: "./assets/3/ep3.json" },
  { name: "map3", url: "./assets/3/map3.json" },

  { name: "textures4", url: "./assets/4/ep4.json" },
  { name: "map4", url: "./assets/4/map4.json" },
  */
];

export function loadAssets(doneCallback: () => void) {
  PIXI.Loader.shared.add(assets);
  PIXI.Loader.shared.onComplete.once(doneCallback);
  PIXI.Loader.shared.load();
}
