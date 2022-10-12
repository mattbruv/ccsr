import { EpisodeScript } from "../script";

export class Episode2 extends EpisodeScript {
  public init(): void {
    const startMap = "0705";
    this.game.setMap(startMap);
    this.game.player.setMapAndPosition(startMap, 13, 10);
    this.game.camera.setScale();
    this.game.camera.snapCameraToMap(startMap);

    this.game.filmLoopData = {
      "block.124": [1, 2, 3, 2, 1, 4, 5].map((n) => "robot." + n),
    };

    this.game.setFilmLoopObjects();
  }
}
