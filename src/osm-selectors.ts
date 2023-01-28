import { FeatureCollection, Geometry, GeoJsonProperties, Feature, GeometryObject } from 'geojson';

export function isRedRoad(feature: Feature<Geometry, GeoJsonProperties>) {
  return feature.properties &&
    (feature.properties.maxspeed > 40 || (feature.properties.highway === 'residential' && feature.properties.maxspeed === undefined))
}

export function isOrangeRoad(feature: Feature<Geometry, GeoJsonProperties>) {
  return feature.properties &&
    (feature.properties.maxspeed <= 40 || feature.properties.cycleway === 'lane')

}
export function isGreenRoad(feature: Feature<Geometry, GeoJsonProperties>) {
  return feature.properties &&
    (feature.properties.maxspeed <= 30 || feature.properties.highway === 'cycleway' || feature.properties.highway === 'pedestrian'

      || feature.properties.highway === 'living_street'
    )

}