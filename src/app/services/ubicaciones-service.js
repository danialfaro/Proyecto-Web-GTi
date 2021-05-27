import ApiService from "./api-service.js";

const UbicacionesService = {

    getUbicaciones() {
        return ApiService.get("ubicaciones");
    },
    getUbicacionesCampo(id) {
        return ApiService.get("campos/" + id + "/ubicaciones");
    },
    getUbicacion(id) {
        return new Promise(((resolve, reject) => {
            ApiService.get("clientes/" + id).then(data => {
                resolve(data[0]);
            }).catch(err => reject(err));
        }))
    },
    getSondaUbicacion(id) {
        return new Promise(((resolve, reject) => {
            ApiService.get("ubicaciones/" + id + "/sonda").then(data => {
                resolve(data[0]);
            }).catch(err => reject(err));
        }))
    },
    getMedicionesUbicacion(id, params = {}) {
        var queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');
        if(queryString.includes("last"))
            return ApiService.get("ubicaciones/" + id + "/mediciones?" + queryString); // Cuidao muchos valores
    },
    crearUbicacion(data) {
        return ApiService.post("ubicaciones", data);
    },
    modificarUbicacion(id, data) {
        return ApiService.put("ubicaciones/" + id, data);
    },
    eliminarUbicacion(id) {
        return ApiService.delete("ubicaciones/" + id);
    }
}

export default UbicacionesService;