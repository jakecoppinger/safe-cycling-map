import { RawOverpassNode, RawOverpassWay } from "./interfaces.js";

export function wayToNode(way: RawOverpassWay, allItems: (RawOverpassNode | RawOverpassWay)[]): RawOverpassNode | null {
  console.log("Converting way...");
  console.log(way)
  const nodes: number[] = way.nodes;
  const firstNodeId = nodes[0];
  const firstNode = allItems
    .find(item => item.type === 'node' && item.id === firstNodeId) as (RawOverpassNode | undefined)
  if (firstNode === undefined) {
    console.error(`Unable to find node with id ${firstNodeId}`);
    return null;
  }
  const representativeNode: RawOverpassNode = firstNode;
  const { lat, lon } = representativeNode;
  const { id, tags } = way;
  const output: RawOverpassNode = {
    id,
    lat,
    lon,
    type: 'node',
    tags
  }
  console.log({ output });
  return output;
}