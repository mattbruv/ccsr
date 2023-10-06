import { defineStore } from "pinia";
import { ref } from "vue";
import { EditorData } from "./data";

export const useStore = defineStore("store", () => {
    let data = new EditorData();

    function $reset() {
        data = new EditorData();
    }

    return { data, $reset }
})