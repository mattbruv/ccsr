import { Game } from "./game";

export abstract class EpisodeScript {
  public game: Game;

  abstract init(): void;

  constructor(game: Game) {
    this.game = game;
  }
}
