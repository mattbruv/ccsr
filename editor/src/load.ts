import JSZip from "jszip";
import { useStore } from "./store";
import { parseMap } from "./ccsr/parser/parser";
import { Metadata } from "./ccsr/types";

export async function loadEpisodeZipFile(fileName: string) {
  const jszip = new JSZip();
  const request = await fetch("assets/" + fileName);
  const blob = await request.blob();
  const zip = await jszip.loadAsync(blob);
  await loadZipFile(zip);
}

export async function loadZipFile(zip: JSZip): Promise<void> {
  const store = useStore();
  store.newProject();

  const files = Object.entries(zip.files).filter(
    ([_, file]) => file.dir == false
  );

  for (const [path, file] of files) {
    // Extract map data
    if (path.startsWith("map.data")) {
      const mapData = await file.async("string");
      store.project.maps.push({
        filename: path.split("/").pop()!,
        objectTree: parseMap(mapData).value,
        data: mapData,
      });
    }

    // Extract metadata
    if (path === "metadata.json") {
      const metaString = await file.async("string");
      const metadata = JSON.parse(metaString) as Metadata;
      store.project.metadata = metadata;
    }

    console.log(path);
  }
}

/*
async function addFile(
  filename: string,
  file: JSZipObject,
): Promise<void> {
  const data = await file.async("blob");
  array.push({
    filename,
    data,
  });
}
*/
