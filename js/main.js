let map = L.map('map').setView([31.7619, -106.4850], 12);

L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
  subdomains: 'abcd',
  minZoom: 0,
  maxZoom: 20,
  ext: 'png',
}).addTo(map);


//https://kchang089.carto.com:443/api/v2/sql?q=select * from public.pci2018

// Set URL
//let url = "https://kchang089.carto.com/api/v2/sql?format=GeoJSON&q=";

// Set SQL query for PCI
//let sqlQuery = "SELECT pci_2018, the_geom FROM pci2018";
  
// Set SQL query for equity layer
//let sqlQuery = "SELECT total_equity, the_geom FROM equitylayer"


// load GeoJSON from Carto database using fetch

/*
fetch(url + sqlQuery)
.then(function(response) {
  return response.json();
})
.then(function(data) {
  L.geoJSON(data, {
    onEachFeature: function(feature, layer) {
      layer.bindPopup(feature.properties.pci_2018); //total_equity for equity layer
    }
  }).addTo(map);
});

*/

//jquery test
//fetch(url + sqlQuery)
 //   .then(function(response) {
 //       return response.json();
 //   })
  //  .then(function(data) {
  //      L.geoJSON(data, {
  //          onEachFeature: function(feature, layer) {
   //             layer.bindPopup(feature.properties.pci2018);
  //          }
  //      }).addTo(map);
  //  }); 

  /*
  dataset = fetch('data/equitylayer.geojson')
  .then(resp => resp.json())
  .then(data => {
      dataset=L.geoJSON(data, {
        onEachFeature: function(feature, layer) {
          layer.bindPopup(feature.properties.pci_2018); //total_equity for equity layer
        }
  });
*/

//Attempting to fetch locally
$.getJSON("data/EPCenterline_2016to2018.geojson", function(data) {
  L.geoJSON(data).addTo(map);
});