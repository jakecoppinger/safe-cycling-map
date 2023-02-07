import { Geometry, GeoJsonProperties, Feature } from 'geojson';

/**
 * Is a red (dangerous) road if:
 * - Speed is higher than 40kmh
 * - Road is a residental street with default speed limit (50kph)
 * @param feature 
 * @returns 
 */
export function isRedRoad(feature: Feature<Geometry, GeoJsonProperties>): boolean {
  const p = feature.properties;
  if (p === null) {
    return false;
  }
  if(p.highway === 'primary' && p.maxspeed === undefined) {
    return true;
  }
  if (p.maxspeed > 40) {
    return true;
  }
  if (p.highway === 'residential' && p.maxspeed === undefined) {
    return true;
  }
  return false;
}

/**
 * Is an orange (caution) road if:
 * - Road has a speed limit less than 40kph and greater than 30kmh
 * - Has an on road, painted (non-separated) bike lane
 * @param feature 
 * @returns 
 */
export function isOrangeRoad(feature: Feature<Geometry, GeoJsonProperties>): boolean {
  const p = feature.properties;
  if (p === null) {
    return false;
  }

  if (p.maxspeed <= 40) {
    return true;
  }
  if (p.cycleway === 'lane') {
    return true;
  }
  return false;
}


/**
 * Is a green (safe) road if:
 * - Speed is less than or equal to 30kph
 * - Is a [living street](https://wiki.openstreetmap.org/wiki/Tag:highway%3Dliving_street)
 * - Is a separated cycleway
 * - Is a cycle lane separated from the road
 * - Is a shared path (bikes + pedestrians allowed)
 * @param feature 
 * @returns 
 */
export function isGreenRoad(feature: Feature<Geometry, GeoJsonProperties>): boolean {
  const p = feature.properties;
  if (p === null) {
    return false;
  }
  if (p.maxspeed <= 30) {
    return true;
  }
  if (p.highway === 'cycleway') {
    return true;
  }
  if (p.highway === 'shared_lane') {
    return true;
  }
  if (p.bicycle === 'designated' && p.highway === 'path') {
    return true;
  }
  if (p.highway === 'living_street') {
    return true;
  }
  if (p.cycleway === 'track' || p['cycleway:left'] === 'track' || p['cycleway:right'] === 'track') {
    return true;
  }
  return false
}
