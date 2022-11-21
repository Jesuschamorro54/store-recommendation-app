// ______________________________________

// @ts-nocheck TODO remove when fixed

let map;
let marker;
let geocoder;
let responseDiv;
let response;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 11.001333668461568, lng: -74.78350982480481 }, // Ubicacion por defecto barranquilla
    zoom: 10,
    mapTypeControl: false,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });

  marker = new google.maps.Marker({
    map,
  });

  marker.setPosition({ lat: 12, lng: -74.78350982480481 });
  marker.setMap(map);
  geocoder = new google.maps.Geocoder();

  const inputText = document.createElement("input");

  inputText.type = "text";
  inputText.placeholder = "Enter a location";

  const submitButton = document.createElement("input");

  submitButton.type = "button";
  submitButton.value = "Buscar";
  submitButton.classList.add("button", "button-primary");

  response = document.createElement("pre");
  response.id = "response";
  response.innerText = "";


  const locationButton = document.createElement("button");

  locationButton.innerHTML = `<i class="bi-geo-alt-fill"></i>`
  locationButton.classList.add("custom-map-control-button");

  map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(inputText);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(submitButton);

  map.addListener("click", (e) => {
    geocode({ location: e.latLng });
  });

  submitButton.addEventListener("click", () =>
    geocode({ address: inputText.value })
  );

  locationButton.addEventListener("click", () => 
    currentLocation()
  );
}

function currentLocation() {

  let infoWindow = new google.maps.InfoWindow();
  const element = document.getElementById("map")
  element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        
        formattedAddress(pos.lat, pos.lng)

        infoWindow.open(map);
        
        map.setCenter(pos);
        map.setZoom(17);
        marker.setPosition(pos);
        marker.setMap(map);
        getStoresNearby(pos);
        
      },
      () => {
        handleLocationError(true, infoWindow, map.getCenter());
      }
    );
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }
}

function clear() {
  marker.setMap(null);
  // responseDiv.style.display = "none";
}

var userLocation = "";
function geocode(request) {
  clear();

  geocoder.geocode(request).then(result => {
      
    let zoom;
    const { results } = result;
    
    const { geometry, types, formatted_address} = results[0];

    console.log(results)
    userLocation = formatted_address;

    zoom = (formatted_address.includes('Cl') || formatted_address.includes('Cra') || formatted_address.includes('#')) ? 17 : 10

    map.setZoom(zoom)
    map.setCenter(geometry.location);
    marker.setPosition(geometry.location);
    marker.setMap(map);
    response.innerText = JSON.stringify(result, null, 2);

    let latlng = geometry.location.toString().replace(/\(|\)/g, '').split(', ')
    let pos = {lat: parseFloat(latlng[0]), lng: parseFloat(latlng[1]) }
    
    getStoresNearby(pos);

    return results;
  }).catch((e) => {
    alert("Geocode was not successful for the following reason: " + e);
  });
}

function formattedAddress(lat, lng){
  var latlng = new google.maps.LatLng(lat, lng);

  geocoder.geocode({'latLng': latlng}, function(results, status) {
    if(status == google.maps.GeocoderStatus.OK) {
      if (results[1]) {
        userLocation = results[1].formatted_address;
      }
    }
  });
}

// Check if it is into the radius
function arePointsNear(checkPoint, centerPoint, radio) {

  // console.log("\ncenter: ", centerPoint)
  // console.log("chek: : ", checkPoint)

  var my = 4000 / 360;
  var mx = Math.cos(Math.PI * centerPoint.lat / 180.0) * my;

  var dx = Math.abs(centerPoint.lng - checkPoint.lng) * mx; // cateto x
  var dy = Math.abs(centerPoint.lat - checkPoint.lat) * my; // cateto y
  
  // Formula de pitagoras
  // Para que el numero me de en metros se multiplica por 1000
  var result = Math.sqrt((dx * dx) + (dy * dy)) * 1000; 
  
  // console.log("Point Near: ", result, " ->",  result <= radio)
  return result <= radio
}

window.initMap = initMap;
