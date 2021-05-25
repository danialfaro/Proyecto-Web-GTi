import ApiService from "./api-service.js";

const UbicacionesService = {

    getUbicaciones() {
        return ApiService.get("ubicaciones");
    },
    getUbicacionesCampo(id) {
        return ApiService.get("campos/" + id + "/ubicaciones");
    },
    getUbicacion(id) {
        return ApiService.get("ubicaciones/" + id);
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