import debounce from "debounce";
import { OverpassResponse, RawOverpassNode } from "./interfaces";

import * as http from "https";
import { addStreetLayers, drawMarkersAndCards, removeMarkers, removeStreetLayers } from "./drawing";
import { wayToNode } from "./geo-utils";
import { bicycleParking, safeCycleways } from "./overpass-requests";

import osmtogeojson from 'osmtogeojson';

/**
 * Make request to Overpass Turbo.
 * @param overpassQuery Overpass turbo query string
 * @returns 
 */
export async function getOSMData(overpassQuery: string): Promise<OverpassResponse> {
  const options = {
    hostname: "overpass-api.de",
    port: 443,
    path: "/api/interpreter",
    method: "POST",
    headers: {
      // "Content-Type": "application/json",
      'Content-Type': 'application/x-www-form-urlencoded'
    },
  };

  return new Promise((resolve, reject) => {
    var req = http.request(options, function (res) {
      var body = "";
      res.setEncoding("utf8");
      res.on("data", (chunk) => (body += chunk));
      res.on("end", function () {
        if (res.statusCode !== 200) {
          console.log("error code", res.statusCode);
          reject(res.statusCode);
        }

        const jsonResponse = JSON.parse(body);
        resolve(jsonResponse);
      });
    });
    req.on("error", function (e) {
      reject(e.message);
    });
    req.write(new URLSearchParams({
      'data': overpassQuery,
    }).toString());
    req.end();
  });
}

export const debouncedFetchAndDrawMarkers = debounce(fetchAndDrawMarkers, 2000);

async function fetchAndDrawMarkers(
  map: mapboxgl.Map,
  markers: React.MutableRefObject<mapboxgl.Marker[]>,
  setLoadingStatus: React.Dispatch<React.SetStateAction<LoadingStatusType>>
) {
  setLoadingStatus("loading");
  const bounds = map.getBounds();
  const southernLat = bounds.getSouth();
  const westLong = bounds.getWest();
  const northLat = bounds.getNorth();
  const eastLong = bounds.getEast();

  let ads: OverpassResponse;
  let safeRoutes: OverpassResponse;

  const overpassBounds = [southernLat, westLong, northLat, eastLong];
  const boundsStr = overpassBounds.join(",");
  const parkingOverpassQuery = bicycleParking(boundsStr);;
  const safeRoutesOverpassQuery = safeCycleways(boundsStr);;

  console.log("Started POST request...");
  try {
    ads = (await getOSMData(parkingOverpassQuery));
    safeRoutes = await getOSMData(safeRoutesOverpassQuery);
  } catch (e) {
    console.log("Error:", e);
    setLoadingStatus("unknownerror");
    return;
  }

  const geoJson = osmtogeojson(safeRoutes, {})
  console.log(geoJson);
  console.log("Adding geojson to map...");

  removeStreetLayers(map);
  addStreetLayers(map, geoJson);
  

  return;
  // removeMarkers(markers.current);

  // const nodesAndWayCenters: RawOverpassNode[] = ads.elements
  //   .map((item) => (item.type === "way" ? wayToNode(item, ads.elements) : item))
  //   .filter((item) => item !== null)
  //   .map((item) => item as RawOverpassNode)
  //   .filter((item) => item.tags !== undefined);

  // markers.current = await drawMarkersAndCards(map, nodesAndWayCenters);
  // setLoadingStatus("success");
}

type LoadingStatusType = "loading" | "success" | "429error" | "unknownerror";