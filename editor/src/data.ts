import { defineStore } from "pinia";

export interface EditorImage {
    name: string
    data: Blob
}

export interface EditorData {
    images: {
        characters: EditorImage[];
        tiles: EditorImage[];
        visuals: EditorImage[];
    },
    metadata: EditorMetadata
}

export interface EditorMetadata {
    name: string
    author: string
}

export const dataStore = defineStore({
    id: "data",
    state: (): EditorData => ({
        images: {
            characters: [],
            tiles: [],
            visuals: [],
        },
        metadata: {
            name: "New Episode",
            author: "Undefined",
        }
    })
})