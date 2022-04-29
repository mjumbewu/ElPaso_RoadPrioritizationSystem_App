const inputRange = document.querySelector('#controls input[type=range]');

inputRange.style.setProperty('--value', (inputRange.value - inputRange.min));

const scorePlaceholder = document.querySelector('#controls .js-score-placeholder');

function applyFilters (e) {
  const maximumScore = parseInt(e.target.value);
  reinitPciData(maximumScore);
}

function registerListeners () {
  inputRange.addEventListener('input', e => {
    inputRange.style.setProperty('--value', (inputRange.value - inputRange.min));
  });

  inputRange.addEventListener('change', e => {
    applyFilters(e)
  });

  map.addEventListener('zoomend', e => {
    pciLayer.resetStyle();
  })
}

const map = L.map('map', {preferCanvas: true}).setView([31.7619, -106.4850], 12);
map.scrollWheelZoom.disable();

L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}.png', {
  maxZoom: 18
}).addTo(map);

// const client = new carto.Client({
//   apiKey: 'default_public', // using default public api key
//   username: 'kchang089'
// });

//https://kchang089.carto.com:443/api/v2/sql?q=select * from public.pci2018_mb

let url = "https://kchang089.carto.com/api/v2/sql?format=GeoJSON&q="; // need to include format=GeoJSON
let sqlQuery = "SELECT pci_2018, the_geom FROM pci2018_mb"


// Calculating Interval Bounds
// ---------------------------
// The `calcQuantileBounds` function will determine the upper-bound value for
// each interval when all the `values` are sorted and split into `numIntervals`
// quantiles.
function calcQuantileBounds(values, numIntervals) {
  const sortedValues = values.slice().sort((a, b) => a - b);
  const intervalSize = sortedValues.length / numIntervals;
  const intervalBounds = [];

  for (let q = 1; q <= numIntervals; ++q) {
    const i = Math.floor(q * intervalSize) - 1;
    intervalBounds.push(sortedValues[i]);
  }
  return intervalBounds;
}

// The `calcUniformIntervalBounds` is a drop-in replacement for the above
// function, except it calculates the upper bounds of uniform intervals
// instead of quantiles. I just implemented it for fun.
function calcUniformIntervalBounds(values, numIntervals) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const intervalSize = (max - min) / numIntervals;
  const intervalBounds = [];

  for (let interval = 1; interval <= numIntervals; ++interval) {
    intervalBounds.push(min + interval * intervalSize);
  }
  return intervalBounds;
}

// Once you have a set of interval bounds (representing quantile or uniform
// interval upper bound values) and a color for each interval, you can get the
// color that should be used for any particular value that falls within the
// range.
function getIntervalColor(intervalBounds, colors, value) {
  for (const [index, intervalBound] of intervalBounds.entries()) {
    if (value <= intervalBound) {
      return colors[index];
    }
  }

  throw new Error('Value appears to be out of bounds. '
    + `Value: ${value}; Bounds: [${intervalBounds}]`);
}


// Styling the Features
// --------------------
// We're going to initialize the interval bounds to an empty list because we
// don't know the range of the data yet. Once we fetch the data we can calculate
// the intervals. We also recalculate the bounds every time we filter the data
// so that the full range of colors is always assigned to the visible data.
let pciBounds = [];

// We do know that we'll have 5 intervals and these will be their colors.
const pciColors = ['#ffc6c4', '#ee919b', '#cc607d', '#9e3963', '#672044'];

// The complete style will also include variation in line weight based on zoom
// level. That's why we reset the styles not just when we filter the data, but
// also when we zoom in or out.
function makePciStyle(f) {
  const weight = Math.min(5, Math.max(1, 0.5 * map.getZoom() - 4));
  const color = getIntervalColor(pciBounds, pciColors, f.properties.pci_2018);
  return { weight, color };
}

let pciData = null;
let pciLayer = L.geoJSON(null, {
  style: makePciStyle
})
  .bindPopup(l => `${l.feature.properties.pci_2018}`)
  .addTo(map);


// Filtering the Data
// ------------------
// Data is currently only filtered using the PCI value range slider.
function filteredPciData(maxPciValue) {
  return {
    type: 'FeatureCollection',
    features: pciData.features.filter(f => f.properties.pci_2018 <= maxPciValue)
  };
}

// Each time the range slider changes we create a new GeoJSON feature collection
// from the original fetched data (`pciData`).
function reinitPciData(maxPciValue) {
  pciLayer.clearLayers();

  const filteredData = filteredPciData(maxPciValue);
  const pciValues = filteredData.features.map(f => f.properties.pci_2018);
  pciBounds = calcQuantileBounds(pciValues, pciColors.length);

  console.log(`PCI Interval Bounds: ${pciBounds}`);
  pciLayer.addData(filteredData);
}

fetch(url + sqlQuery)
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    pciData = data;
    reinitPciData(inputRange.value);
  });

registerListeners();
