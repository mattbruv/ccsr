
import { EditorData, EditorImage } from "./data";
import { dataStore } from "./data"
import JSZip from "jszip"

export async function loadEpisodeZipFile(fileName: string) {
    const jszip = new JSZip();
    const request = await fetch("assets/" + fileName)

    const blob = await request.blob();
    const zip = await jszip.loadAsync(blob);
    const data = dataStore();
    const imageFolders: [string, EditorImage[]][] = [
        ["character.visuals/", data.images.characters],
        ["map.tiles/", data.images.tiles],
        ["map.visuals/", data.images.visuals]
    ];


    zip.forEach(async (path, file) => {
        for (const folder of imageFolders) {
            if (path.includes(folder[0])) {
                const name = path.replace(folder[0], "");
                const blob = await file.async("blob");
                folder[1].push({
                    name,
                    data: blob
                })
                console.log(name)
            }
        }
    })
}