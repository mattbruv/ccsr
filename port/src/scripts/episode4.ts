import { EpisodeScript } from "../script";

export class Episode4 extends EpisodeScript {
  onNewMap(nextMap: string): void {}

  onDoor(nextMap: string): void {}

  public init(): void {
    const startMap = "0703";
    this.game.setMap(startMap);
    this.game.player.setMapAndPosition(startMap, 11, 10);
    this.game.camera.setScale();
    this.game.camera.snapCameraToMap(startMap);

    this.game.filmLoopData = {
      "block.165": ["orange", "yellow", "green", "purple", "red"],
      "block.166": ["yellow", "green", "purple", "red", "orange"],
      "block.167": ["green", "purple", "red", "orange", "yellow"],
      "block.168": ["purple", "red", "orange", "yellow", "green"],
      "block.169": ["red", "orange", "yellow", "green", "purple"],
    };

    this.game.setFilmLoopObjects();
  }
}
