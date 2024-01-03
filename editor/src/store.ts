import { defineStore } from "pinia";
import { ImageFile, Metadata } from "./ccsr/types";
import { GameMap, GameObject } from "./ccsr/renderer/types";
import Renderer from "./ccsr/renderer/renderer";

type UISetttings = {
  global: {
    showMapViewer: boolean
  }
}

type StoreData = {
  gameObjects: GameObject[]
  gameMaps: GameMap[]
  imageFiles: ImageFile[]
  metadata: Metadata
  UI: UISetttings
}

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
        showMapViewer: true
      }
    }
  };
}

export const useStore = defineStore("store", {
  state(): StoreData {
    return newState()
  },

  getters: {

  },

  actions: {

    render() {
      Renderer.renderWorld(this.gameMaps, this.gameObjects)

    },

    async reset() {
      await Renderer.unloadImages(this.imageFiles)
      Renderer.reset()
      Object.assign(this, newState())
    }

  },
});
