Safe Cycling Map
================

A map showing how safe a street is for cycling, based on (arbitrary) metrics. See the
[key](https://github.com/jakecoppinger/safe-cycling-map/blob/main/key.md) for how street safety is calculated.

This is a work in progress side project. This data is not guaranteed to be accurate.

When zoomed in close, individual road and bicycle lanes are shown. When zoomed out, streets are
coloured by their safety ratings.

# Disclaimer
Warning: This is an arbitrary rating system. Data is not guaranteed to be accurate.

This map uses OpenStreetMap data. It is not a complete or accurate map of the world and should not
be used in such a manner that deficiencies, omissions, inaccuracies or errors could result in death,
loss or injury. The maps are an iterative ongoing work-in-progress and everyone is welcome to
contribute editing the OpenStreetMap data if you spot inaccuracies. (warning courtesy of [CyclOSM](https://www.cyclosm.org/))

# Contributing: Found a mislabelled street? You can fix it!

Head to https://bikemaps.org/blog/post/improving-bicycling-data-on-openstreetmap for instructions
on how to fix OpenStreetMap data.

![Screenshot of map](img/safe-cycling-map-2022-01-05-v2.jpg)

A map of bike infrastructure using [osm2streets](https://github.com/a-b-street/osm2streets) output.

Uses [osm2streets-vector-tileserver](https://github.com/jakecoppinger/osm2streets-vector-tileserver),
a vector tileserver I wrote to generate Protobuf GeoJSON vector tiles using the JS bindings to
osm2streets (which is written in Rust).


# Local development

See instructions for setting up the backend tileserve at 
[https://github.com/jakecoppinger/osm2streets-vector-tileserver](https://github.com/jakecoppinger/osm2streets-vector-tileserver)

Install packages:
`nvm install`
`npm i --legacy-peer-deps`

Run dev server:
`npm run start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It bundles React in production mode and optimizes the build for the best performance.

# License
GNU GPL v3