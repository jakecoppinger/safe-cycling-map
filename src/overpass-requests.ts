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
  way[highway]["highway"!~"cycleway|path|footway|pedestrian"]["bicycle"!~"no"][maxspeed](if:t["maxspeed"]<=50);
  
  way[highway=cycleway];
  way["highway"~"cycleway|path|footway|pedestrian"]["bicycle"~"yes|designated"];
  way[highway=proposed][proposed=cycleway];
  way[highway=construction][construction=cycleway];
  way[proposed=cycleway];
  

);

// print results 
out body; 
>; 
out skel qt; 


{{style: 

way[maxspeed=80] {
  color: red;
  width:4;
  opacity:1.0
}
way[maxspeed=70] {
  color: red;
  width:4;
  opacity:1.0
}
way[maxspeed=60] {
  color: red;
  width:4;
  opacity:1.0
}

way[maxspeed=50] {
  color: red;
  width:4;
  opacity:1.0
}
way[maxspeed=40] {
  color: orange;
  width:3;
  opacity:1.0
}
way[maxspeed=30] {
  color: green;
  width:5;
  opacity:1.0
}
way[maxspeed=20] {
  color: green;
  width:6;
  opacity:1.0
}
way[maxspeed=10] {
  color: green;
  width:7;
  opacity:1.0
}


/*
#4f9267
#34c467
#15b74e
#2c9551
*/
way[highway=cycleway] {
  color: #2c9551;
  width:10;
  opacity:1.0
}

/*
#3b7ec7
#489fff
*/
way[highway=footway],
way[highway=pedestrian],
way[foot=designated][segregated!=yes],
way[foot=yes][segregated!=yes] {
  color: green;
  width:10;
  opacity: 1.0;
  /*dashes: 5,5;*/
} 

way[highway=proposed],
way[highway=construction] {
  dashes: 5;
  width:2;
}

way[highway=proposed] {
  color: salmon;
}

way[highway=construction] {
  color: purple;
}

way[cycleway=proposed] {
  color: red;
}



}}
`