import { defineStore } from "pinia";
import { Project } from "./ccsr/types";

function newProject(): Project {
  return {
    maps: [],
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
        showMapViewer: true,
      },
    };
  },

  actions: {
    newProject() {
      this.project = newProject();
    },
  },
});