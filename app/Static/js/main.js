'use strict'

const urlApi = "localhost:5000/"

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


