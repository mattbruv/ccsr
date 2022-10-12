import * as PIXI from "pixi.js";
import {
  Game,
  getMemberTexture,
  UI_HEIGHT_PERCENT,
  UI_WIDTH_PERCENT,
} from "./game";
import { PlayerStatus } from "./player";

export enum InventoryMode {
  NORMAL,
  SELECT,
}

export interface GameInventoryItemData {
  key: string;
  name: string; // at first glance, it seems like this isn't used in the game.
  description: string;
}

export class GameInventory {
  private game: Game;

  private sprite: PIXI.Sprite;
  private spriteInstructions: PIXI.Sprite;
  private spriteSelectedItem: PIXI.Sprite;

  private textElement: HTMLParagraphElement;

  private adaptiveScale: boolean = false;

  private originalHeight: number = 0;
  private originalWidth: number = 0;

  private scale = 1;

  private readonly FONT_SCALE = 0.72;

  private mode = InventoryMode.NORMAL;

  public items: string[] = [];
  public acts: string[] = [];
  public names: string[] = [];

  private itemData: GameInventoryItemData[] = [];
  private itemSprites: PIXI.Sprite[] = [];

  private debugGraphics: PIXI.Graphics = new PIXI.Graphics();

  private isInventoryOpen: boolean = false;

  private onCloseCallback: (() => void) | undefined;

  public selection: Set<string> = new Set();
  public banned: Set<string> = new Set();

  constructor(game: Game) {
    this.game = game;
    this.sprite = new PIXI.Sprite();
    this.spriteInstructions = new PIXI.Sprite();
    this.spriteSelectedItem = new PIXI.Sprite();

    this.onCloseCallback = undefined;

    // Initialize and style the text HTML element
    this.textElement = document.createElement("p");
    this.textElement.textContent = "";
    this.textElement.style.position = "absolute";
    this.textElement.style.display = "none";
    this.textElement.style.top = "0";
    this.textElement.style.left = "0";
    //this.textElement.style.backgroundColor = "red";
    this.textElement.style.userSelect = "none";
    this.textElement.style.fontFamily = "arial narrow";
    this.textElement.style.fontStretch = "condensed";

    this.adaptiveScale = true;

    document.getElementById("game-container")?.appendChild(this.textElement);
  }

  public isOpen() {
    return this.isInventoryOpen;
  }

  private selectItem(key: string, index: number) {
    if (index > 16) return;
    console.log("SELECT", key);

    const points = this.getItemLocationPoints();
    const p = points[index];
    this.spriteSelectedItem.position.set(p.center.x - 1, p.center.y - 1);
    const desc = this.itemData.find((data) => data.key == key)!.description;
    this.textElement.innerText = desc;
  }

  private clearItemSprites() {
    this.itemSprites.map((s) => {
      s.removeAllListeners();
      s.parent.removeChild(s);
    });

    this.itemSprites = [];
  }

  private renderItems() {
    if (this.mode == InventoryMode.NORMAL) {
      this.spriteSelectedItem.visible = true;
    } else {
      this.spriteSelectedItem.visible = false;
    }
    this.clearItemSprites();

    if (this.items.length > 16) {
      alert("Warning! Items > 16");
    }
    const items = this.items
      .filter((i) => this.banned.has(i) == false)
      .slice(0, 16);
    const points = this.getItemLocationPoints();

    items.map((item, index) => {
      const itemSprite = PIXI.Sprite.from(item + ".png");
      itemSprite.anchor.set(0.5, 0.5);
      itemSprite.position.set(points[index].center.x, points[index].center.y);
      itemSprite.interactive = true;
      itemSprite.buttonMode = true;

      itemSprite.on("pointerdown", () => {
        if (this.mode == InventoryMode.NORMAL) {
          this.selectItem(item, index);
        } else {
          if (this.selection.has(item)) {
            this.selection.delete(item);
          } else {
            if (this.selection.size < 5) {
              this.selection.add(item);
            }
          }

          const description = [...this.selection].map((item) => {
            return this.itemData.find((i) => i.key == item)?.name;
          });

          this.textElement.innerText = description.join(", ");
        }
      });

      // Add to the itemSprites array so we can keep track of references
      // And release them when the inventory is opened next time.
      this.itemSprites.push(itemSprite);
      this.sprite.addChild(itemSprite);
    });

    if (this.mode == InventoryMode.NORMAL) {
      this.selectItem(items[0], 0);
    } else {
      this.textElement.innerText = "";
    }
  }

  public setMode(mode: InventoryMode) {
    this.mode = mode;

    if (mode == InventoryMode.SELECT) {
      this.textElement.innerText = "";
      this.selection.clear();
      this.spriteInstructions.visible = false;
      this.spriteSelectedItem.visible = false;
    } else {
      this.selection.clear();
      this.spriteInstructions.visible = true;
      this.spriteSelectedItem.visible = true;
    }
  }

  public init() {
    this.banned.add("getanimal");
    this.sprite.texture = getMemberTexture("inventory")!;
    this.sprite.anchor.set(0.5, 0.5);
    this.sprite.visible = false;

    this.originalHeight = this.sprite.height;
    this.originalWidth = this.sprite.width;

    this.spriteInstructions.texture = getMemberTexture("inventory.instruct")!;
    this.spriteInstructions.anchor.set(0.5, 0.5);
    this.spriteInstructions.visible = true;

    // this.spriteInstructions.buttonMode = true;
    // this.spriteInstructions.interactive = true;

    this.spriteInstructions.on("pointerdown", () => {
      this.closeInventory();
    });

    this.spriteSelectedItem.texture = getMemberTexture("inventory.square")!;
    this.spriteSelectedItem.anchor.set(0.5, 0.5);
    this.spriteSelectedItem.visible = false;

    this.debugGraphics.beginFill(0xff0000, 1);

    this.game.app.stage.addChild(this.sprite);
    this.sprite.addChild(this.spriteInstructions);
    this.sprite.addChild(this.debugGraphics);
    this.sprite.addChild(this.spriteSelectedItem);

    this.resize();
  }

  public initItems(itemData: GameInventoryItemData[]) {
    this.itemData = itemData;
  }

  /**
   * Mathematically generate a list of X,Y locations for each
   * inventory slot, excluding the top corners
   *
   * @returns An array of 16 points to use as graphic coordinates
   */
  private getItemLocationPoints() {
    const originX = -Math.round(this.originalWidth / 2) + 24;
    const originY = -Math.round(this.originalHeight / 2) + 51;
    const squarePadding = 44;
    const squareWidth = 35;

    const points = Array.from(Array(6 * 3).keys()).map((index) => {
      const column = index % 6;
      const row = Math.floor(index / 6);
      const topLeft = {
        x: originX + column * squarePadding,
        y: originY + row * squarePadding,
      };
      const center = {
        x: topLeft.x + Math.round(squareWidth / 2),
        y: topLeft.y + Math.round(squareWidth / 2),
      };

      return { center, topLeft };
    });

    // Remove the top left and top right inventory slots
    // because they are not shown on the graphic
    points.splice(0, 1);
    points.splice(4, 1);

    return points;
  }

  public openInventory() {
    this.game.player.setStatus(PlayerStatus.STOP);
    this.isInventoryOpen = true;
    this.sprite.visible = true;
    this.textElement.style.display = "block";

    this.setTextDimensions();

    const items = this.items.filter((i) => !this.banned.has(i));

    if (items.length == 0) {
      this.spriteSelectedItem.visible = false;
      this.textElement.innerText = this.game.gameData!.noItems;
      this.clearItemSprites();
    } else {
      this.renderItems();
    }
  }

  public setOnClose(callback: () => void) {
    this.onCloseCallback = callback;
  }

  private updateVisIfWalking() {
    if (this.game.player.status == PlayerStatus.MOVE) {
      this.game.updateAllVisibility();
    }
  }

  public addAct(actKey: string) {
    this.acts.push(actKey);
    this.updateVisIfWalking();
  }

  public removeAct(actKey: string) {
    const index = this.acts.findIndex((i) => i == actKey);
    if (index !== -1) {
      this.acts.splice(index, 1);
      this.updateVisIfWalking();
      return true;
    }
    return false;
  }

  public has(thing: string) {
    return (
      this.names.includes(thing) || this.hasAct(thing) || this.hasItem(thing)
    );
  }

  private hasAct(actKey: string) {
    return this.acts.filter((i) => i == actKey).length;
  }

  public addItem(itemKey: string) {
    this.items.push(itemKey);
    this.updateVisIfWalking();
  }

  public removeItem(itemKey: string) {
    const index = this.items.findIndex((i) => i == itemKey);
    if (index !== -1) {
      this.items.splice(index, 1);
      this.updateVisIfWalking();
      return true;
    }
    return false;
  }

  private hasItem(itemKey: string) {
    return this.items.filter((i) => i == itemKey).length;
  }

  public closeInventory() {
    this.game.player.setStatus(PlayerStatus.MOVE);
    this.isInventoryOpen = false;
    this.sprite.visible = false;

    this.textElement.innerText =
      "I see you, poking around in the developer console";
    this.textElement.style.display = "none";

    if (this.onCloseCallback) {
      this.onCloseCallback();
      this.onCloseCallback = undefined;
    }
  }

  private setTextDimensions() {
    const width = 260;
    const height = 20;

    const boxWidth = width * this.scale;
    const boxHeight = height * this.scale;

    const halfWidth = Math.round(this.sprite.width / 2);
    const halfHeight = Math.round(this.sprite.height / 2);

    const l = 25;
    const t = 21;

    const leftAdjust = l * this.scale;
    const topAdjust = t * this.scale;

    const left = this.sprite.position.x - halfWidth + leftAdjust;
    const top = this.sprite.position.y - halfHeight + topAdjust;

    this.textElement.style.width = boxWidth + "px";
    this.textElement.style.height = boxHeight + "px";
    this.textElement.style.left = left + "px";
    this.textElement.style.top = top + "px";
  }

  public resize() {
    const width = this.game.app.renderer.screen.width;
    const height = this.game.app.renderer.screen.height;
    const x = Math.round(width / 2);
    const y = Math.round(height / 2);
    this.sprite.position.set(x, y);
    this.spriteInstructions.position.set(0, 90);

    // In the original game, the message takes up
    // 65% of the screen's height more or less
    const targetHeight = height * UI_HEIGHT_PERCENT;
    const targetWidth = width * UI_WIDTH_PERCENT;
    const scaleY = targetHeight / this.originalHeight;
    const scaleX = targetWidth / this.originalWidth;

    this.scale = 1;
    if (this.adaptiveScale) {
      this.scale = width > height ? scaleY : scaleX;
    }

    this.sprite.scale.set(this.scale, this.scale);

    this.textElement.style.fontSize = 100 * this.scale * this.FONT_SCALE + "%";
    this.setTextDimensions();
  }
}
