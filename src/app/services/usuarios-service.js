import ApiService from "./api-service.js";

const UsuariosService = {

    getUsuarios() {
        return ApiService.get("usuarios");
    },
    getUsuario(id) {
        return new Promise(((resolve, reject) => {
            ApiService.get("usuarios/" + id).then(data => {
                resolve(data[0]);
            }).catch(err => reject(err));
        }))
    },
    crearUsuario(data) {
        return ApiService.post("usuarios", data);
    },
    modificarUsuario(id, data) {
        return ApiService.put("usuarios/" + id, data);
    },
    eliminarUsuario(id) {
        return ApiService.delete("usuarios/" + id);
    }
}

export default UsuariosService;