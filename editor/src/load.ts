import JSZip from "jszip";
import { useStore } from "./store";
import { parseMap } from "./ccsr/parser/parser";
import { MapFile, Metadata } from "./ccsr/types";
import Renderer from "./ccsr/renderer/renderer";
import { lingoArrayToMapData } from "./ccsr/game/fromLingo";
import { LingoType } from "./ccsr/parser/types";
import { GameMap } from "./ccsr/renderer/types";
import { MapData } from "./ccsr/game/types";
import * as PIXI from "pixi.js"

export async function loadEpisodeZipFile(fileName: string) {
  const jszip = new JSZip();
  const request = await fetch("assets/" + fileName);
  const blob = await request.blob();
  const zip = await jszip.loadAsync(blob);
  await loadZipFile(zip);
}

export async function loadZipFile(zip: JSZip): Promise<void> {
  const store = useStore();
  store.reset()

  const files = Object.entries(zip.files).filter(
    ([_, file]) => file.dir == false
  );

  let id = 0;
  for (const [path, file] of files) {
    // Extract map data
    if (path.startsWith("map.data")) {
      const mapData = await file.async("string");
      const parseResult = parseMap(mapData)
      const mapName = path.split("/").pop()!.split(".")[0]

      if (!parseResult.parseError && parseResult.value.type === LingoType.Array) {
        const data = lingoArrayToMapData(parseResult.value);
        for (const obj of data.objects) {
          store.gameObjects.push({
            data: obj,
            id,
            mapName,
            renderSettings: {
              visible: true,
              highlightBorder: false,
            }
          })
          id += 1;
        }

      }
    }

    // Extract metadata
    if (path === "metadata.json") {
      const metaString = await file.async("string");
      const metadata = JSON.parse(metaString) as Metadata;
      store.metadata = metadata;
    }

    if (path.endsWith(".png")) {
      const data = await file.async("base64");
      const split = path.split("/").pop()!.split(".");
      const filetype = split.pop()!;
      const filename = split.join(".");

      store.imageFiles.push({
        data,
        filename,
        path,
        filetype,
      });
    }
  }

  // Only keep images that have filenames
  store.imageFiles = store.imageFiles.filter((x) => x.filename);
  await store.reloadImages();

  const allMapNames = [...new Set(store.gameObjects.map(x => x.mapName))]
  const gameMaps: GameMap[] = allMapNames.map(name => ({
    name: name,
    renderSettings: {
      renderBorder: true,
      renderGrid: true,
      renderOutOfBounds: false,
    }
  }))

  store.gameMaps = gameMaps
  store.render()
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
