
let last, current = null
let productData = { name: '', price: 0, image: '', description: ''};

function openProducts(store) {

    last = current;
    current = store;

    if (last) {

        var lastItem = document.getElementById(`store-${last['id']}`);
        var lastContent = document.getElementById(`products-store-${last['id']}`);

        lastItem.className = lastItem.className.replace(" active", "");
        lastContent.style.display = "none";
    }

    var currentItem = document.getElementById(`store-${current['id']}`);
    var currentContent = document.getElementById(`products-store-${current['id']}`);

    currentItem.className += " active"
    currentContent.style.display = "block"
}


function addProduct() {

    store_id = current['id'];

    for (field in productData){
        var element = document.getElementById(field)
        if (element) productData[field] = element.value;
    }

    console.log(productData)

    if (current){
        http.post(`products/${store_id}`, productData).then(response => {
            console.log("Respuesta - Añadir producto\n", response)
        })
    }

}