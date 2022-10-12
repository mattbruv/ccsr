import { EpisodeScript } from "../script";

export class Episode4 extends EpisodeScript {
  public init(): void {
    const startMap = "0703";
    this.game.setMap(startMap);
    this.game.player.setMapAndPosition(startMap, 11, 10);
    this.game.camera.setScale();
    this.game.camera.snapCameraToMap(startMap);
  }
}
