import ApiService from "./api-service.js";

const ClientesService = {

    getClientes() {
        return ApiService.get("clientes");
    },
    getCliente(id) {
        return new Promise(((resolve, reject) => {
            ApiService.get("clientes/" + id).then(data => {
                resolve(data[0]);
            }).catch(err => reject(err));
        }))
    },
    getUsuariosCliente(id) {
        return ApiService.get("clientes/" + id + "/usuarios");
    },
    crearCliente(data) {
        return ApiService.post("clientes", data);
    },
    modificarCliente(id, data) {
        return ApiService.put("clientes/" + id, data);
    },
    eliminarCliente(id) {
        return ApiService.delete("clientes/" + id);
    }
}

export default ClientesService;