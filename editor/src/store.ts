import { defineStore } from "pinia";
import { Project } from "./ccsr/types";

function newProject(): Project {
  return {
    maps: [],
    images: [],
    metadata: {
      author: "",
      name: "",
    },
  };
}

export const useStore = defineStore("store", {
  state: () => {
    return {
      project: newProject(),
      UI: {
        global: {
          showMapViewer: true,
        },
        maps: {
          //
        },
      },
    };
  },

  actions: {
    newProject() {
      this.project = newProject();
    },
  },
});
