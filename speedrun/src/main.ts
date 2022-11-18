import cytoscape from "cytoscape";
// @ts-ignore
import svg from "cytoscape-svg";
// @ts-ignore
import { saveAs } from "file-saver";
import "./style.css";

import ep1 from "./ep1/elements.json";

cytoscape.use(svg);

var cy = cytoscape({
  container: document.getElementById("cy"), // container to render in
  elements: ep1,
  style: [
    {
      selector: "node",
      style: {
        "background-color": "#666",
        "background-clip": "none",
        "text-wrap": "wrap",
        label: "data(name)",
      },
    },

    // the stylesheet for the graph
    {
      selector: "node[image]",
      style: {
        "background-color": "#666",
        "background-image": "data(image)", // specify some image
        "background-image-smoothing": "no",
        "background-clip": "none",
        "background-opacity": 0,
        "text-wrap": "wrap",
        label: "data(name)",
      },
    },
    {
      selector: "edge",
      style: {
        width: 3,
        "line-color": "#ccc",
        "curve-style": "bezier",
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

document.onkeyup = (e) => {
  const key = e.key;

  if (key !== "s" && key !== "t") {
    return;
  }

  console.log("Save");
  let svgContent;

  if (key === "s") {
    //@ts-ignore
    svgContent = cy.svg({
      full: true,
      scale: 1.0,
      bg: "#ffffff",
    });
  } else {
    //@ts-ignore
    svgContent = cy.svg({
      full: true,
      scale: 1.0,
    });
  }

  var blob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" });
  saveAs(blob, "demo.svg");
};
