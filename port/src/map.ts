import { GameObject } from "./types";

export interface GameMapArea {
  name: string;
  roomID: number;
  roomStatus: number;
  data: GameObject[];
}

export class GameMap {
  public loadMap(data: GameMapArea[]) {
    for (const area of data) {
      console.log(area.name);
    }
  }
}
