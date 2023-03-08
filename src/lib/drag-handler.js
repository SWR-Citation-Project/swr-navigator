import { drag } from "d3";


export default function makeDragHandler(simulation) {
  const onDragStart = (event, node) => {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    node.fx = node.x;
    node.fy = node.y;
  };

  const onDrag = (event, node) => {
    node.fx = event.x;
    node.fy = event.y;
  };

  const onDragEnd = (node) => {
    simulation.alphaTarget(0);
    node.fx = null;
    node.fy = null;
  };

  return drag()
    .on("start", onDragStart)
    .on("drag", onDrag)
    .on("end", onDragEnd);
}
