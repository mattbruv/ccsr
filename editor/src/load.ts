import JSZip from "jszip";
import { useStore } from "./store";
import { parseMap } from "./ccsr/parser/parser";
import { Metadata } from "./ccsr/types";
import Renderer from "./ccsr/renderer";

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
        filename: path.split("/").pop()!.split(".")[0],
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

    if (path.endsWith(".png")) {
      const data = await file.async("base64");
      const split = path.split("/").pop()!.split(".");
      const filetype = split.pop()!;
      const filename = split.join(".");

      store.project.images.push({
        data,
        filename,
        path,
        filetype,
      });
    }
  }

  Renderer.loadImages(store.project.images);
  console.log(Renderer.app);
}

export const EPISODE_DATA = [
  {
    title: "Episode 1: Pool Problems",
    props: { filename: "1.ccsr.zip" },
  },
  {
    title: "Episode 2: Tennis Menace",
    props: { filename: "2.ccsr.zip" },
  },
  {
    title: "Episode 3: Vivian vs. the Volcano",
    props: { filename: "3.ccsr.zip" },
  },
  {
    title: "Episode 4: Disco Dilema",
    props: { filename: "4.ccsr.zip" },
  },
  {
    title: "Scooby Doo and the Hollywood Horror: Part 1",
    props: { filename: "scooby-1.ccsr.zip" },
  },
  {
    title: "Scooby Doo and the Hollywood Horror: Part 2",
    props: { filename: "scooby-2.ccsr.zip" },
  },
];
