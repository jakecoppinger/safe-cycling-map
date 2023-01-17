import React, { useEffect, useState } from "react";
import maplibregl from "maplibre-gl";
import "./App.css";
import { mapOnLoad } from "./layers";

export function Map() {
  const mapContainer = React.useRef<HTMLDivElement>(null);
  const mapRef = React.useRef<maplibregl.Map | null>(null);

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

    mapRef.current = new maplibregl.Map({
      container: mapContainer.current,
      center: [lng, lat],
      zoom: zoom,
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

    // TO FIX
    // map.addControl(new maplibregl.NavigationControl());
    // map.addControl(new maplibregl.FullscreenControl());
    map.addControl(
      new maplibregl.GeolocateControl({
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
