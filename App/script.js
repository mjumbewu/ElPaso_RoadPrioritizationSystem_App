
mapboxgl.accessToken = 'pk.eyJ1IjoiamVubmFlcHN0ZWluIiwiYSI6ImNsMmdyc3Z5dzA2ejAzanNiM2kyOXIybjIifQ.3RHeQ3NfuMvjr_CHVV88yg';

const map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/mapbox/light-v10',
center: [ -106.4850,31.7619], 
zoom: 12
});
 
 
function filterBy(PCI_2018) {
const filters = ['==', 'PCI_2018', PCI_2018];
map.setFilter('PCI2018_mb', filters);
 

}
 
map.on('load', () => {

  // When the map loads, add the data for hexbins
  map.addSource('allHex_mb', {
    'type': 'geojson',
    'data': 'https://raw.githubusercontent.com/jennaepstein/ElPaso_RoadPrioritizationSystem_App/main/App/allHex_mb.geojson',
    'generateId': true
  });



  // When the map loads, add the data for the road segements and pci
  map.addSource('PCI2018_mb', {
    'type': 'geojson',
    'data': 'https://raw.githubusercontent.com/jennaepstein/ElPaso_RoadPrioritizationSystem_App/main/App/PCI2018_mb.geojson',
    'generateId': true // This ensures that all features have unique IDs
  });



   
// Add a new layer to visualize the hexbins.
map.addLayer({
  'id': 'equity',
  'type': 'fill',
  'source': 'allHex_mb',
  'paint': {
  // Color bins by total_equity, using a `match` expression.
  'fill-color': [
  'match',
  ['get', 'total_equity'],
  'Very Low Need',
  '#4A7BB7',
  'Low Need',
  '#98CAE1',
  'Moderate Need',
  '#EAECCC',
  'High Need',
  '#FDB366',
  'Highest Need',
  '#A50026',
  /* other */ '#ccc'
  ],
  'fill-opacity': 0.5,
  }
  });

 
map.addLayer({
  'id': 'PCI2018_mb',
  'type': 'line',
  'source': 'PCI2018_mb',
  'paint': {
    'line-width': 4,
    'line-color': '#585858'
  },
  'layout': {
  'line-join': 'round',
  'line-cap': 'round'
  }
});

  document.getElementById('slider').addEventListener('input', (e) => {
    const PCI_2018 = parseInt(e.target.value, 10);
    filterBy(PCI_2018);
    });



  })