import * as PIXI from "pixi.js";
import { Game } from "./game";
import { GameObjectMoveCond, GameObjectType, Pos, Rect } from "./types";
import * as PF from "pathfinding";
import { intersect, rectAinRectB } from "./collision";
import { GameObject } from "./object";

enum PathPoint {
  START,
  END,
}

export class Grid {
  private game: Game;

  public container: PIXI.Container;

  private gridlines: PIXI.Graphics;

  private originalGrid: PF.Grid;
  private originalGraphics: PIXI.Graphics;

  private objs: GameObject[] = [];

  private pathSelect = PathPoint.START;

  private from: Pos = { x: 0, y: 0 };
  private to: Pos = { x: 1, y: 1 };

  private points: PIXI.Graphics;
  private path: PIXI.Graphics;

  constructor(game: Game) {
    this.game = game;

    this.container = new PIXI.Container();

    this.gridlines = new PIXI.Graphics();

    this.originalGrid = new PF.Grid(1, 1);
    this.originalGraphics = new PIXI.Graphics();

    this.points = new PIXI.Graphics();
    this.path = new PIXI.Graphics();
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
    rect.width = 32;
    rect.height = 32;

    const collide = this.objs.find((obj) => {
      const vis = obj.data.item.visi;

      return (
        obj.isVisible() &&
        intersect(rect, obj.getRect()) &&
        obj.data.item.type !== GameObjectType.ITEM &&
        obj.data.item.type !== GameObjectType.DOOR &&
        obj.data.move.COND == GameObjectMoveCond.NONE &&
        !vis.inviAct &&
        !vis.inviObj &&
        !vis.visiAct &&
        !vis.visiObj
      );
    });

    //console.log(rect, collide);

    //const obj = this.objs.find((o) => rectAinRectB(rect, o.getRect()));
    if (collide === undefined) {
      return false;
    }

    const t = collide.data.item.type;

    return t != GameObjectType.WALL && t != GameObjectType.CHAR;
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
        //console.log(rect);
        graphics.drawRect(rect.x, rect.y, rect.width, rect.height);
      }
    }
  }

  public noWalkGrid(grid: PF.Grid) {
    for (let x = 0; x < grid.width; x++) {
      for (let y = 0; y < grid.height; y++) {
        grid.setWalkableAt(x, y, false);
      }
    }
  }

  public fillOriginalGrid() {
    this.noWalkGrid(this.originalGrid);
    const size = this.game.worldRect!;

    const boundX = size.width / 8;
    const boundY = size.height / 8;
    //   const boundX = 4 * 2;
    //    const boundY = 4 * 2;

    for (let y = 0; y < boundY; y++) {
      for (let x = 0; x < boundX; x++) {
        // we can walk here
        //console.log("test", x, y);
        const canWalk = this.canWalk(this.gridXYtoRect(x, y));
        //console.log("WE DID IT? ", x, y, this.originalGrid.height);

        if (!canWalk) {
          continue;
        }

        for (let x1 = 0; x1 < 4; x1++) {
          for (let y1 = 0; y1 < 4; y1++) {
            const dx = x + x1;
            const dy = y + y1;
            if (dx < this.originalGrid.width && dy < this.originalGrid.height) {
              //console.log(dx, dy);
              const tag = dx.toString() + "," + dy.toString();
              //console.log(x1, y1);
              this.originalGrid.setWalkableAt(dx, dy, canWalk);
            }
          }
        }

        //this.originalGrid.setWalkableAt(x, y, canWalk);
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

    /*
    for (let x = 0; x < size.width / 8; x++) {
      for (let y = 0; y < size.height / 8; y++) {
        const r = this.gridXYtoRect(x, y);
        this.gridlines.moveTo(r.x, r.y);
        this.gridlines.lineTo(r.x + r.width, r.y);
        this.gridlines.lineTo(r.x + r.width, r.y + r.height);
      }
    }
    */

    this.fillOriginalGrid();
    this.renderGrid(this.originalGraphics, this.originalGrid);

    this.originalGraphics.alpha = 0.65;
    this.container.addChild(this.originalGraphics);
    this.container.addChild(this.path);
    this.container.addChild(this.points);
    //this.container.addChild(this.gridlines);

    console.log("SIZE", size);
    //

    this.game.viewport.on("mousedown", (e: PIXI.InteractionEvent) => {
      if (e.data.button == 1) {
        const out = this.game.viewport.toLocal(e.data.global);
        const x = Math.round(out.x / 8) * 8;
        const y = Math.round(out.y / 8) * 8;
        const theX = x / 8;
        const theY = y / 8;

        if (this.pathSelect == PathPoint.START) {
          this.from.x = theX;
          this.from.y = theY;
          console.log("from", theX, theY);
        } else {
          this.to.x = theX;
          this.to.y = theY;
          console.log("to", theX, theY);
        }
        this.drawStartEnd();
      }
    });

    document.onkeyup = (event) => {
      const key = event.key;

      if (key == "1") {
        console.log("SELECT START");
        this.pathSelect = PathPoint.START;
      }
      if (key == "2") {
        console.log("SELECT END");
        this.pathSelect = PathPoint.END;
      }
      if (key == "3") {
        this.calculatePath();
        // calculate path and draw it
      }
    };
  }

  public drawStartEnd() {
    console.log("DRWE SHIT");
    this.points.clear();
    this.path.beginFill(0x00ffff, 1);
    this.drawPoint(this.points, this.from.x, this.from.y);
    this.path.beginFill(0xffff00, 1);
    this.drawPoint(this.points, this.to.x, this.to.y);
  }

  public drawPoint(graphics: PIXI.Graphics, x: number, y: number) {
    const rect = this.gridXYtoRect(x, y);
    console.log(rect);
    graphics.drawRect(rect.x, rect.y, rect.width, rect.height);
  }

  public drawPath(path: number[][]) {
    this.path.clear();
    this.path.beginFill(0xff00ff, 1);

    for (const p of path) {
      this.drawPoint(this.path, p[0], p[1]);
    }
  }

  public calculatePath() {
    const finder = new PF.AStarFinder();
    const gridBackup = this.originalGrid.clone();

    console.log("find", this.from, "to", this.to);

    const path = finder.findPath(
      this.from.x,
      this.from.y,
      this.to.x,
      this.to.y,
      gridBackup
    );

    console.log(path);
  }
}
