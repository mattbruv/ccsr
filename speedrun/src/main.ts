import cytoscape from "cytoscape";

import nodes from "./ep1/nodes.json";
import edges from "./ep1/edges.json";

console.log(nodes);

var cy = cytoscape({
  container: document.getElementById("cy"), // container to render in
  elements: [...nodes, ...edges],
  style: [
    // the stylesheet for the graph
    {
      selector: "node",
      style: {
        "background-color": "#666",
        "background-image": "data(image)", // specify some image
        "background-clip": "none",
        label: "data(id)",
      },
    },
    {
      selector: "edge",
      style: {
        width: 3,
        "line-color": "#ccc",
        "target-arrow-color": "#ccc",
        "target-arrow-shape": "triangle",
      },
    },
  ],
  layout: {
    name: "grid",
    rows: 1,
  },
});
