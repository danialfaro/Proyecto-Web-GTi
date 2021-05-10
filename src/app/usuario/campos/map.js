let map;
const initCoordinates = { lat: 38.996470, lng: -0.166034 };

let polygonsCampos = [];
var currentPolygon;

function initMap() {

    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 15,
        center: initCoordinates,
        mapTypeId: 'hybrid',
        styles: [
            {
                featureType: 'transit',
                elementType: 'labels.icon',
                stylers: [{ visibility: 'off' }]
            },
            {
                featureType: 'poi',
                stylers: [{ visibility: 'off' }]
            },
            {
                featureType: 'road',
                stylers: [{ visibility: 'off' }]
            },
        ],
        mapTypeControl: false,
        streetViewControl: false,
        rotateControl: false,
        zoomControl: false,
        fullscreenControl: false
    });

    let campos = [
        {
            title: "Campo caliente",
            paths: [
                { lat: 38.996985, lng: -0.166835 },
                { lat: 38.995776, lng: -0.167017 },
                { lat: 38.995551, lng: -0.165333 },
                { lat: 38.996967, lng: -0.165400 }
            ],
            alerts: [
                { title: "Aviso humedad baja." },
                { title: "Aviso humedad baja." },
                { title: "Aviso humedad baja." },
                { title: "Aviso humedad baja." }
            ],
        },
        {
            title: "Campo tibio",
            paths: [
                { lat: 38.994284, lng: -0.165939 },
                { lat: 38.993731, lng: -0.165426 },
                { lat: 38.993356, lng: -0.165714 },
                { lat: 38.992422, lng: -0.165937 },
                { lat: 38.992558, lng: -0.167594 },
                { lat: 38.993979, lng: -0.167213 }
            ]

        }
    ]

    campos.forEach(campo => {
        // Esto por cada campo leido de la base de datos
        let polygon = new google.maps.Polygon({
            data: {
                title: campo.title,
                alerts: campo.alerts
            },
            paths: campo.paths,
            strokeColor: "#cc1884",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "#820053",
            fillOpacity: 0.35,
            map: map,
        });

        google.maps.event.addListener(polygon, 'click', function (e) {
            currentPolygon = this;
            fitPolygonBounds(currentPolygon);
            openPanelContainer(currentPolygon.data);
        });

        polygonsCampos.push(polygon);
        //
    });



    google.maps.event.addListener(map, 'zoom_changed', function (e) {
        if (map.zoom < 18) {
            closePanelContainer();
        }
    })

}

function fitPolygonBounds(polygon) {
    let bounds = new google.maps.LatLngBounds();
    polygon.getPath().getArray().forEach(function (v) {
        bounds.extend(v);
    });
    let boundsPadding = {
        //top: window.innerWidth > 400 ? (window.innerHeight * 5) / 100 : 0,
        bottom: (window.innerHeight * 30) / 100,
        left: 20,
        right: 20
    }
    map.fitBounds(bounds, boundsPadding);
}

function openPanelContainer(data) {
    let panelContainer = document.getElementById("panelContainer");
    panelContainer.classList.add("open");

    let title = panelContainer.getElementsByClassName("title")[0];
    title.textContent = data.title;

    let alerts = panelContainer.getElementsByClassName("alert")[0];
    let numAlerts = data.alerts ? data.alerts.length : 0;
    alerts.textContent = numAlerts + " alertas";

    // Siempre la clase alert
    alerts.className = "alert";
    // El tipo de alerta
    switch (true) {
        case numAlerts > 0 && numAlerts < 3:
            alerts.classList.add("alert-risky");
            break;
        case numAlerts >= 3:
            alerts.classList.add("alert-danger");
            break;
    }

}

function closePanelContainer() {
    let panelContainer = document.getElementById("panelContainer");
    panelContainer.classList.remove("open");
}

function polygonCenter(poly) {
    var lowx,
        highx,
        lowy,
        highy,
        lats = [],
        lngs = [],
        vertices = poly.getPath();

    for(var i=0; i<vertices.length; i++) {
        lngs.push(vertices.getAt(i).lng());
        lats.push(vertices.getAt(i).lat());
    }

    lats.sort();
    lngs.sort();
    lowx = lats[0];
    highx = lats[vertices.length - 1];
    lowy = lngs[0];
    highy = lngs[vertices.length - 1];
    center_x = lowx + ((highx-lowx) / 2);
    center_y = lowy + ((highy - lowy) / 2);
    return (new google.maps.LatLng(center_x, center_y));
}