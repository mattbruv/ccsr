import { defineStore } from "pinia";
import { ref } from "vue";
import { EditorData } from "./data";

export const useStore = defineStore("store", () => {
    const data = ref(new EditorData());

    function $reset() {
        data.value = new EditorData();
    }

    return { data, $reset }
})