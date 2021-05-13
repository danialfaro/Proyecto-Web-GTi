let map;
let sondas=[];


  getSondas(userData).then((sondas)=>{
    sondas.forEach(ubicacion=>{
       
        function addMarker() {
            let lat = document.getElementById('lat').value;
            let lng = document.getElementById('lng').value;
            var marker = new google.maps.Marker({
                position: {lat: lat, lng: lng},
                label: "1",
                animation: google.maps.Animation.DROP,
                map: map

            });
    })
},



 function getSondas(camposData){
    let ubicaciones=[];
    let url;
    var prom= new Promise((resolve, reject)=>{

        url = "../../../api/v1.0/campos/x/ubicaciones/" +camposData.id
        function filtrar(ubicaciones){
        let ubFiltradas=ubicaciones.filter(function(c){         
       
            let sol=c.includes(id.campo=id_campo.ubicaciones)
            return sol
        })
        return ubFiltradas
     }

     fetch(url).then(res => {
        if (res.ok) {
            return res.json();
        } 
        else {
            reject();
        }
     }).then(data => {

        if (!data) {
            return;
    
        }
        data.forEach(ubicacionBd => {
            let ubicacion = {};

           /* campo.title = campoBd.nombre;
            campo.paths = [];
            campoBd.geometria.coordinates[0].forEach(coord => {
                campo.paths.push({
                    lat: coord[0],
                    lng: coord[1]
                })
            })
        */

            sondas.push(ubicacion);
        })
        resolve(sondas);
        return prom
    })