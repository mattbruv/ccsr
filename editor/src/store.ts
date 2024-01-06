import { defineStore } from "pinia";
import { ImageFile, Metadata } from "./ccsr/types";
import { GameMap, GameObject } from "./ccsr/renderer/types";
import Renderer from "./ccsr/renderer/renderer";
import * as PIXI from "pixi.js";
import { MapEditorTab } from "./ccsr/mapEditor/types";

type UISetttings = {
  global: {
    showRouterView: boolean
    showMapViewer: boolean;
  }
  mapEditor: {
    selectedMapName: string | null
    selectedObjectId: number | null
    selectedTab: MapEditorTab
  }
};

type StoreData = {
  gameObjects: GameObject[];
  gameMaps: GameMap[];
  imageFiles: ImageFile[];
  metadata: Metadata;
  UI: UISetttings;
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
    UI: {
      global: {
        showRouterView: true,
        showMapViewer: true,
      },
      mapEditor: {
        selectedTab: MapEditorTab.Overview,
        selectedObjectId: null,
        selectedMapName: null,
      },
    },
  };
}

export const useStore = defineStore("store", {
  state(): StoreData {
    return newState();
  },

  getters: {
    selectedMap(state) {
      return state.gameMaps.find(x => x.name === state.UI.mapEditor.selectedMapName);
    }
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
