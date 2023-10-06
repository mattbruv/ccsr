
import { EditorData, EditorImage } from "./data";
import JSZip from "jszip"
import { useStore } from "./store";

export async function loadEpisodeZipFile(fileName: string) {
    const jszip = new JSZip();
    const request = await fetch("assets/" + fileName)

    const blob = await request.blob();
    const zip = await jszip.loadAsync(blob);

    const store = useStore();
    store.$reset();
    const data = store.data;

    const imageFolders: [string, EditorImage[]][] = [
        ["character.visuals/", data.images.characterVisuals],
        ["map.tiles/", data.images.mapTiles],
        ["map.visuals/", data.images.mapVisuals],
        ["map_items/", data.images.mapVisuals]
    ];


    zip.forEach(async (path, file) => {
        for (const folder of imageFolders) {
            if (path.includes(folder[0])) {
                const name = path.replace(folder[0], "");
                if (name) {
                    const blob = await file.async("blob");
                    folder[1].push({
                        name,
                        data: blob
                    })
                }
            }
        }
    })
}