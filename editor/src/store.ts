import { defineStore } from "pinia";
import { ImageFile, Metadata } from "./ccsr/types";
import { GameMap, GameObject } from "./ccsr/renderer/types";

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

export const useStore = defineStore("store", {
  state: (): StoreData => {
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
  },

  getters: {

  },

  actions: {

  },
});
