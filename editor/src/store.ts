import { defineStore } from "pinia";
import { ImageFile, Metadata } from "./ccsr/types";
import { GameMap, GameObject } from "./ccsr/renderer/types";
import Renderer from "./ccsr/renderer/renderer";

type UISetttings = {
  global: {
    showRouterView: boolean;
    showMapViewer: boolean;
  };
};

type StoreData = {
  gameObjects: GameObject[];
  gameMaps: GameMap[];
  imageFiles: ImageFile[];
  metadata: Metadata;
  UI: UISetttings;

  selectedObjectId: number | null;
  selectedMapName: string | null;
};

function newState(): StoreData {
  return {
    gameObjects: [],
    gameMaps: [],
    imageFiles: [],
    metadata: {
      author: "",
      name: "",
    },

    selectedObjectId: null,
    selectedMapName: null,

    UI: {
      global: {
        showRouterView: true,
        showMapViewer: true,
      },
    },
  };
}

export const useStore = defineStore("store", {
  state(): StoreData {
    return newState();
  },

  getters: {
    selectedMap(state): GameMap | undefined {
      return state.gameMaps.find((x) => x.name === state.selectedMapName);
    },
  },

  actions: {
    render() {
      Renderer.renderWorld(this.gameMaps, this.gameObjects);
    },

    async reloadImages() {
      Renderer.unloadImages();
      await Renderer.loadImages(this.imageFiles);
      this.render();
    },

    reset() {
      Renderer.unloadImages();
      Renderer.reset();
      Object.assign(this, newState());
    },
  },
});
