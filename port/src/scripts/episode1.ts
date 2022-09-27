import { EpisodeScript } from "./episodeScript";

export class Episode1 extends EpisodeScript {
  public init(): void {
    this.game.setMap("0102");
  }
}
