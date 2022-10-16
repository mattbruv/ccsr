import { EpisodeScript } from "../script";
import { GameObjectMoveCond } from "../types";

export class Episode3 extends EpisodeScript {
  onDoor(nextMap: string): void {}

  public init(): void {
    const startMap = "0706";
    this.game.setMap(startMap);
    this.game.player.setMapAndPosition(startMap, 13, 11);
    this.game.camera.setScale();
    this.game.camera.snapCameraToMap(startMap);

    this.game.filmLoopData = {
      "block.100": ["a", "b"].map((n) => "block.100 " + n),
    };

    this.game.setFilmLoopObjects();

    // prevent maze objects from moving
    // some objects in the maze are set to move when they shouldn't
    this.game.gameObjects
      .filter((o) => o.mapName == "0702")
      .map((o) => (o.data.move.COND = GameObjectMoveCond.NONE));
  }
}
