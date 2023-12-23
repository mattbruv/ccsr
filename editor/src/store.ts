import { defineStore } from "pinia";
import { Project } from "./ccsr/types";

function newProject(): Project {
  return {
    maps: [],
    metadata: {
      author: "Anonymous",
      name: "New CCSR Project",
    },
  };
}

export const useStore = defineStore("store", {
  state: () => {
    return {
      project: newProject(),
    };
  },

  actions: {
    newProject() {
      this.project = newProject();
    },
  },
});
