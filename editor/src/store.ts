import { defineStore } from "pinia";
import { ImageFile, Metadata, Project } from "./ccsr/types";
import { GameObject } from "./ccsr/game/renderer";

type UISetttings = {
  global: {
    showMapViewer: boolean
  }
}

type StoreData = {
  objects: GameObject[]
  images: ImageFile[]
  metadata: Metadata
  UI: UISetttings
}

export const useStore = defineStore("store", {
  state: (): StoreData => {
    return {
      objects: [],
      images: [],
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
