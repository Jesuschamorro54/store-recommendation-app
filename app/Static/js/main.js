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
            <a href="#" class="list-group-item list-group-item-action" style="display: flex;" 
            data-bs-toggle="modal" data-bs-target="#addModal" onclick="doOrder('${store.id}')">
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

var store_selected_id
var total = 0
var products = []
var products_to_buy = []

function doOrder(store_id) {
    html = ``;
    document.getElementById("input-address").value = userLocation;
    document.getElementById("message").innerHTML = "";
    products = [];
    store_selected_id = store_id;
    var content = document.getElementById("list-of-products")

    // Hacer una consulta para traer los productos de la tienda
    http.get(`public/${store_id}/products`).then(response => {
        const {status, data} = response;

        if (status) {

            data.map(product => {

                products.push({
                    description: product.description,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    id: product.id,
                    amount: 0,
                    available: product.available
                })

            });

            products_to_buy = products.slice()

            products_to_buy.map(product => {
                html += `
                    <div class="row bg-white border rounded p-2" style="margin: 5px;">
        
                        <div class="col-md-3 mt-1">
                            <img class="img-fluid img-responsive rounded product-image" src="${product.image}">
                        </div>

                        <div class="col-md-6 mt-1">
                            <h5>${product.name}</h5>
                            <p class="text-justify text-truncate para mb-0">${product.description}</p>
                        </div>

                        <div class="align-items-center align-content-center col-md-3 border-left mt-1">
                            
                            <div class="d-flex flex-row align-items-center">
                                <h4 class="mr-1">$${product.price}</h4>
                            </div>
                            
                            <div class="d-flex flex-row mt-2 align-items-end">

                                <input type="text" name="amount" class="form-control" id="input-amount-${product.id}" value="${product.amount}" disabled>
                                
                                <button class="btn btn-secondary btn-sm ms-1 mr-1 p-2" type="button" style="padding: 3px 13px !important; font-size: 20px; max-height: 36px;"
                                onclick="editProductAmount(${product.id}, 'less')"> 
                                    - 
                                </button> 
                                <button class="btn btn-primary btn-sm ms-1 mr-1 p-2" type="button" style="padding: 3px 13px !important; font-size: 20px; max-height: 36px;" 
                                onclick="editProductAmount(${product.id}, 'add')"> 
                                    +
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            });
        }
        content.innerHTML = html
    })
}

function editProductAmount(id, operator){


    var element = document.getElementById(`input-amount-${id}`);
    var totalElement = document.getElementById(`total`);
    var value = parseInt(element.value);

    switch (operator) {
        case "add":
            
            products.map (product => {
                if (id == product.id) {
                    
                    product.amount = value + 1
                    element.value = `${value+=1}`;

                    totalElement.innerHTML = `Total: $${total += product.price}`
                } 
            });

            break;
    
        default:
            products.map (product => {
                if (value > 0 && id == product.id) {
                    product.amount = value - 1;
                    element.value = `${value-=1}`;
                    totalElement.innerHTML = `Total: $${total -= product.price}`
                }
            });
            break;
    }

}

function purchase() {
    
    let data = {total: total, address: userLocation}

    let product_to_send = []

    products_to_buy.map(product => product_to_send.push({product_id: product.id, amount: product.amount}))

    data['extra_data'] = {
        'purchases_details': product_to_send
    }


    http.post(`purchases/${store_selected_id}`, data).then(response => {
        const {status, data} = response;

        if (status) {
            var messageResponse = document.getElementById("message")

            messageResponse.innerHTML = `<p class="ms-4" style="color: #28B463;"> ¡Pedido realizado!</p>`;

            setTimeout(() => document.getElementById("closeAddModal").click(), 1000);
        }else {
            messageResponse.innerHTML = `<p class="ms-4" style="color: #A93226;"> ¡Error al realizar el pedido!</p>`
        }

    });
}

var searchStores = []
var searchStores_copy = []
function initSearch(stores) {
    searchStores = stores;
    searchStores_copy = stores
    console.log("stores: ", searchStores )
}

function search(){

    html = ``;

    var searchElement = document.getElementById("bannerSearch");
    var content = document.getElementById("recommended-stores-content");
    var searchText = searchElement.value;

    console.log("Buscando: ", searchText)

    searchStores = searchStores_copy.filter(store => {
        return store.name.toLowerCase().indexOf(searchText.toLowerCase()) > -1;
    });

    console.log(searchStores)
    if (searchStores.length == 0 && searchText == "") searchStores = searchStores_copy

    searchStores.map(store => {
        html += `
        <div class="card pt-2" style="width: 18rem;">
                
            <div class="image-content">
                <img src=${store.image} class="card-img-top" alt="..." style="height: 95%;">
            </div>
            

            <div class="card-body">
                <h5 class="card-title text-justify">${store.name}</h5>
                <p class="card-text text-justify">${store.description}</p>
                <div class="text-center"><a href="#" class="btn btn-primary">Explorar</a></div>
            </div>

        </div>
        `
    })

    content.innerHTML = html 
    


}


