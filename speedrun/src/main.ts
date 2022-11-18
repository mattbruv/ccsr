import cytoscape from "cytoscape";

import ep1 from "./ep1/elements.json";

var cy = cytoscape({
  container: document.getElementById("cy"), // container to render in
  elements: ep1,
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
