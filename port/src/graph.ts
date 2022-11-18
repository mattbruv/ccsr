import { ObservablePoint, Rectangle } from "pixi.js";
import { rectAinRectB } from "./collision";
import { Game } from "./game";
import { GameObject } from "./object";
import { GameObjectType, Rect } from "./types";

interface Node {
  data: {
    id: string;
    name: string;
    image?: string;
    map?: string;
  };
}

interface Edge {
  data: {
    id: string;
    source: string;
    target: string;
  };
}

type Element = Node | Edge;

const waterAreas: Rect[] = [
  {
    x: 1118,
    y: 1813,
    width: 1805 - 1118,
    height: 1920 - 1813,
  },
  {
    x: 1199,
    y: 21,
    width: 2481 - 1199,
    height: 743 - 21,
  },
];

const ep1Desc = [
  {
    name: "block.73",
    desc: "nurse",
  },
  {
    name: "block.41",
    desc: "chicken",
  },
  {
    name: "block.40",
    desc: "cow",
  },
  {
    name: "tile.7.x",
    desc: "sand",
  },
  {
    name: "marina top.pct",
    desc: "marina",
  },
  {
    name: "block.46",
    desc: "og",
  },
  {
    name: "block.48",
    desc: "edd",
  },
  {
    name: "block.53",
    desc: "bananas",
  },
  {
    name: "tile.5.x",
    desc: "tiles",
  },
  {
    name: "block.51",
    desc: "wrench",
  },
  {
    name: "tile.5.x",
    desc: "tiles",
  },
  {
    name: "tile.5.x",
    desc: "tiles",
  },
  {
    name: "tile.1.x",
    desc: "water",
  },
  {
    name: "tile.1.x",
    desc: "water",
  },
  {
    name: "tile.2.x",
    desc: "grass",
  },
  {
    name: "block.49",
    desc: "tennis",
  },
  {
    name: "block.38",
    desc: "buttercup",
  },
  {
    name: "block.45",
    desc: "IR baboon",
  },
  {
    name: "block.13",
    desc: "hut",
  },
  {
    name: "block.41",
    desc: "chicken",
  },
  {
    name: "block.47",
    desc: "susie",
  },
  {
    name: "block.42",
    desc: "mojo jojo",
  },
  {
    name: "block.43",
    desc: "the mayor",
  },
  {
    name: "block.58",
    desc: "keys",
  },
  {
    name: "block.104",
    desc: "store",
  },
  {
    name: "block.39",
    desc: "dee dee",
  },
  {
    name: "block.36",
    desc: "dexter",
  },
];

function edge(source: string, target: string): Edge {
  return {
    data: {
      id: source + "->" + target,
      source,
      target,
    },
  };
}

function node(id: string, name: string): Node {
  return {
    data: {
      id,
      name,
    },
  };
}

function objID(obj: GameObject) {
  return obj.member + "-" + obj.mapName + "-" + obj.posX + "-" + obj.posY;
}

function objToNode(obj: GameObject, episode: number): Node {
  const tag = " (" + obj.mapName + ")";
  const lookup = ep1Desc.find((e) => obj.member === e.name)?.desc;
  const node = {
    data: {
      id: objID(obj),
      name: lookup ? lookup + tag : obj.member + tag,
      map: obj.mapName,
      image: "ep" + episode.toString() + "/" + obj.member + ".png",
    },
  };
  node.data.image = node.data.image.replace(" ", ".");
  return node;
}

function episode1(objs: GameObject[]): Edge[] {
  const edges: Edge[] = [];
  const endItems = ["gum", "ducktape", "bandaid", "sock", "tape"];

  endItems.map((i) => edge(i, "end")).map((e) => edges.push(e));
  edges.push(edge("gopump", "end"));
  edges.push(edge("busmove", "start"));

  return edges;
}

export function generateNodes(game: Game) {
  const elements: Element[] = [];

  elements.push({
    data: {
      id: "start",
      name: "start",
    },
  });

  elements.push({
    data: {
      id: "end",
      name: "end",
    },
  });

  const importantObjects = game.gameObjects.filter((o) => {
    return o.data.item.COND[0];
    //
  });

  const objs = new Set<string>();
  const acts = new Set<string>();

  episode1(game.gameObjects).map((e) => elements.push(e));

  // Add all important items as nodes
  importantObjects.map((o) => {
    const cond = o.data.item.COND[0]!;
    if (cond.giveAct) acts.add(cond.giveAct);
    if (cond.giveObj) objs.add(cond.giveObj);
    if (cond.hasAct) acts.add(cond.hasAct);
    if (cond.hasObj) objs.add(cond.hasObj);
  });

  console.log(objs);
  console.log(acts);

  [...acts].map((a) => {
    elements.push(node(a, a));
  });

  [...objs].map((o) => {
    const n = node(o, o);
    n.data.image = "ep1/" + n.data.name + ".png";
    elements.push(n);
  });

  // create all edges between objects that affect important nodes
  const conds = game.gameObjects.filter((o) => {
    const cond = o.data.item.COND[0];
    return cond;
  });

  //make it so blank conds are either start or needs boat

  conds
    .filter((o) => {
      const inWater = waterAreas.find((a) => rectAinRectB(o.getRect(), a));
      const noObj = !o.data.item.COND[0]?.hasObj;
      return inWater && noObj;
    })
    .map((o) => (o.data.item.COND[0]!.hasObj = "scuba"));

  // make edges from cond objects

  conds.map((o) => {
    elements.push(objToNode(o, 1));
    const id = objID(o);
    const cond = o.data.item.COND[0]!;
    const visi = o.data.item.visi;
    if (cond.giveObj) {
      if (cond.hasObj) {
        elements.push(edge(cond.hasObj, id));
      }
      elements.push(edge(id, cond.giveObj));
      if (cond.hasAct) {
        elements.push(edge(cond.hasAct, id));
      }
      elements.push(edge(id, cond.giveObj));

      if (!cond.hasAct && !cond.hasObj && !visi.visiAct && !visi.visiObj) {
        elements.push(edge("start", id));
      }
    }

    if (cond.giveAct) {
      if (cond.hasObj) {
        elements.push(edge(cond.hasObj, id));
      }
      elements.push(edge(id, cond.giveAct));
      if (cond.hasAct) {
        elements.push(edge(cond.hasAct, id));
      }
      elements.push(edge(id, cond.giveAct));
    }

    if (visi.visiAct) {
      elements.push(edge(visi.visiAct, id));
    }
    if (visi.visiObj) {
      elements.push(edge(visi.visiObj, id));
    }
  });

  //elements.map((e) => console.log(e.data));
  console.log(elements);

  const names: Node[] = elements.filter((e) =>
    Object.hasOwn(e.data, "name")
  ) as Node[];
  const out = names.map((n) => {
    return {
      name: n.data.name,
      desc: "",
    };
  });

  console.log(out);
  console.log(elements);
}
