import React, { useRef, useEffect, useState } from "react";
// @ts-ignore
// eslint-disable-next-line
// import mapboxgl from "!mapbox-gl";
import mapboxgl from "mapbox-gl";
import "./App.css";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoiamFrZWMiLCJhIjoiY2tkaHplNGhjMDAyMDJybW4ybmRqbTBmMyJ9.AR_fnEuka8-cFb4Snp3upw";

mapboxgl.accessToken = MAPBOX_TOKEN;

const colours = {
  road: "grey",
  cycleway: "green",
  laneMarking: "white",
};

type LoadingStatusType = "loading" | "success" | "429error" | "unknownerror";
export function Map() {
  const mapContainer = React.useRef<HTMLDivElement>(null);
  const mapRef = React.useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [lng, setLng] = useState(151.20671);
  const [lat, setLat] = useState(-33.8683861);
  const [zoom, setZoom] = useState(16);

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
      style: "mapbox://styles/mapbox/dark-v10",
      center: [lng, lat],
      zoom: zoom,
    });
    const map = mapRef.current;
    map.on("load", function () {
      console.log(
        "Adding sources. If you don't seen anything check vector server logs."
      );

      // https://docs.mapbox.com/mapbox-gl-js/example/multiple-geometries/
      // Add a new vector tile source with ID 'mapillary'.
      map.addSource("osm2streets-vector-tileserver", {
        type: "vector",
        tiles: ["http://localhost:3000/tile/{z}/{x}/{y}"],
        minzoom: 15,
        maxzoom: 22,
      });

      map.addLayer({
        id: "geometry",
        type: "fill",

        source: "osm2streets-vector-tileserver",
        "source-layer": "geometry",
        paint: {
          // To improve!
          "fill-color": colours.road,
          "fill-opacity": 0.4,
        },
        filter: ["==", "$type", "Polygon"],
      });

      map.addLayer({
        id: "lanePolygons",
        type: "fill",

        source: "osm2streets-vector-tileserver",
        "source-layer": "lanePolygons",
        paint: {
          "fill-color": colours.road,
          "fill-opacity": 1,
        },
        filter: ["==", "$type", "Polygon"],
      });
      map.addLayer({
        id: "bikePath",
        type: "fill",

        source: "osm2streets-vector-tileserver",
        "source-layer": "lanePolygons",
        paint: {
          "fill-color": colours.cycleway,
          "fill-opacity": 1,
        },
        filter: ["==", "type", "Biking"],
        // filter: ["==", "$type", "Polygon"],
      });

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
      });
      map.addLayer({
        id: "intersectionMarkings",
        type: "fill",

        source: "osm2streets-vector-tileserver",
        "source-layer": "intersectionMarkings",
        paint: {
          "fill-color": colours.road,
          "fill-opacity": 0.8,
        },
        filter: ["==", "$type", "Polygon"],
      });
    });

    map.addControl(new mapboxgl.NavigationControl());
    map.addControl(new mapboxgl.FullscreenControl());
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

      setLng(map.getCenter().lng);
      setLat(map.getCenter().lat);
      setZoom(map.getZoom());
    });
  });


  return (
    <div>
      <div className="sidebar">
        <label>
          A side-project by{" "}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://jakecoppinger.com/"
          >
            Jake Coppinger
          </a>{" "}
          | Open source (GPLv3) on{" "}
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
