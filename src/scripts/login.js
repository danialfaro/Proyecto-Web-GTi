import SesionService from "../app/services/sesion-service.js";

const loginForm = document.getElementById("formLogin");

loginForm.addEventListener("submit", (event) => {

    event.preventDefault();

    let loginFormData = new FormData(event.target); //loginForm
    loginFormData.forEach((value, key) => {
        //console.log(key + ": " + value);
    });

    SesionService.login(loginFormData).then(user => {
        let redirects = {
            admin: "admin", user: "usuario"
        }
        window.location.href = 'app/' + redirects[user.rol];

    }).catch((err) => {
        console.log(err)
        let loginFormOutput = document.getElementById("login-form-output");
        loginFormOutput.textContent = "El usuario no existe.";
    })

})