import debounce from "debounce";
import { OverpassResponse, RawOverpassNode } from "./interfaces";

import * as http from "https";
import { drawMarkersAndCards, removeMarkers } from "./drawing";
import { wayToNode } from "./geo-utils";
// southern-most latitude, western-most longitude, northern-most latitude, eastern-most longitude.
export async function getOSMData(bounds: number[]): Promise<OverpassResponse> {
  const options = {
    hostname: "overpass-api.de",
    port: 443,
    path: "/api/interpreter",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  };
  console.log("Started POST request...");
  const boundsStr = bounds.join(",");
  const request_str = `
    [out:json][timeout:25];
    (
      // query part for: “bicycle_parking=*”
      node["bicycle_parking"](${boundsStr});
      way["bicycle_parking"](${boundsStr});
      relation["bicycle_parking"](${boundsStr});
      // query part for: “amenity=bicycle_parking”
      node["amenity"="bicycle_parking"](${boundsStr});
      way["amenity"="bicycle_parking"](${boundsStr});
      relation["amenity"="bicycle_parking"](${boundsStr});
    );
    out body;
    >;
    out skel qt;
    `;
  console.log("request:", request_str);

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
    req.write(request_str);
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
  const overpassBounds = [southernLat, westLong, northLat, eastLong];
  console.log("getting ads");

  let ads: OverpassResponse;
  try {
    ads = await getOSMData(overpassBounds);
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