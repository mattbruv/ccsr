import * as PIXI from "pixi.js";
import { Game } from "./game";
import { GameObjectType, Rect } from "./types";
import * as PF from "pathfinding";
import { rectAinRectB } from "./collision";
import { GameObject } from "./object";

export class Grid {
  private game: Game;

  public container: PIXI.Container;

  private gridlines: PIXI.Graphics;

  private originalGrid: PF.Grid;
  private originalGraphics: PIXI.Graphics;

  private objs: GameObject[] = [];

  constructor(game: Game) {
    this.game = game;

    this.container = new PIXI.Container();

    this.gridlines = new PIXI.Graphics();

    this.originalGrid = new PF.Grid(1, 1);
    this.originalGraphics = new PIXI.Graphics();
  }

  public gridXYtoRect(x: number, y: number): Rect {
    return {
      x: x * 8,
      y: y * 8,
      width: 8,
      height: 8,
    };
  }

  public canWalk(rect: Rect): boolean {
    //console.log(rect);
    const obj = this.objs.find((o) => rectAinRectB(rect, o.getRect()));
    if (obj === undefined) {
      return false;
    }
    return obj?.data.item.type != GameObjectType.WALL;
  }

  public renderGrid(graphics: PIXI.Graphics, grid: PF.Grid) {
    graphics.clear();

    for (let x = 0; x < grid.width; x++) {
      for (let y = 0; y < grid.height; y++) {
        const canWalk = grid.isWalkableAt(x, y);

        const rect = this.gridXYtoRect(x, y);

        if (canWalk) {
          graphics.beginFill(0x00ff00, 1);
        } else {
          graphics.beginFill(0xff0000, 1);
        }
        graphics.drawRect(rect.x, rect.y, rect.width, rect.height);
      }
    }
  }

  public fillOriginalGrid() {
    const size = this.game.worldRect!;

    for (let x = 0; x < size.width / 8; x++) {
      for (let y = 0; y < size.height / 8; y++) {
        // we can walk here
        const canWalk = this.canWalk(this.gridXYtoRect(x, y));
        //console.log("WE DID IT? ", x, y, this.originalGrid.height);
        this.originalGrid.setWalkableAt(x, y, canWalk);
        //
      }
    }
  }

  public init() {
    this.objs = this.game.gameObjects.slice();
    this.objs.reverse();
    const size = this.game.worldRect!;
    this.originalGrid = new PF.Grid(size.width / 8, size.height / 8);

    console.log(this.originalGrid);

    this.gridlines.beginFill(0xffffff, 0.1);
    this.gridlines.drawRect(size.x, size.y, size.width, size.height);

    this.gridlines.clear();
    this.gridlines.lineStyle({
      width: 1,
      color: 0x333333,
      alpha: 1,
      alignment: 0,
    });

    for (let x = 0; x < size.width / 8; x++) {
      for (let y = 0; y < size.height / 8; y++) {
        const r = this.gridXYtoRect(x, y);
        this.gridlines.moveTo(r.x, r.y);
        this.gridlines.lineTo(r.x + r.width, r.y);
        this.gridlines.lineTo(r.x + r.width, r.y + r.height);
      }
    }

    this.fillOriginalGrid();
    this.renderGrid(this.originalGraphics, this.originalGrid);

    this.originalGraphics.alpha = 0.65;
    this.container.addChild(this.originalGraphics);
    //this.container.addChild(this.gridlines);

    console.log("SIZE", size);
    //
  }
}
