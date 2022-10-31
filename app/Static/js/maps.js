// ______________________________________

// @ts-nocheck TODO remove when fixed

let map;
let marker;
let geocoder;
let responseDiv;
let response;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 11.001333668461568, lng: -74.78350982480481 }, // Ubicacion por defecto
    zoom: 10,
    mapTypeControl: false,
  });
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

  // responseDiv = document.createElement("div");
  // responseDiv.id = "response-container";
  // responseDiv.appendChild(response);

  const locationButton = document.createElement("button");

  locationButton.innerHTML = `<i class="bi-geo-alt-fill"></i>`
  locationButton.classList.add("custom-map-control-button");

  map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(inputText);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(submitButton);
  // map.controls[google.maps.ControlPosition.LEFT_TOP].push(responseDiv);

  marker = new google.maps.Marker({
    map,
  });

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
  
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        
        infoWindow.open(map);

        map.setCenter(pos);
        map.setZoom(17);
        marker.setPosition(pos);
        marker.setMap(map);
        
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

function geocode(request) {
  clear();

  geocoder.geocode(request).then(result => {
      
    let zoom;
    const { results } = result;
    
    const { geometry, types, formatted_address} = results[0];

    zoom = (formatted_address.includes('Cl') || formatted_address.includes('Cra') || formatted_address.includes('#')) ? 17 : 10

    map.setZoom(zoom)
    map.setCenter(geometry.location);
    marker.setPosition(geometry.location);
    marker.setMap(map);
    // responseDiv.style.display = "block";
    response.innerText = JSON.stringify(result, null, 2);
    return results;
  }).catch((e) => {
    alert("Geocode was not successful for the following reason: " + e);
  });
}

window.initMap = initMap;
