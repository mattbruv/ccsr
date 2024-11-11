import JSZip from "jszip";
import { ImageFile, MapFile, Project } from "./types";
import { saveAs } from "file-saver";
import { newProject } from "../context/MapOMaticContext";
import { stringToMapData } from "./game/fromLingo";
import { mapDataToLingo } from "./game/toLingo";
import { lingoValueToString } from "./parser/print";
import { filenameFromPath, newMapFile } from "./helpers";
import { PNG } from "pngjs/browser"

const METADATA_FILE = "map-o-matic.json"
const MAP_FOLDER = "map.data"

export function saveProjectToZip(project: Project) {
    const zip = new JSZip()
    zip.file(METADATA_FILE, JSON.stringify(project.metadata))

    for (const map of project.maps) {
        if (!map.data) continue;
        const lingo = mapDataToLingo(map.data)
        const text = lingoValueToString(lingo, false, false)
        const path = `${MAP_FOLDER}/${map.filename}.txt`;
        zip.file(path, text)
    }

    for (const image of project.images) {
        zip.file(image.path, image.originalData)
    }

    zip.generateAsync({ type: "blob" })
        .then((content) => {
            saveAs(content, project.metadata.name + ".zip")
        })
}

export async function loadZipFromServer(filename: string) {
    const response = await fetch(filename)
    const blob = await response.blob()
    const project = await loadProjectFile(blob)
    return project
}

export async function loadCustomZip(file: File) {
    const project = await loadProjectFile(file)
    return project
}

async function loadProjectFile(blob: Blob | File): Promise<Project> {
    const zip = await JSZip.loadAsync(blob)
    const project = newProject()
    project.metadata.name = ""
    project.metadata.author = ""

    const metadata_file = zip.file(METADATA_FILE)

    if (metadata_file) {
        const metadata_text = await metadata_file.async("text")
        project.metadata = JSON.parse(metadata_text)
    }

    // Extract map files
    project.maps = await Promise.all(Object.entries(zip.files)
        .sort(([a], [b]) => a.localeCompare(b))
        .filter(([filename, file]) => filename.includes(MAP_FOLDER) && !file.dir && !filename.includes("__MACOSX") && !filename.includes(".DS_Store"))
        .map(async ([filename, file]) => {
            const text = await file.async("text")
            const data = stringToMapData(text.trim())
            const map = newMapFile()
            // not the prettiest way to do this but whatever
            // Get just the filename
            map.filename = filename.split("/").at(-1)?.split(".").slice(0, -1).join(".")!;
            map.file_text = text;
            map.data = data;
            return map
        }))


    const images: ImageFile[] = []

    project.images = await Promise.all(zip.file(/\.png$/)
        // Some mac metadata is in the zip files, ignore that
        .filter(x => !x.name.includes("__MACOSX"))
        .map(async (pngFile) => {
            const originalBlob = await pngFile.async("blob")
            const blob = await removeWhiteFromBlob(originalBlob)

            const filenameAndExtension = filenameFromPath(pngFile.name)

            const image: ImageFile = {
                data: blob,
                originalData: originalBlob,
                filename: filenameAndExtension.split(".png").at(0) ?? "",
                filenameAndExtension,
                path: pngFile.name,
            }
            return image
        }));

    return project
}

// Chat GPT generated garbage
async function removeWhiteFromBlob(blob: Blob): Promise<Blob> {
    // Create an image element
    const img = new Image();
    img.src = URL.createObjectURL(blob);

    return new Promise((resolve, reject) => {
        img.onload = () => {
            // Create a canvas to manipulate the image
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d')!;
            canvas.width = img.width;
            canvas.height = img.height;

            // Draw the image onto the canvas
            ctx.drawImage(img, 0, 0);

            // Get the image data
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            // Loop through the pixels and change white pixels to transparent
            for (let i = 0; i < data.length; i += 4) {
                // Check if the pixel is white (R=255, G=255, B=255)
                if (data[i] === 255 && data[i + 1] === 255 && data[i + 2] === 255) {
                    // Set the alpha channel to 0 (transparent)
                    data[i + 3] = 0;
                }
            }

            // Put the modified data back to the canvas
            ctx.putImageData(imageData, 0, 0);

            // Convert the canvas back to a blob
            canvas.toBlob((newBlob) => {
                if (newBlob) {
                    resolve(newBlob);
                } else {
                    reject(new Error('Blob creation failed.'));
                }
            }, 'image/png');
        };

        img.onerror = (error) => {
            reject(error);
        };
    });
}
