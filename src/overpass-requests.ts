/** where boundsStr is in the format of `lat,lon,lat,lon` */
export const bicycleParking = (boundsStr: string) => `
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
`

/** where boundsStr is in the format of `lat,lon,lat,lon` */
export const safeCycleways = (boundsStr: string) => `
[out:json][timeout:60][bbox:${boundsStr}]; 

/* Select road types to display */ 

( 
  way[highway]["highway"!~"cycleway|path|footway|pedestrian"]["bicycle"!~"no"];
  way["highway"="residential"];
  
  way[highway=cycleway];
  way["highway"~"cycleway|path|footway|pedestrian"]["bicycle"~"yes|designated"];
  way[highway=proposed][proposed=cycleway];
  way[highway=construction][construction=cycleway];
  way[proposed=cycleway];
  way[cycleway=lane];
  way["cycleway:left"=track];
  way[cycleway=track];

);

// print results 
out body; 
>; 
out skel qt; 
`