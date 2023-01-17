import React, { useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "./App.css";
import { mapOnLoad } from "./layers";

// @ts-ignore
import MapboxDirections from "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions";
import "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css";

import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoiamFrZWMiLCJhIjoiY2tkaHplNGhjMDAyMDJybW4ybmRqbTBmMyJ9.AR_fnEuka8-cFb4Snp3upw";

mapboxgl.accessToken = MAPBOX_TOKEN;
export function Map() {
  const mapContainer = React.useRef<HTMLDivElement>(null);
  const mapRef = React.useRef<mapboxgl.Map | null>(null);

  const [lng, setLng] = useState(151.2160755932166);
  const [lat, setLat] = useState(-33.88056647217827);
  const [zoom, setZoom] = useState(17.504322191852786);

  useEffect(() => {
    // This is called on every pan
    if (mapContainer.current === null) {
      return;
    }
    if (mapRef.current !== null) {
      return;
    }

    mapRef.current = new mapboxgl.Map({
      container: mapContainer.current,
      center: [lng, lat],
      zoom: zoom,
      hash: true,
      style: {
        version: 8,
        sources: {
          "raster-tiles": {
            type: "raster",
            tiles: [
              "https://a.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png",
            ],
            tileSize: 256,
            attribution:
              '© <a target="_blank" href="https://www.cyclosm.org">CyclOSM</a>, <a target="_blank" href="https://github.com/a-b-street/osm2streets">osm2streets</a>, <a target="_blank" href="https://openstreetmap.org/">OpenStreetMap contributors</a>',
          },
        },
        layers: [
          {
            id: "simple-tiles",
            type: "raster",
            source: "raster-tiles",
            minzoom: 0,
            maxzoom: 22,
          },
        ],
      },
    });

    const map = mapRef.current;
    map.on("load", mapOnLoad(map));

    map.addControl(new mapboxgl.NavigationControl());
    map.addControl(new mapboxgl.FullscreenControl());
    map.addControl(
      new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl,
      }),
      "top-left"
    );
    map.addControl(
      new MapboxDirections({
        accessToken: mapboxgl.accessToken,
      }),
      "top-left"
    );
    map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
      })
    );

    map.on("move", () => {
      if (!map) {
        return; // wait for map to initialize
      }
      const { lng, lat } = map.getCenter();
      const zoom = map.getZoom();
      console.log(lng, lat, zoom);

      setLng(map.getCenter().lng);
      setLat(map.getCenter().lat);
      setZoom(map.getZoom());
    });
  });

  return (
    <div>
      <div className="sidebar">
        <label>
          A work in progress side project by{" "}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://jakecoppinger.com/"
          >
            Jake Coppinger
          </a>{" "}
          | Open source on{" "}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/jakecoppinger/safe-cycling-map"
          >
            Github
          </a>
        </label>
      </div>
      <div ref={mapContainer} className="map-container" />
    </div>
  );
}
