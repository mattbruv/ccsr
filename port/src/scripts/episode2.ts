import { EpisodeScript } from "../script";

export class Episode2 extends EpisodeScript {
  public init(): void {
    const startMap = "0206";
    this.game.setMap(startMap);
    this.game.player.setMapAndPosition(startMap, 6, 8);
    this.game.camera.setScale();
    this.game.camera.snapCameraToMap(startMap);
  }
}
