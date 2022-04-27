
mapboxgl.accessToken = 'pk.eyJ1IjoiamVubmFlcHN0ZWluIiwiYSI6ImNsMmdyc3Z5dzA2ejAzanNiM2kyOXIybjIifQ.3RHeQ3NfuMvjr_CHVV88yg';

const map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/mapbox/light-v10',
center: [ -106.4850,31.7619], 
zoom: 12
});
 
 
function filterBy(score) {
const filters = ['==', 'score', score];
map.setFilter('score-circles', filters);
 
// Set the label to the score
document.getElementById('pci_2018').textContent = score;
}
 
map.on('load', () => {
  map.addSource("PCI2018_mb", {
          "type": "geojson",
          "data": "PCI2018_mb.geojson"
  });
 
map.addLayer({
  'id': 'PCI2018_mb',
  'type': 'line',
  'source': 'PCI2018_mb',
  'layout': {
  'line-join': 'round',
  'line-cap': 'round'
  },
  'paint': {
  'line-color': '#888',
  'line-width': 8
  }
  });

 

  document.getElementById('slider').addEventListener('input', (e) => {
    const score = parseInt(e.target.value, 10);
    filterBy(score);
    });

  })