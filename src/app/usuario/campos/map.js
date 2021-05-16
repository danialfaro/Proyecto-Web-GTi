let map;
let polygonsCampos = [];
let currentPolygon;

let markers = [];

function initMap() {

    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 14,
        mapTypeId: 'hybrid',
        styles: [
            {
                featureType: 'transit',
                elementType: 'labels.icon',
                stylers: [{visibility: 'off'}]
            },
            {
                featureType: 'poi',
                stylers: [{visibility: 'off'}]
            },
            {
                featureType: 'road',
                stylers: [{visibility: 'off'}]
            },
        ],
        mapTypeControl: false,
        streetViewControl: false,
        rotateControl: false,
        zoomControl: false,
        fullscreenControl: false
    });


    getCampos(userData).then((campos) => {

        //console.log(campos);

        campos.forEach(campo => {

            // Crear las instancias de los campos
            let polygon = new google.maps.Polygon({
                data: {
                    id_campo: campo.id,
                    title: campo.title,
                    alerts: campo.alerts,
                    descripcion: "Lorem ipsum dolor sit, amet consectetur adipisicing elit." //default dev
                },
                paths: campo.paths,
                strokeColor: "#cc1884",
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: "#820053",
                fillOpacity: 0.25,
                map: map,
            });

            google.maps.event.addListener(polygon, 'click', function (e) {
                focusCampoPolygonMap(this);
            });

            polygonsCampos.push(polygon);

            //Rellenar lista de busqueda con los campos
            const listaCampos = document.getElementById("listaCampos");
            const li = document.createElement("li");
            li.innerHTML = polygon.data.title;
            li.addEventListener("click", () => {
                cerrarPopupBusqueda();
                focusCampoPolygonMap(polygon);
            })
            listaCampos.appendChild(li);

        });

        fitAllPolygonsBounds();


    })

    google.maps.event.addListener(map, 'zoom_changed', function (e) {
        if (map.zoom < 18) {
            closePanelContainer();
            markers.forEach(marker => {
                marker.setMap(null);
            })
        }
    })

}

function OnClickVer(){
    fitPolygonBounds(currentPolygon);
}

function focusCampoPolygonMap(campoPolygon){
    currentPolygon = campoPolygon;
    fitPolygonBounds(currentPolygon);
    openPanelContainer(currentPolygon.data);
    mostrarUbicacionesCampo(currentPolygon.data.id_campo);
}
function fitPolygonBounds(polygon) {
    let bounds = new google.maps.LatLngBounds();
    polygon.getPath().getArray().forEach(function (v) {
        bounds.extend(v);
    });
    let boundsPadding = {
        top: window.innerWidth > 1200 ? (window.innerHeight * 20) / 100 : 0,
        bottom: (window.innerHeight * 30) / 100,
        left: 20,
        right: window.innerWidth > 1200 ? (window.innerWidth * 45) / 100: 20
    }
    map.fitBounds(bounds, boundsPadding);
}

function fitAllPolygonsBounds() {
    let bounds = new google.maps.LatLngBounds();
    polygonsCampos.forEach(polygon => {
        polygon.getPath().getArray().forEach(function (v) {
            bounds.extend(v);
        });
    })
    map.fitBounds(bounds);
}

function openPanelContainer(data) {
    let panelContainer = document.getElementById("panelContainer");
    panelContainer.classList.add("open");

    let title = panelContainer.getElementsByClassName("title")[0];
    title.textContent = data.title;

    let descripcion = panelContainer.getElementsByClassName("descripcion")[0];
    descripcion.textContent = data.descripcion;

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

// Devuelve las coordenadas del centro del poligono
function polygonCenter(poly) {
    var lowx,
        highx,
        lowy,
        highy,
        lats = [],
        lngs = [],
        vertices = poly.getPath();

    for (var i = 0; i < vertices.length; i++) {
        lngs.push(vertices.getAt(i).lng());
        lats.push(vertices.getAt(i).lat());
    }

    lats.sort();
    lngs.sort();
    lowx = lats[0];
    highx = lats[vertices.length - 1];
    lowy = lngs[0];
    highy = lngs[vertices.length - 1];
    center_x = lowx + ((highx - lowx) / 2);
    center_y = lowy + ((highy - lowy) / 2);
    return (new google.maps.LatLng(center_x, center_y));
}


function mostrarUbicacionesCampo(campoId) {

    getUbicacionesCampo(campoId).then(ubicaciones => {

        ubicaciones.forEach(ubi => {
            let marker = new google.maps.Marker({
                position: {lat: parseFloat(ubi.lat), lng: parseFloat(ubi.lng)},
                map,
                icon: {
                    //url: "../../../images/pink-marker.png",
                    url: "../../../images/purple-sensor-marker.png",
                    scaledSize: new google.maps.Size(35, 35)
                },
                title: ubi.id
            });
            markers.push(marker);
        })
    })


}

// Click events

const infoBotonVer = document.getElementById("infoBotonVer");
infoBotonVer.addEventListener("click", () => {
  alert(currentPolygon.data.title + "\n"
      + currentPolygon.data.descripcion + "\n"
      + (currentPolygon.data.alerts ? currentPolygon.data.alerts.length : 0) + " alertas");
})

const overlay = document.getElementById('overlayPopup')
const popup = document.getElementById('popup');

// boton busqueda @ abrir/cerrar form_contacto
const busquedaBoton = document.getElementById("busquedaBoton");
let busquedaActivo = false;
busquedaBoton.addEventListener("click", () => {
    if(busquedaActivo) {
        /*cerrarPopupBusqueda();
        busquedaBoton.getElementsByTagName("i")[0].className = "fa fa-search";*/
        busquedaActivo = false;
    } else {
        overlay.classList.add('active');
        popup.classList.add('active');
        //busquedaBoton.getElementsByTagName("i")[0].className = "fa fa-times";
        busquedaActivo = true;
    }
});

// x - cerrar form_contacto
const btnCerrarPopup = document.getElementById('btn-cerrar-popup');
btnCerrarPopup.addEventListener('click', function(e){
    e.preventDefault();
    cerrarPopupBusqueda();
});

const cerrarPopupBusqueda = () => {
    overlay.classList.remove('active');
    popup.classList.remove('active');
    busquedaActivo = false;
}


// boton mapa @ fit bounds
const fitMapBoton = document.getElementById("fitMapBoton");
fitMapBoton.addEventListener("click", () => {
    fitAllPolygonsBounds();
})

// API Calls ====================== Cargar los datos //

function getCampos(userData) {
    return new Promise((resolve, reject) => {

        let campos = [];
        let url;

        if (userData && userData.rol !== "admin") {
            url = "../../../api/v1.0/campos/usuario/" + userData.id;
        } else {
            url = "../../../api/v1.0/campos";
        }

        fetch(url).then(res => {
            if (res.ok) {
                return res.json();
            } else {
                reject();
            }
        }).then(data => {

            data?.forEach(campoBd => {
                let campo = {};

                campo.id = campoBd.id;
                campo.title = campoBd.nombre;
                campo.paths = [];
                campoBd.geometria.coordinates[0].forEach(coord => {
                    campo.paths.push({
                        lat: coord[0],
                        lng: coord[1]
                    })
                })
                //campo.alerts.push();

                campos.push(campo);
            });

            resolve(campos);

        })

    })

}

function getUbicacionesCampo(campoId) {
    return new Promise((resolve, reject) => {

        let ubicaciones = [];
        let url = "../../../api/v1.0/campos/" + campoId + "/ubicaciones";

        fetch(url).then(res => {
            if (res.ok) {
                return res.json();
            } else {
                reject();
            }
        }).then(data => {

            data?.forEach(ubicacionBd => {
                ubicaciones.push(ubicacionBd);
            });

            resolve(ubicaciones);

        })

    })

}