import CamposService from "../../services/campos-service.js";
import UbicacionesService from "../../services/ubicaciones-service.js";
import SesionService from "../../services/sesion-service.js";

let map;

let polygonsCampos = [];
let currentPolygon;

let markersUbicaciones = [];
let markersCampos = [];

let sondas = [];

let initMap = function () {

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

    // Cargar los campos del usuario logeado
    SesionService.getSesion().then(user => {
        getCampos(user).then((campos) => {
            setupCamposMapa(campos);
        });
    });

    // Zoom changed
    google.maps.event.addListener(map, 'zoom_changed', function (e) {

        if (map.zoom < 16) {
            markersUbicaciones.forEach(marker => {
                marker.setMap(null);
            });
            closePanelContainer();
            mostrarMarkers(null, false);
        }

        if (map.zoom > 12) {
            togglePanelHide(true);
        }
    })
}

initMap();

function setupCamposMapa(campos) {
    campos.forEach(campo => {

        // Crear las instancias de los campos
        let polygon = new google.maps.Polygon({
            data: {
                id_campo: campo.id,
                title: campo.nombre,
                alerts: campo.alerts,
                descripcion: "Lorem ipsum dolor sit, amet consectetur adipisicing elit." //default dev
            },
            paths: campo.paths,
            strokeColor: getComputedStyle(document.documentElement).getPropertyValue('--primary'),
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: getComputedStyle(document.documentElement).getPropertyValue('--primary'),
            fillOpacity: 0.25,
            map: map,
        });

        google.maps.event.addListener(polygon, 'click', function (e) {
            focusCampoPolygonMap(this);
        });

        polygonsCampos.push(polygon);

        // Precargar Marker Campo
        let markerCampo = new google.maps.Marker({
            position: polygonCenter(polygon),
            map: map,
            icon: {
                url: "../../../images/pink-marker.png",
                scaledSize: new google.maps.Size(35, 35)
            },
            title: campo.nombre,
            campo_id: campo.id
        });
        let contentInfoWindow = `<div class="info-window">                                    
                                    <h4>${campo.nombre}</h4>
                                    <button class="button_primary" data-campoid="${campo.id}">Visitar</button>
                                 </div>`
        const infowindowCampo = new google.maps.InfoWindow({
            content: contentInfoWindow,
        });
        google.maps.event.addListener(infowindowCampo, 'domready', function () {
            let infoWindows = document.getElementsByClassName("info-window");
            for (const iw of infoWindows) {
                let btn = iw.getElementsByTagName("button")[0];
                btn.addEventListener('click', () => {
                    focusCampoPolygonMap(polygonsCampos.find((p) => {
                        return p.data.id_campo === btn.dataset.campoid;
                    }))
                })
            }
        });


        markerCampo.addListener("click", () => {
            infowindowCampo.open(map, markerCampo);
        });
        markersCampos.push(markerCampo);

        // Precargar Markers Sondas
        getUbicacionesCampo(campo.id).then(ubicaciones => {

            ubicaciones.forEach(ubi => {

                    UbicacionesService.getMedicionesUbicacion(ubi.id, {last:true}).then(mediciones => {
                        console.log(mediciones);
                    }); 

                    let marker = new google.maps.Marker({
                        position: {lat: parseFloat(ubi.lat), lng: parseFloat(ubi.lng)},
                        icon: {
                            //url: "../../../images/pink-marker.png",
                            url: "../../../images/purple-sensor-marker.png",
                            scaledSize: new google.maps.Size(35, 35)
                        },
                        title: ubi.id,
                        campo_id: campo.id
                    });

                UbicacionesService.getSondaUbicacion(ubi.id).then(sonda => {
                    createInfoWindowSonda(marker, sonda);
                }).catch(err => {
                    createInfoWindowSonda(marker, null);
                })

            })
        })

        // Rellenar lista de busqueda con los campos
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
}

function createInfoWindowSonda(marker, sonda){

    let info = sonda?.mac;

    if(!sonda) {
        info = " No hay sonda";
    }

    let contentInfoWindow = `<div class="info-window-sonda">
                                            <!-- <i class="fa fa-tint fa-fw humedad"></i>
                                            <i class="fa fa-mountain fa-fw salinidad"></i>
                                            <i class="fa fa-thermometer-three-quarters fa-fw temperatura"></i>
                                            <i class="fa fa-sun luninosidad fa-fw"></i>-->
                                            <div class="info">
                                                <p>${info}</p>
                                            </div>
                                        </div>`
    const infowindowSonda = new google.maps.InfoWindow({
        content: contentInfoWindow,
    });

    marker.addListener("click", () => {
        infowindowSonda.open(map, marker);
    });
    markersUbicaciones.push(marker);
}

function focusCampoPolygonMap(campoPolygon) {
    mostrarMarkers(campoPolygon.data.id_campo);
    fitPolygonBounds(campoPolygon);
    openPanelContainer(campoPolygon.data);

    currentPolygon = campoPolygon;
}

window.focusCampoPolygonMap = focusCampoPolygonMap;

function fitPolygonBounds(polygon) {
    let bounds = new google.maps.LatLngBounds();
    polygon.getPath().getArray().forEach(function (v) {
        bounds.extend(v);
    });
    let boundsPadding = {
        top: window.innerWidth > 1200 ? (window.innerHeight * 20) / 100 : 0,
        bottom: (window.innerHeight * 30) / 100,
        left: 20,
        right: window.innerWidth > 1200 ? (window.innerWidth * 45) / 100 : 20
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
    let center_x = lowx + ((highx - lowx) / 2);
    let center_y = lowy + ((highy - lowy) / 2);
    return (new google.maps.LatLng(center_x, center_y));
}

function mostrarMarkers(campoId, mostrar = true) {
    let mapa = mostrar ? map : null;
    markersUbicaciones.forEach(marker => {
        if (campoId === null || marker.campo_id === campoId) {
            marker.setMap(mapa);
        }
    });
    markersCampos.forEach(marker => {
        marker.campo_id === campoId ? marker.setMap(null) : marker.setMap(map);
    })
}

// UI

const panelContainer = document.getElementById("panelContainer");

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

    togglePanelHide(false);

}

function closePanelContainer() {

    panelContainer.classList.remove("open");
}

const panelHeader = document.getElementById("panelHideToggle");
panelHeader.addEventListener('click', () => {
    togglePanelHide(!panelContainer.classList.contains("hide"));
});

function togglePanelHide(hide) {
    if (hide) {
        panelContainer.classList.add("hide");
    } else {
        panelContainer.classList.remove("hide");
    }
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

// boton busqueda - abrir/cerrar form_contacto
const busquedaBoton = document.getElementById("busquedaBoton");
let busquedaActivo = false;
busquedaBoton.addEventListener("click", () => {
    if (busquedaActivo) {
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
btnCerrarPopup.addEventListener('click', function (e) {
    e.preventDefault();
    cerrarPopupBusqueda();
});

const cerrarPopupBusqueda = () => {
    overlay.classList.remove('active');
    popup.classList.remove('active');
    busquedaActivo = false;
}


// boton mapa - fit bounds
const fitMapBoton = document.getElementById("fitMapBoton");
fitMapBoton.addEventListener("click", () => {
    fitAllPolygonsBounds();
})

// API Calls ====================== Cargar los datos //


function getCampos(userData) {
    return new Promise((resolve, reject) => {
        let request;
        if (userData && userData.rol !== "admin") {
            request = CamposService.getCamposUsuario(userData.id);
        } else {
            request = CamposService.getCampos();
        }
        request.then(data => resolve(data)).catch(err => reject(err));
    });
}

function getUbicacionesCampo(campoId) {
    return new Promise((resolve, reject) => {
        let ubicaciones = [];
        UbicacionesService.getUbicacionesCampo(campoId).then(data => {
            data?.forEach(ubicacionBd => {
                ubicaciones.push(ubicacionBd);
            });
            resolve(ubicaciones);
        }).catch(err => reject());
    })

}

