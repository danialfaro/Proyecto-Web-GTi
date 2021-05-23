import ApiService from "./api-service.js";

const CamposService = {

    getCampos() {
        return new Promise((resolve, reject) => {
            ApiService.get("campos")
                .then(data => {
                    let campos = formatCampos(data);
                    resolve(campos);

                })
                .catch(err => {
                    reject(err);
                });
        });
    },
    getCampo(id) {
        return new Promise((resolve, reject) => {
            ApiService.get("campos/" + id)
                .then(data => {
                    let campos = formatCampos(data);
                    resolve(campos);

                })
                .catch(err => {
                    reject(err);
                });
        });
    },
    getCamposUsuario(id) {
        return new Promise((resolve, reject) => {
            ApiService.get("campos/usuario/" + id)
                .then(data => {
                    let campos = formatCampos(data);
                    resolve(campos);

                })
                .catch(err => {
                    reject(err);
                });
        });
    },
    crearCampo(data) {
        return ApiService.post("campos", data);
    },
    modificarCampo(id, data) {
        //return ApiService.put("campos/" + id, data);
    },
    eliminarCampo(id) {
        //return ApiService.delete("campos/" + id);
    }
}

function formatCampos(data){

    let campos = [];
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
    return campos;

}

export default CamposService;