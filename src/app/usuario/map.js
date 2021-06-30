import CamposService from "../services/campos-service.js";
import UbicacionesService from "../services/ubicaciones-service.js";
import SesionService from "../services/sesion-service.js";
import UsuariosService from "../services/usuarios-service.js";

let isAdmin;

let map;

let polygonsCampos = [];
let currentPolygon;

let markersUbicaciones = [];
let markersCampos = [];

let infoWindowUbicaciones = [];

//let sondas = [];

let grafica;

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

        let request;
        if (user && user.rol !== "admin") {
            request = CamposService.getCamposUsuario(user.id);
        } else {

            isAdmin = true;

            let loggedAsUserID = window.sessionStorage.getItem("loggedAsUserID");

            if(loggedAsUserID) {

                // Ver los campos del usuario
                UsuariosService.getUsuario(loggedAsUserID).then(loggedAsUser => {

                    //Display "Logged as <usuario>" panel on map
                    const loggedAsPanel = document.getElementById("loggedAsPanel");
                    loggedAsPanel.getElementsByTagName("span")[0].textContent = loggedAsUser.nombre;

                });

                request = CamposService.getCamposUsuario(loggedAsUserID);

                //Ver los campos del cliente
                /*ClientesService.getCliente(loggedAsUserID).then(loggedAsUser => {
                    const loggedAsPanel = document.getElementById("loggedAsPanel");
                    loggedAsPanel.getElementsByTagName("span")[0].textContent = loggedAsUser.nombre;
                });

                request = CamposService.getCamposCliente(loggedAsUserID);*/

            } else {
                request = CamposService.getCampos();
            }


        }

        request.then((campos) => {
            setupCamposMapa(campos);
        }).catch(err => {
            setupCamposMapa([]);
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

// Renderiza el mapa con los datos de los campos
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
                url: "../../images/pink-marker.png",
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

        infowindowCampo.open(map, markerCampo); // Paneles abiertos por defecto

        markerCampo.addListener("click", () => {
            infowindowCampo.open(map, markerCampo);
        });
        markersCampos.push(markerCampo);

        // Precargar Markers Sondas
        getUbicacionesCampo(campo.id).then(ubicaciones => {

            ubicaciones.forEach(ubi => {

                    let marker = new google.maps.Marker({
                        position: {lat: parseFloat(ubi.lat), lng: parseFloat(ubi.lng)},
                        icon: {
                            url: "../../images/purple-sensor-marker.png",
                            scaledSize: new google.maps.Size(35, 35)
                        },
                        title: ubi.id,
                        campo_id: campo.id
                    });

                UbicacionesService.getSondaUbicacion(ubi.id).then(sonda => {
                    UbicacionesService.getMedicionesUbicacion(ubi.id, {last:true}).then(mediciones => {
                        createInfoWindowUbicacion(marker, ubi, sonda, mediciones);
                    });
                }).catch(err => {
                    createInfoWindowUbicacion(marker,  ubi);
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

function createInfoWindowUbicacion(marker, ubicacion, sonda, mediciones){

    let info = sonda?.mac;

    if(!sonda) {
        info = " No hay sonda";
    }

    let contentInfoWindow = `<div class="info-window-ubicacion">
                                <div class="info">
                                    <p>${info}</p>
                                </div>
                            </div>`

    if(mediciones) {

        let humedad = mediciones.filter(m => { return m.tipo === "humedad"})[0];
        let salinidad = mediciones.filter(m => { return m.tipo === "salinidad"})[0];
        let temperatura = mediciones.filter(m => { return m.tipo === "temperatura"})[0];
        let luminosidad = mediciones.filter(m => { return m.tipo === "luminosidad"})[0];

        contentInfoWindow = `<div class="info-window-ubicacion" data-idubi="${humedad.id_ubicacion}">
                                <header>
                                    <h3>Ubicacion ${ubicacion.id}</h3>
                                    ${isAdmin ? `<div class="info-sonda-id">Sonda actual: <span>${sonda.id}</span></div>` : ""}
                                </header>                                
                                <div class="medicion">
                                    <i class="fa fa-tint fa-fw humedad"></i><p>Humedad:</p><span>${humedad.valor} ${humedad.unidad}</span>
                                </div>
                                <div class="medicion">
                                    <i class="fa fa-mountain fa-fw salinidad"></i><p>Salinidad:</p><span>${salinidad.valor} ${salinidad.unidad}</span>
                                </div>
                                <div class="medicion">
                                    <i class="fa fa-sun fa-fw luminosidad"></i><p>Luminosidad:</p><span>${luminosidad.valor} ${luminosidad.unidad}</span>                         
                                </div>
                                <div class="medicion">
                                    <i class="fa fa-thermometer-three-quarters fa-fw temperatura"></i><p>Temperatura:</p><span>${temperatura.valor} ${temperatura.unidad}</span>
                                </div>
                                <button class="button_secondary">Ver graficas</button>                                
                            </div>`
    }

    const infowindowUbicacion = new google.maps.InfoWindow({
        content: contentInfoWindow,
    });

    infoWindowUbicaciones.push(infowindowUbicacion);

    google.maps.event.addListener(infowindowUbicacion, 'domready', () => {

        UbicacionesService.getMedicionesUbicacion(ubicacion.id, {limit: 32}).then(mediciones => {

            let infowindowUbicacionElement = document.getElementsByClassName("info-window-ubicacion");
            for (const iw of infowindowUbicacionElement) {
                let btn = iw.getElementsByTagName("button")[0];
                btn.addEventListener('click', () => {
                    abrirPanelGraficas(mediciones);
                })
            }

        });


    });

    marker.addListener("click", () => {
        infoWindowUbicaciones.forEach(iw => {
            iw.close();
        })
        infowindowUbicacion.open(map, marker);
    });
    markersUbicaciones.push(marker);
}

function focusCampoPolygonMap(campoPolygon) {
    mostrarMarkers(campoPolygon.data.id_campo);
    fitPolygonBounds(campoPolygon);
    openPanelContainer(campoPolygon.data);

    currentPolygon = campoPolygon;
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
    let boundsPadding = {
        top: 120
    }
    map.fitBounds(bounds, boundsPadding);
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

/*const infoBotonVer = document.getElementById("infoBotonVer");
infoBotonVer.addEventListener("click", () => {
    alert(currentPolygon.data.title + "\n"
        + currentPolygon.data.descripcion + "\n"
        + (currentPolygon.data.alerts ? currentPolygon.data.alerts.length : 0) + " alertas");
})*/

const overlay = document.getElementById('overlayPopup')
const popup = document.getElementById('popup');

// boton busqueda - abrir/cerrar
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

// x - cerrar busqueda
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


/* Panel Graficas Ubicacion */

// x - cerrar panel graficas
const btnCerrarPanelGraficas = document.getElementById('btn-cerrar-panelGraficas');
btnCerrarPanelGraficas.addEventListener('click', function (e) {
    e.preventDefault();
    let panelGraficas = document.getElementById("panelGraficas");
    panelGraficas.classList.remove("show");
});

function abrirPanelGraficas(mediciones) {

    panelGraficas.classList.add("show");

    mediciones.map(m => {

        var medicion = m.timestamp;
        var newFormato = '';
        for(let i=0;i<10;i++){
            newFormato = newFormato.concat(medicion[i]);
        }
        newFormato = newFormato.concat('T');
        for(let j=11;j<19;j++){
            newFormato = newFormato.concat(medicion[j]);
        }
        newFormato = newFormato.concat('.000+00:00');
        m.timestamp = newFormato;
    })

    rellenarGrafica(mediciones);

    document.getElementById("displayUbicacionId").textContent = mediciones[0].id_ubicacion;


}

function rellenarGrafica(mediciones) {
    mediciones = mediciones.sort(function (a, b) {
        if (a.timestamp < b.timestamp) return -1;
        if (a.timestamp > b.timestamp) return 1;
        return 0;
    });

    // recorrer las mediciones
    let fechas = [];
    let totalHumedad = [];
    let totalSalinidad = [];
    let totalLuz = [];
    let totalTemperatura = [];

    mediciones.forEach(function (medicion) {

        let i = fechas.indexOf(medicion.timestamp);

        if( medicion.tipo =='humedad') {
            totalHumedad.push(parseFloat(medicion.valor));

            if(i < 0){
                fechas.push(medicion.timestamp);
            }
        }
        else if( medicion.tipo =='salinidad') {
            totalSalinidad.push(parseFloat(medicion.valor));

            if(i < 0){
                fechas.push(medicion.timestamp);
            }
        }
        else if( medicion.tipo =='luminosidad') {
            totalLuz.push(parseFloat(medicion.valor));

            if(i < 0){
                fechas.push(medicion.timestamp);
            }
        }
        else{
            totalTemperatura.push(parseFloat(medicion.valor));

            if(i < 0){
                fechas.push(medicion.timestamp);
            }
        }


    })

    datos.labels = fechas;
    datos.datasets[0].data = totalHumedad;
    datos.datasets[1].data = totalSalinidad;
    datos.datasets[2].data = totalLuz;
    datos.datasets[3].data = totalTemperatura;

    CrearGrafica();
    
}
let datos = {
    labels: [],
    datasets: [
        { label: 'humedad',
            data: [],
            fill: false,
            backgroundColor: '#0e75b8',
            borderColor: '#0484D9',
            //borderDash: [2, 3],
            pointStyle: 'rectRot',
            pointRadius: 4,
        },
        {
            label: 'salinidad',
            data: [],
            fill: false,
            backgroundColor: '#838383',
            borderColor: '#9f9f9f',
            //borderDash: [3,2],
            pointStyle: 'rectRot',
            pointRadius: 4,
        },
        {
            label: 'luz',
            data: [],
            fill: false,
            backgroundColor: '#baab28',
            borderColor: '#d7c634',
            //borderDash: [3,2],
            pointStyle: 'rectRot',
            pointRadius: 4,
        },
        { label: 'temperatura',
            data: [],
            fill: false,
            backgroundColor: '#d76c34',
            borderColor: '#E77439',
            //borderDash: [2, 3],
            pointStyle: 'rectRot',
            pointRadius: 4,
        }



    ]
};
let opciones = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        x: {
            type: 'time',
            time: {
                // formato de fecha con Luxon
                tooltipFormat: 'HH:mm   DD',
                unit: 'minute'
            },
        },
        y: {
            stacked: false
        }
    },
    plugins: {
        legend: {
            position: 'bottom',
            align: 'center'
        },
        title: {
            display: true,
            text: 'Mediciones'
        },
        tooltips: {
            backgroundColor: '#fff',
            titleColor: '#000',
            titleAlign: 'center',
            bodyColor: '#333',
            borderColor: '#666',
            borderWidth: 1,
        }
    }
};

function CrearGrafica() {
    let ctx = document.getElementById('chart');
    if(grafica !== undefined) grafica.destroy();
    grafica = new Chart(ctx, {
        type: 'line',
        data: datos,
        options: opciones
    });
}

// Llamada a la API campos para cargar los datos de un campo
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