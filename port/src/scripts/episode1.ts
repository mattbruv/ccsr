import { GameInventoryItemData } from "../inventory";
import { EpisodeScript } from "./episodeScript";

const inventoryDescriptions = [
  "firstaid:firstAid:First Aid Kit, guaranteed to heal!",
  "hammer:hammer:A hammer with which to bang stuff.",
  "sock:sock:This sock smells like a foot.",
  "chocbar:candy:A delicious Chocolate Bar.",
  "ducktape:duckTape:Tape made from Ducks, Duck Tape.",
  "bandaid:bandAid:A nice clean Band-Aid.",
  "bananas:bananas:Yes, we have some Bananas!",
  "sunscreen:sunscreen:Sun Screen, protects you from U-V rays!",
  "keys:keys:Keys to the Cartoon Network Bus.",
  "wrench:wrench:A wrench for nuts and bolts.",
  "gum:gum:Look's like this gum's been chewed.",
  "tape:scotchTape:Tape made in Scotland, Scotch Tape.",
  "deedee:DeeDee:It's Dexter's sister, Dee-Dee.",
  "chicken:Chicken:It's Cow's brother, Chicken.",
  "tennis:racket:Let's go play some tennis!",
  "scuba:boat:A fine seaworthy craft.",
];

export class Episode1 extends EpisodeScript {
  public init(): void {
    const startMap = "0106";
    this.game.setMap(startMap);
    this.game.player.setMapAndPosition(startMap, 6, 8);
    this.game.camera.setScale();
    this.game.camera.snapCameraToMap(startMap);
    this.game.camera.update();

    const invData = this.parseInventory();
    this.game.inventory.initItems(invData);
  }

  private parseInventory(): GameInventoryItemData[] {
    return inventoryDescriptions.map((s) => {
      const data = s.split(":");
      return {
        key: data[0],
        name: data[1],
        description: data[2],
      };
    });
  }
}
