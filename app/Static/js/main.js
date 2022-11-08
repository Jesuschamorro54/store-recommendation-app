'use strict'

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

var stores = [];
var html = ``;
var centerPoint = {};

function getStoresNearby(point){
    
    if (stores.length == 0){
        http.get("stores").then(response => {

            const {status, data} = response;
    
            if (status){
                stores = data
                centerPoint = point;
                putNearbyStores();
            }
    
        });
    }else{
        centerPoint = point;
        putNearbyStores();
    }

}


function putNearbyStores() {
    html = ``;
    var content = document.getElementById("content-nearby-stores")
    let radio = 300;
    stores.map(store => {

        let pointToCheck = {
            address: store.address,
            lat: parseFloat(store.lat), 
            lng: parseFloat(store.lng)
        }

        if (arePointsNear(pointToCheck, centerPoint, radio)){

            html += ` 
            <a href="#" class="list-group-item list-group-item-action" style="display: flex;">
                <img src="${store.image}" width="115">
                <div class="body-content ms-3" style="width: 100%;">
                    <div class="d-flex w-100 justify-content-between">
                        <h5 class="mb-1">${store.name}</h5>
                        <small>${store.address}</small>
                    </div>
                    <p class="mb-1">${store.description}</p>
                    <small>Valiración:  ${store.likes}</small>
                </div>
            </a>
            `;
        }       
    });
    
    content.innerHTML = html
}


