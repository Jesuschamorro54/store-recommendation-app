
last, current = null

function openPurchases(store) {

    last = current;
    current = store;

    if (last) {

        var lastItem = document.getElementById(`store-${last['id']}-order`);
        var lastContent = document.getElementById(`products-store-${last['id']}-order`);

        lastItem.className = lastItem.className.replace(" active", "");
        lastContent.style.display = "none";
    }

    var currentItem = document.getElementById(`store-${current['id']}-order`);
    var currentContent = document.getElementById(`products-store-${current['id']}-order`);

    currentItem.className += " active"
    currentContent.style.display = "block"
}

function setOrderStatus(purchase_id) {

    var data = {
        'state': 1
    }

    http.put(`purchases/${purchase_id}`, data).then(response => {
        const {status, data} = response

        if (status) {
            let item = document.getElementById(`accordion-item-${purchase_id}`)
            item.style.display = "none"
        }

    })
}