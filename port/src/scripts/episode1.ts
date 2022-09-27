import { EpisodeScript } from "./episodeScript";

export class Episode1 extends EpisodeScript {
  public init(): void {
    const startMap = "0106";
    this.game.setMap(startMap);
    this.game.player.setMapAndPosition(startMap, 6, 10);
    this.game.setCameraOnMap(startMap);
  }
}
