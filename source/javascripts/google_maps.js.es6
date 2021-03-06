const initMap = () => {
  const mapElement = document.getElementById('map');
  const balticCoords = {
    lat: 40.680726,
    lng: -73.981267
  };
  const mapOpts = {
    center: balticCoords,
    mapTypeControl: false,
    zoom: 15
  }
  const map = new google.maps.Map(mapElement, mapOpts);
  window.map = map
  getLocation(map);
}

function getLocation(map) {
  navigator.geolocation.getCurrentPosition((location) => {
    recenterMap(location, map)
  });
}

function recenterMap(location, map) {
  const lat = location.coords.latitude;
  const lng = location.coords.longitude;
  map.setCenter(new google.maps.LatLng(lat, lng));
}