
export interface EditorImage {
    name: string
    data: Blob
}

export interface EditorMetadata {
    name: string
    author: string
}

export class EditorData {
    loadPercent: number = 0;

    images: {
        characterVisuals: EditorImage[],
        mapTiles: EditorImage[],
        mapVisuals: EditorImage[],
    }

    metadata: EditorMetadata;

    constructor() {
        this.images = {
            characterVisuals: [],
            mapTiles: [],
            mapVisuals: [],
        }

        this.metadata = {
            name: "New Episode",
            author: ""
        };
    }
}
