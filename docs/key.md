Safe Cycling Map
================
Zoom in to see individual lanes, zoom out a little to see street safety.

Warning: This is an arbitrary rating system. Data is open source and not guaranteed to be accurate.

This map uses OpenStreetMap data. It is not a complete or accurate map of the world and should not
be used in such a manner that deficiencies, omissions, inaccuracies or errors could result in death,
loss or injury. The maps are an iterative ongoing work-in-progress and everyone is welcome to
contribute editing the OpenStreetMap data if you spot inaccuracies. (warning courtesy of [CyclOSM](https://www.cyclosm.org/))

See the README at https://github.com/jakecoppinger/safe-cycling-map for how to fix the data (or
propose improvments to the safety rating system).

# Key
## Safe streets - green
The street satisfies any of the below conditions:
- The speed is less than or equal to 30kph
- It's a [living street](https://wiki.openstreetmap.org/wiki/Tag:highway%3Dliving_street)
- Is has a separated cycleway
- It has a cycle lane separated from the road
- Is has a shared path (bikes + pedestrians allowed)

## More dangerous streets
The street satisfies any of the below conditions:
- It has a speed limit less than 40kph and greater than 30kmh
- It has an on road, painted (non-separated) bike lane

## Dangerous streets
The street satisfies any of the below conditions:
- It has a speed higher than 40kmh
- It is a residental street with the default speed limit (assumed to be 50kph)

## TODO: Banned streets
Currently banned streets (eg. motorways/Sydney Harbour Bridge) are currently displayed as red.

# Technical details

These safety ratings are calculated in
https://github.com/jakecoppinger/safe-cycling-map/blob/main/src/osm-selectors.ts

PRs are very welcome!