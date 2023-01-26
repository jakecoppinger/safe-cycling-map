import debounce from "debounce";
import { OverpassResponse, RawOverpassNode } from "./interfaces";

import * as http from "https";
import { drawMarkersAndCards, removeMarkers } from "./drawing";
import { wayToNode } from "./geo-utils";
import { bicycleParking } from "./overpass-requests";

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
      "Content-Type": "application/json",
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
        const bars = jsonResponse.elements;
        resolve(bars);
      });
    });
    req.on("error", function (e) {
      reject(e.message);
    });
    req.write(overpassQuery);
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

  const overpassBounds = [southernLat, westLong, northLat, eastLong];
  const boundsStr = overpassBounds.join(",");
  const overpassQuery = bicycleParking(boundsStr);;

  console.log("Started POST request...");
  try {
    ads = await getOSMData(overpassQuery);
  } catch (e) {
    console.log("Error:", e);
    setLoadingStatus("unknownerror");
    return;
  }

  removeMarkers(markers.current);

  const nodesAndWayCenters: RawOverpassNode[] = ads
    .map((item) => (item.type === "way" ? wayToNode(item, ads) : item))
    .filter((item) => item !== null)
    .map((item) => item as RawOverpassNode)
    .filter((item) => item.tags !== undefined);

  markers.current = await drawMarkersAndCards(map, nodesAndWayCenters);
  setLoadingStatus("success");
}

type LoadingStatusType = "loading" | "success" | "429error" | "unknownerror";