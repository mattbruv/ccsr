import { Game, getMapRect } from "./game";

export class GameCamera {
  private game: Game;

  constructor(game: Game) {
    this.game = game;
  }

  public update() {
    const pos = this.game.player.getPosition();
    const x =
      -pos.x * this.game.viewport.scale.x +
      this.game.app.renderer.screen.width / 2;
    const y =
      -pos.y * this.game.viewport.scale.y +
      this.game.app.renderer.screen.height / 2;
    this.game.viewport.position.set(x, y);
  }

  public setCameraOnMap(mapName: string) {
    const data = getMapRect(mapName);
    this.setCamera(-data.x, -data.y);
  }

  public setCamera(x: number, y: number) {
    this.game.viewport.position.set(x, y);
  }
}
