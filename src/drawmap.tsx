import mapboxgl from "mapbox-gl";
import * as http from "https";

// southern-most latitude, western-most longitude, northern-most latitude, eastern-most longitude.
export async function getOSMData(bounds: number[]): Promise<any> {
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

export function drawmap(map: mapboxgl.Map): void {
  map.addControl(new mapboxgl.NavigationControl());
  map.addControl(new mapboxgl.FullscreenControl());
  // Add geolocate control to the map.
  map.addControl(
    new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
    })
  );

  map.on("moveend", function (originalEvent) {
    const { lat, lng } = map.getCenter();
    console.log("A moveend event occurred.");
    console.log({ lat, lng });

    // eg https://localhost:3000
    const location = window.location.origin;
    console.log({ location });
  });
}
export function removeMarkers(markers: mapboxgl.Marker[]): void {
  markers.map((marker) => marker.remove());
}
