const inputRange = document.querySelector('#controls input[type=range]');

inputRange.style.setProperty('--value', (inputRange.value - inputRange.min));

const scorePlaceholder = document.querySelector('#controls .js-score-placeholder');

function applyFilters (e) {
  const maximumScore = parseInt(e.target.value);

  scoreFilter.setFilters({ lte: maximumScore });
  //scorePlaceholder.innerText = maximumScore ; // throwing an error
}

function registerListeners () {
  inputRange.addEventListener('input', e => {
    inputRange.style.setProperty('--value', (inputRange.value - inputRange.min));
  });

  inputRange.addEventListener('change', e => {
    applyFilters(e)
  });
}

const map = L.map('map').setView([31.7619, -106.4850], 12);
map.scrollWheelZoom.disable();

L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}.png', {
  maxZoom: 18
}).addTo(map);

const client = new carto.Client({
  apiKey: 'default_public', // using default public api key
  username: 'kchang089'
});

//https://kchang089.carto.com:443/api/v2/sql?q=select * from public.pci2018_mb

let url = "https://kchang089.carto.com/api/v2/sql?format=GeoJSON&q="; // need to include format=GeoJSON
let sqlQuery = "SELECT pci_2018, the_geom FROM pci2018_mb"

let source =
fetch(url + sqlQuery)
    .then(function(response) {
        return response.json();
    })
    .then((data) => {
        L.geoJSON(data, {
          onEachFeature: (feature, layer) => {
            layer.bindPopup(feature.properties.pci_2018);
          }
        })
          .addTo(map); // if i disable this, data won't load at all...
      }); 

//const source = new carto.source.SQL(url + sqlQuery); // if i enable this, data won't load at all

const scoreFilter = new carto.filter.Range('pci_2018'); // filter not working
source.addFilter(scoreFilter);


const style = new carto.style.CartoCSS(`
  #layer {
    line-width: 7;
    line-fill: ramp([score], (#ffc6c4, #ee919b, #cc607d, #9e3963, #672044), quantiles);
  }`);

const layer = new carto.layer.Layer(source, style);

client.addLayer(layer);
client.getLeafletLayer().addTo(map);

registerListeners();

