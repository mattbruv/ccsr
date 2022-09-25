import { GameObject } from "./types";

export interface GameMapArea {
  name: string;
  roomID: number;
  roomStatus: number;
  data: GameObject[];
}

export class GameMap {
  public loadMap(data: GameMapArea[]) {
    const set = new Set();
    for (const area of data) {
      for (const obj of area.data) {
        //set.add(obj.data.item.type);
        console.log(obj.data.item.COND);
      }
    }
    console.log(set);
  }
}
