import { Game, getMapRect } from "./game";

export class GameCamera {
  private game: Game;
  private mapWidthPixels: number = 0;
  private mapHeightPixels: number = 0;

  private screenWidth: number = 0;
  private screenHeight: number = 0;

  private scaleX: number = 0;
  private scaleY: number = 0;

  constructor(game: Game) {
    this.game = game;
  }

  public setScale() {
    const w = this.game.app.renderer.screen.width;
    const h = this.game.app.renderer.screen.height;
    this.screenWidth = w;
    this.screenHeight = h;
    //console.log(this.game.viewport.scale);
    const rect = getMapRect(this.game.player.currentMap);
    this.mapHeightPixels = rect.height;
    this.mapWidthPixels = rect.width;
    // console.log(w, h, w > h, w / h, rect);
    const scaleX = w / rect.width;
    const scaleY = h / rect.height;
    const scale = w > h ? scaleY : scaleX;
    this.game.viewport.scale.set(scale);
    this.scaleX = scale;
    this.scaleY = scale;
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

    let x = -data.x * this.game.viewport.scale.x;
    let y = -data.y * this.game.viewport.scale.y;

    const w = this.game.app.renderer.screen.width;
    const h = this.game.app.renderer.screen.height;

    const mapWidth = this.mapWidthPixels * this.scaleX;
    const mapHeight = this.mapHeightPixels * this.scaleY;

    const padX = this.screenWidth - mapWidth;
    const padY = this.screenHeight - mapHeight;

    if (w > h) {
      const half = Math.round(padX / 2);
      const test = Math.abs(x) - half;
      // Only center the map if no area outside the world would be seen
      if (test >= 0) {
        x += half;
        const worldWidth = this.game.worldRect!.width * this.scaleX;
        const finalX = Math.abs(x) + this.screenWidth;
        if (finalX > worldWidth) {
          x += finalX - worldWidth;
        }
      }
    } else {
      const half = Math.round(padY / 2);
      const test = Math.abs(y) - half;
      if (test >= 0) {
        y += half;
        const worldHeight = this.game.worldRect!.height * this.scaleY;
        const finalY = Math.abs(y) + this.screenHeight;
        if (finalY > worldHeight) {
          y += finalY - worldHeight;
        }
      }
    }

    this.setCamera(x, y);
  }

  public setCamera(x: number, y: number) {
    this.game.viewport.position.set(x, y);
  }
}
