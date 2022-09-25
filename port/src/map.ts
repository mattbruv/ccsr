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
      for (const obj of area.data) {
        if (obj.data.message.length > 0) {
          for (const msg of obj.data.message) {
            console.log(msg.text);
          }
        }
      }
    }
  }
}
