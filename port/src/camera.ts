import { Game, getMapRect } from "./game";

export class GameCamera {
  private game: Game;

  constructor(game: Game) {
    this.game = game;
  }

  public setScale() {
    const w = this.game.app.renderer.screen.width;
    const h = this.game.app.renderer.screen.height;
    //console.log(this.game.viewport.scale);
    const rect = getMapRect(this.game.player.currentMap);
    // console.log(w, h, w > h, w / h, rect);
    const scaleX = w / rect.width;
    const scaleY = h / rect.height;
    const scale = w > h ? scaleY : scaleX;
    this.game.viewport.scale.set(scale);
  }

  public update() {
    const map = this.game.player.currentMap;
    //this.setScale();
    this.setCameraOnMap(map);
    //console.log(w, h, w > h);
    /*
    const pos = this.game.player.getPosition();
    const x =
      -pos.x * this.game.viewport.scale.x +
      this.game.app.renderer.screen.width / 2;
    const y =
      -pos.y * this.game.viewport.scale.y +
      this.game.app.renderer.screen.height / 2;
    this.game.viewport.position.set(x, y);
    */
  }

  public setCameraOnMap(mapName: string) {
    const data = getMapRect(mapName);

    const x = -data.x * this.game.viewport.scale.x;
    const y = -data.y * this.game.viewport.scale.y;

    this.setCamera(x, y);
  }

  public setCamera(x: number, y: number) {
    this.game.viewport.position.set(x, y);
  }
}
