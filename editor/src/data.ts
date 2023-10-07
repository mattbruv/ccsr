
export interface EditorFileData {
    filename: string
    data: Blob
}

export interface EditorMetadata {
    name: string
    author: string
}

export class EditorData {
    loadPercent: number = 0;

    images: {
        characterVisuals: EditorFileData[],
        mapTiles: EditorFileData[],
        mapVisuals: EditorFileData[],
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
