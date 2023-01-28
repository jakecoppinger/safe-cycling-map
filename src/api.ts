import debounce from "debounce";
import { LoadingStatusType, OverpassResponse} from "./interfaces";

import * as http from "https";
import { addStreetLayers, removeStreetLayers } from "./drawing";
import { safeCycleways } from "./overpass-requests";

import osmtogeojson from 'osmtogeojson';

/**
 * Make request to Overpass Turbo.
 * @param overpassQuery Overpass turbo query string
 * @returns 
 */
export async function getOSMData(overpassQuery: string): Promise<OverpassResponse> {
  // overpass.kumi.systems
    // hostname: "overpass-api.de",
  const options = {
    hostname: "overpass.kumi.systems",
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

  let safeRoutes: OverpassResponse;

  const overpassBounds = [southernLat, westLong, northLat, eastLong];
  const boundsStr = overpassBounds.join(",");
  const safeRoutesOverpassQuery = safeCycleways(boundsStr);;

  console.log("Started POST request...");
  try {
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
  
  setLoadingStatus("success");
}
