import React, { useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "./App.css";
import { mapOnLoad } from "./layers";

// @ts-ignore
import MapboxDirections from "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions";
import "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css";

import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import { debouncedFetchAndDrawMarkers } from "./api";
import { LoadingStatusType } from "./interfaces";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoiamFrZWMiLCJhIjoiY2tkaHplNGhjMDAyMDJybW4ybmRqbTBmMyJ9.AR_fnEuka8-cFb4Snp3upw";

const min_overpass_turbo_zoom = 15;
/** Also the min zoom of the vector tileserver */
// const max_overpass_turbo_zoom = 15;

mapboxgl.accessToken = MAPBOX_TOKEN;
export function Map() {
  const mapContainer = React.useRef<HTMLDivElement>(null);
  const mapRef = React.useRef<mapboxgl.Map | null>(null);
  const markers = React.useRef<mapboxgl.Marker[]>([]);
  const [loadingStatus, setLoadingStatus] =
    useState<LoadingStatusType>("ready_to_load");

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
      style: "mapbox://styles/mapbox/dark-v11",
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
      if (zoom < min_overpass_turbo_zoom) {
        setLoadingStatus("too_zoomed_out");
      } else {
        setLoadingStatus('ready_to_load');
      }
      console.log(lng, lat, zoom);

      setLng(map.getCenter().lng);
      setLat(map.getCenter().lat);
      setZoom(map.getZoom());
    });

    if (zoom < min_overpass_turbo_zoom) {
      setLoadingStatus("too_zoomed_out");
    } else {
      debouncedFetchAndDrawMarkers(map, markers, setLoadingStatus);
    }

    map.on("moveend", async () => {
      if (map === null) {
        return;
      }
      const zoom = map.getZoom();
      if (zoom > min_overpass_turbo_zoom) {
        debouncedFetchAndDrawMarkers(map, markers, setLoadingStatus);
      }
    });
  });
  const statusMessages = {
    loading: "Loading from OpenStreetMap...",
    success: "Done loading",
    ready_to_load: "About to load...",
    too_zoomed_out: "Zoom in to see street safety",
    unknownerror: "Error loading. Please wait a bit",
    "429error": "Too many requests, please try in a bit",
  };

  const statusText = statusMessages[loadingStatus];
  return (
    <div>
      <div className="sidebar">
        <label>
          {" "}
          {statusText}<br></br> A work in progress side project by{" "}
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
