// TODO: Find the layer of the road labels for the maptiler background
const layerToAddAfter = undefined;
// const layerToAddAfter = 'greenRoadsId'; //undefined;

function addLayer(
  map: mapboxgl.Map,
  type:
    | "Driving"
    | "Parking"
    | "Sidewalk"
    | "Shoulder"
    | "Biking"
    | "Bus"
    | "SharedLeftTurn"
    | "Construction"
    | "LightRail"
    | "Footway"
    | "SharedUse",
  paint: any // TODO: fix this. used to be mapboxgl.FillPaint | undefined
): void {
  map.addLayer({
    id: type,
    type: "fill",
    source: "osm2streets-vector-tileserver",
    "source-layer": "lanePolygons",
    paint,
    filter: ["==", "type", type],
    // filter: ["==", "$type", "Polygon"],
  }, layerToAddAfter);
}

const colours = {
  laneMarking: "white",
  intersection: "#666666",

  // Derived from
  // https://github.com/a-b-street/osm2streets/blob/5b40c7af877d4314ca7e45c5ac35ec472845c6ca/street-explorer/www/js/layers.js#L55
  Driving: "grey",
  // Driving: "black",
  Parking: "#333333",
  Sidewalk: "#CCCCCC",
  Shoulder: "#CCCCCC",
  Biking: "#0F7D4B",
  Bus: "#BE4A4C",
  SharedLeftTurn: "black",
  Construction: "#FF6D00",
  LightRail: "#844204",
  "Buffer(Planters)": "#555555",

  Footway: "#DDDDE8",
  SharedUse: "#E5E1BB",
};

export const mapOnLoad = (map: mapboxgl.Map) => () => {
  const layers = map.getStyle().layers;
  // Find the index of the first symbol layer in the map style.
  let firstSymbolId;
  for (const layer of layers) {
    if (layer.type === "symbol") {
      firstSymbolId = layer.id;
      break;
    }
  }
  console.log({ firstSymbolId });

  console.log(
    "Adding sources. If you don't seen anything check vector server logs."
  );

  // https://docs.mapbox.com/mapbox-gl-js/example/multiple-geometries/
  // Add a new vector tile source with ID 'mapillary'.
  map.addSource("osm2streets-vector-tileserver", {
    type: "vector",
    tiles: ["https://api.safecyclingmap.com/tile/{z}/{x}/{y}"],
    // tiles: ["http://localhost:3000/tile/{z}/{x}/{y}"],
    
    minzoom: 17,
    maxzoom: 19,
  });

  // addLayer(map, "LightRail", {
  //   "fill-color": "yellow",
  //   "fill-opacity": 0.2,
  // });

  // map.addLayer({
  //   id: "geometry",
  //   type: "fill",

  //   source: "osm2streets-vector-tileserver",
  //   "source-layer": "geometry",
  //   paint: {
  //     // To improve!
  //     "fill-color": colours.Driving,
  //     "fill-opacity": 0.4,
  //   },
  //   filter: ["==", "$type", "Polygon"],
  // });

  // map.addLayer({
  //   id: "lanePolygons",
  //   type: "fill",

  //   source: "osm2streets-vector-tileserver",
  //   "source-layer": "lanePolygons",
  //   paint: {
  //     "fill-color": colours.Driving,
  //     "fill-opacity": 1,
  //   },
  //   filter: ["==", "$type", "Polygon"],
  // });

  // addLayer(map, "Biking", {
  //   "fill-color": colours.Biking,
  //   "fill-opacity": 1,
  // });


  addLayer(map, "SharedUse", {
    "fill-color": "blue",
    "fill-opacity": 0.3,
  });
  addLayer(map, "Shoulder", {
    "fill-color": colours.Shoulder,
    "fill-opacity": 0.5,
  });
  addLayer(map, "Sidewalk", {
    "fill-color": colours.Sidewalk,
    "fill-opacity": 0.9,
  });
  // Currently on the wrong side of ways??
  addLayer(map, "Footway", {
    "fill-color": colours.Footway,
    "fill-opacity": 0.9,
  });
  addLayer(map, "Driving", {
    "fill-color": colours.Driving,
    "fill-opacity": 0.9,
  });

  addLayer(map, "Bus", {
    "fill-color": colours.Bus,
    "fill-opacity": 0.9,
  });
  addLayer(map, "Construction", {
    "fill-color": colours.Construction,
    "fill-opacity": 0.5,
  });

  map.addLayer({
    id: "intersection",
    type: "fill",

    source: "osm2streets-vector-tileserver",
    "source-layer": "geometry",
    paint: {
      "fill-color": colours.intersection,
      "fill-opacity": 1,
    },
    /*
    along with `type`, other attributes we could use here are:
    - control": "Signed" | "Signalled" | "Uncontrolled"
    */
    filter: ["==", "type", "intersection"],
  }, layerToAddAfter);

  // // Currently on the wrong side of ways??
  // addLayer(map, "Parking", {
  //   "fill-color": 'yellow',
  //   "fill-opacity": 0.9,
  // });

  map.addLayer({
    id: "Biking",
    type: "fill",
    source: "osm2streets-vector-tileserver",
    "source-layer": "lanePolygons",
    paint: {
      "fill-color": colours.Biking,
      "fill-opacity": 1,
    },
    filter: ["==", "type", "Biking"],
    // filter: ["==", "type", "Biking"],
  }, layerToAddAfter);

  map.addLayer({
    id: "intersectionMarkings",
    type: "fill",

    source: "osm2streets-vector-tileserver",
    "source-layer": "intersectionMarkings",
    paint: {
      "fill-color": colours.Driving,
      "fill-opacity": 0.8,
    },
    filter: ["==", "$type", "Polygon"],
  }, layerToAddAfter);

  map.addLayer({
    id: "laneMarkings",
    type: "fill",

    source: "osm2streets-vector-tileserver",
    "source-layer": "laneMarkings",
    paint: {
      "fill-color": colours.laneMarking,
      "fill-opacity": 1,
    },
    filter: ["==", "$type", "Polygon"],
  }, layerToAddAfter);

  ///////////////



};