const ApiService = {

    path: "/Proyecto-Web-GTi/src/api/v1.0/",

    get(resource) {
        return new Promise((resolve, reject) => {
            let url = this.path + resource;
            fetch(url)
                .then((response) => {
                    if (response.ok) {
                        return response.json();
                    }
                    reject(
                        "No hemos podido recuperar ese json. El código de respuesta del servidor es: " +
                        response.status
                    );
                })
                .then((json) => resolve(json))
                .catch((err) => reject(err));
        });
    },
    post(resource, data) {
        return new Promise((resolve, reject) => {
            let url = this.path + resource;
            fetch(url, {
                method: 'post',
                body: data
            })
                .then((response) => {
                    if (response.ok) {
                        return response.json();
                    }
                    reject(
                        "No hemos podido recuperar ese json. El código de respuesta del servidor es: " +
                        response.status
                    );
                })
                .then((json) => resolve(json))
                .catch((err) => reject(err));
        });
    },
    delete(resource) {
        return new Promise((resolve, reject) => {
            let url = this.path + resource;
            fetch(url, {
                method: 'delete'
            })
                .then((response) => {
                    resolve(response);
                })
                .catch((err) => reject(err));
        });
    },
    put(resource, data) {
        return new Promise((resolve, reject) => {
            let url = this.path + resource;
            fetch(url, {
                method: 'put',
                body: JSON.stringify(Object.fromEntries(data))
            })
                .then((response) => {
                    if (response.ok) {
                        return response.json();
                    }
                    reject(
                        "No hemos podido recuperar ese json. El código de respuesta del servidor es: " +
                        response.status
                    );
                })
                .then((json) => resolve(json))
                .catch((err) => reject(err));
        });
    }
}

export default ApiService;