import { defineStore } from "pinia";

interface EditorData {
    metadata: Metadata;
}

interface Metadata {
    name: string;
    author: string;
}

export const dataStore = defineStore({
    id: "data",
    state: (): EditorData => ({
        metadata: {
            name: "New Episode",
            author: "Undefined",
        }
    })
})