
const urlApi = "http://127.0.0.1:5000/"
const http = {
    get: async function (url) {

        const response = await fetch(urlApi + url);
        return response.json();
    },

    post: async function (url, data) {

        var getHeader = {
            method: "POST", 
            cache: "no-cache",
            credentials: "same-origin",
            headers: {"Content-Type": "application/json"},
            redirect: "follow",
            referrerPolicy: "no-referrer",
            body: JSON.stringify(data),
        }
    
        const response = await fetch(urlApi + url, getHeader);
        return response.json();
    },

    put: async function (url, data) {

        var getHeader = {
            method: "PUT", 
            cache: "no-cache",
            credentials: "same-origin",
            headers: {"Content-Type": "application/json"},
            redirect: "follow",
            referrerPolicy: "no-referrer",
            body: JSON.stringify(data),
        }
    
        const response = await fetch(urlApi + url, getHeader);
        return response.json();
    },

}

let geocoder;
let latlng;
let data = {name: '', address: '', lat: '', lng: '', image: '', description: ''};

function initMap() {
    console.log("iniciando")
    geocoder = new google.maps.Geocoder();
}

function verifyAddres() {
    
    var addressInput = document.getElementById("address")

    if (addressInput.value != null && addressInput.value != ''){

        geocoder.geocode({ address: addressInput.value }).then(response => {
            
            var result = response.results[0];

            console.log(result)

		    latlng = result.geometry.location.toString().replace(/\(|\)/g, '').split(', ');

            addressInput.value = result.formatted_address;
            data.address = result.formatted_address
            data.lat = latlng[0];
            data.lng = latlng[1];

        }).catch((e) => {
            addressInput.value = '';
            console.error("Geocode was not successful for the following reason: ", e);
        });
    }

}

function onSubmit(user_id) { 
    console.log("id", user_id)
    
    for (field in data){
        var element = document.getElementById(field)
        if (element && field != 'address') data[field] = element.value;
    }

    http.post(`associate/4`, data).then(response => {
        console.log(response)
    })

    console.log(data)

}

window.initMap = initMap;