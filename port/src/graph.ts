import { ObservablePoint } from "pixi.js";
import { rectAinRectB } from "./collision";
import { Game } from "./game";
import { GameObject } from "./object";
import { Rect } from "./types";

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
    width: 1716 - 1118,
    height: 1916 - 1913,
  },
  {
    x: 1199,
    y: 21,
    width: 2481 - 1199,
    height: 743 - 21,
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
  return {
    data: {
      id: objID(obj),
      name: obj.member,
      map: obj.mapName,
      image: "ep" + episode.toString() + "/" + obj.member + ".png",
    },
  };
}

function episode1(objs: GameObject[]): Edge[] {
  const edges: Edge[] = [];
  const endItems = ["gum", "ducktape", "bandaid", "sock", "tape", "wrench"];

  endItems.map((i) => edge(i, "end")).map((e) => edges.push(e));
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
    elements.push(objToNode(o, 1));
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
  conds.map((c) => {
    const cond = c.data.item.COND[0]!;
    if (!cond.hasObj) {
      if (waterAreas.find((w) => rectAinRectB(c.getRect(), w))) {
        cond.hasObj = "scuba";
      } else {
        cond.hasObj = "start";
      }
    }
  });

  // make edges from cond objects

  conds.map((o) => {
    const id = objID(o);
    const cond = o.data.item.COND[0]!;
    if (cond.giveObj) {
      if (cond.hasObj) {
        elements.push(edge(cond.hasObj, id));
        elements.push(edge(id, cond.giveObj));
      }
      if (cond.hasAct) {
        elements.push(edge(cond.hasAct, id));
        elements.push(edge(id, cond.giveObj));
      }
    }

    if (cond.giveAct) {
      if (cond.hasObj) {
        elements.push(edge(cond.hasObj, id));
        elements.push(edge(id, cond.giveAct));
      }
      if (cond.hasAct) {
        elements.push(edge(cond.hasAct, id));
        elements.push(edge(id, cond.giveAct));
      }
    }
    //
  });

  //elements.map((e) => console.log(e.data));
  console.log(elements);
}
