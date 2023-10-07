
import { EditorData, EditorFileData } from "./data";
import JSZip, { JSZipObject } from "jszip"
import { useStore } from "./store";

export async function loadEpisodeZipFile(fileName: string) {
    const jszip = new JSZip();
    const request = await fetch("assets/" + fileName)
    const blob = await request.blob();
    const zip = await jszip.loadAsync(blob);
    await loadZipFile(zip);
}

export async function loadZipFile(zip: JSZip): Promise<void> {

    const store = useStore();
    store.$reset();

    const data = store.data;

    const imageFolders: [string, EditorFileData[]][] = [
        ["character.visuals/", data.images.characterVisuals],
        ["map.tiles/", data.images.mapTiles],
        ["map.visuals/", data.images.mapVisuals],
        ["map_items/", data.images.mapVisuals],
        ["map.data/", data.maps]
    ];

    const files = Object.entries(zip.files);

    let i = 1;
    for (const [path, file] of files) {

        store.data.loadPercent = i++ / files.length * 100

        for (const [folder, array] of imageFolders) {
            if (path.includes(folder)) {
                const filename = path.replace(folder, "")
                if (filename) {
                    await addFile(filename, file, array)
                }
            }
        }
    }

    store.data.loadPercent = 0;
}

async function addFile(filename: string, file: JSZipObject, array: EditorFileData[]): Promise<void> {
    const data = await file.async("blob");
    array.push({
        filename,
        data
    });
}