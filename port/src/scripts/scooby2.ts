import { EpisodeScript } from "../script";
import { Scene2 } from "../scenes/scene2";


export class Scooby2 extends EpisodeScript {
  onNewMap(nextMap: string): void {
  }

  public init(): void {
    const startMap = "0203";
    this.game.setMap(startMap);
    this.game.player.setMapAndPosition(startMap, 15, 16);
    this.game.camera.setScale();
    this.game.camera.snapCameraToMap(startMap);
    this.game.camera.setCameraBounds("0101", "0303");

    this.game.filmLoopData = {};
    this.game.setFilmLoopObjects();

    this.game.addScene("ending", new Scene2(this.game));

  }
}
