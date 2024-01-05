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
    selectedTab: MapEditorTab
  }
};

type StoreData = {
  gameObjects: GameObject[];
  gameMaps: GameMap[];
  imageFiles: ImageFile[];
  metadata: Metadata;
  UI: UISetttings;
  mapEditor: {
    selectedMap: string | null
  }
};

function newState(): StoreData {
  return {
    gameObjects: [],
    gameMaps: [],
    imageFiles: [],
    mapEditor: {
      selectedMap: null,
    },
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
        selectedTab: MapEditorTab.Overview
      }
    },
  };
}

export const useStore = defineStore("store", {
  state(): StoreData {
    return newState();
  },

  getters: {},

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
