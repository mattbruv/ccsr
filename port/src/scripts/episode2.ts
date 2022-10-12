import { EpisodeScript } from "../script";

export class Episode2 extends EpisodeScript {
  public init(): void {
    const startMap = "0705";
    this.game.setMap(startMap);
    this.game.player.setMapAndPosition(startMap, 13, 10);
    this.game.camera.setScale();
    this.game.camera.snapCameraToMap(startMap);
  }
}
