import { Geometry, GeoJsonProperties, Feature } from 'geojson';

export function isRedRoad(feature: Feature<Geometry, GeoJsonProperties>): boolean {
  const p = feature.properties;
  if (p === null) {
    return false;
  }
  return (p.maxspeed > 40 || (p.highway === 'residential' && p.maxspeed === undefined))
}

export function isOrangeRoad(feature: Feature<Geometry, GeoJsonProperties>): boolean {
  const p = feature.properties;
  if (p === null) {
    return false;
  }

  return (p.maxspeed <= 40 || p.cycleway === 'lane')

}
export function isGreenRoad(feature: Feature<Geometry, GeoJsonProperties>): boolean {
  const p = feature.properties;
  if (p === null) {
    return false;
  }
  return (p.maxspeed <= 30 || p.highway === 'cycleway' || p.highway === 'pedestrian'

    || p.highway === 'living_street'
  )

}