import { defineStore } from "pinia";
import { EditorData } from "./data";
import { Ref, ref } from "vue"

export const useStore = defineStore("store", () => {
    const data: Ref<EditorData> = ref(new EditorData());

    function $reset() {
        data.value = new EditorData();
    }

    return { data, $reset }
})