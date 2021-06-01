import ApiService from "./api-service.js";

const SesionService = {

    getSesion() {
        return ApiService.get("sesion");
    },
    login(data) {
        data.forEach((value, key) => {
            console.log(key + ": " + value);
        });
        return ApiService.post("sesion", data);
    },
    logout(){
        ApiService.delete("sesion").then((res) => {
            window.location.href = "/Proyecto-Web-GTi/src/";
        })
    }
}

export default SesionService;