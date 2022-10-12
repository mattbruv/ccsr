import { EpisodeScript } from "../script";

export class Episode3 extends EpisodeScript {
  public init(): void {
    const startMap = "0706";
    this.game.setMap(startMap);
    this.game.player.setMapAndPosition(startMap, 13, 11);
    this.game.camera.setScale();
    this.game.camera.snapCameraToMap(startMap);
  }
}
