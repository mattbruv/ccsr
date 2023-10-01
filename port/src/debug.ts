import * as PIXI from "pixi.js";
import { pointInRect } from "./collision";
import { Game, MAP_HEIGHT, MAP_WIDTH } from "./game";
import { Rect } from "./types";

export class Debugger {
  private game: Game;
  private g: PIXI.Graphics;
  private mapGrid: PIXI.Graphics;

  private pItems: HTMLParagraphElement;

  constructor(game: Game) {
    this.game = game;
    this.g = new PIXI.Graphics();
    this.mapGrid = new PIXI.Graphics();
    this.pItems = document.createElement("p");
    this.pItems.style.display = "block";
    this.pItems.style.position = "absolute";
    this.pItems.style.top = "0";
    this.pItems.style.left = "0";
    this.pItems.style.fontWeight = "bold";
    this.pItems.style.backgroundColor = "white";
    this.pItems.style.padding = "10px";
    this.pItems.textContent = "Items";

    //document.body.appendChild(this.pItems);
  }

  public updateItemText() {
    return;
    const itemString = this.game.inventory.items.join("\n");
    const acts = this.game.inventory.acts.join("\n");
    const out = "Items:\n\n" + itemString + "\n\n" + "Actions:\n\n" + acts;
    this.pItems.innerText = out;
  }

  public init() {
    if (!import.meta.env.DEV) {
      return;
    }
    this.game.viewport.addChild(this.mapGrid);
    this.game.viewport.addChild(this.g);

    this.game.viewport.interactive = true;

    this.game.viewport.on("mousedown", (e: PIXI.InteractionEvent) => {
      if (e.data.button == 0) {
        const out = this.game.viewport.toLocal(e.data.global);
        const objs = this.game.gameObjects.filter((o) =>
          pointInRect(out, o.getRect())
        );
        console.log(out);
        console.log(objs);
      }
      if (e.data.button == 4) {
        const out = this.game.viewport.toLocal(e.data.global);
        const x = Math.round(out.x / 8) * 8;
        const y = Math.round(out.y / 8) * 8;
        this.game.player.setPosition(x, y);
        this.game.player.lastPos = { x, y };
        this.game.player.nextPos = { x, y };
        console.log(x, y);
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key == "p") {
        this.game.smoothAnimations = !this.game.smoothAnimations;
      }
      if (event.key == " ") {
        const map = this.game.player.currentMap;
        const objs = this.game.movingObjects.filter((o) => o.mapName == map);
        console.log(objs);
        this.game.playScene("ending")
      }
      if (event.key == "i") {
        console.log(this.game.inventory)
      }
      if (event.key == "c") {
        const s = new Set();
        this.game.gameObjects.map((o) => s.add(o.data.item.name));
        console.log(s);
      }
      if (event.key == "t") {
        const map = this.game.player.currentMap;
        const objs = this.game.gameObjects.filter((o) => o.mapName === map);
        objs.map((o) => {
          o.data.message.map((m) => {
            console.log(m);
          });
        });
        console.log(objs);
      }
    });

    // Draw map grid

    this.mapGrid.lineStyle({ width: 1, color: 0xbb00bb, alignment: 0 });
    for (let x = 0; x < this.game.numMapsX; x++) {
      for (let y = 0; y < this.game.numMapsY; y++) {
        this.mapGrid.drawRect(
          x * MAP_WIDTH,
          y * MAP_HEIGHT,
          MAP_WIDTH + 1,
          MAP_HEIGHT + 1
        );
      }
    }
  }

  public drawCollision(posCurr: Rect, posNew: Rect, obj: Rect) {
    this.clearGraphics();
    this.drawRect(posCurr, {
      width: 1,
      color: 0x00ff00,
      alignment: 0,
    });
    this.drawRect(posNew, {
      width: 1,
      color: 0xffff00,
      alignment: 0,
    });
    this.drawRect(obj, { width: 1, color: 0xff0000, alignment: 0 });
    //console.log("Player attempted to walk in rect:", posNew);
    //console.log("But hit: ", obj);
  }

  public drawRect(rect: Rect, options?: PIXI.ILineStyleOptions) {
    this.g.lineStyle(options);
    this.g.drawRect(rect.x, rect.y, rect.width, rect.height);
  }

  public clearGraphics() {
    this.g.clear();
  }
}
