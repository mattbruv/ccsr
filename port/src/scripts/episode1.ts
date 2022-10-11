import { EpisodeScript } from "../script";
import { Scene1 } from "../scenes/scene1";

export class Episode1 extends EpisodeScript {
  public init(): void {
    const startMap = "0106";
    this.game.setMap(startMap);
    this.game.player.setMapAndPosition(startMap, 6, 8);
    this.game.camera.setScale();
    this.game.camera.snapCameraToMap(startMap);
    this.game.addScene("ending", new Scene1(this.game));
  }
}
