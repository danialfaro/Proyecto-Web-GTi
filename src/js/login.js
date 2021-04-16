const loginForm = document.getElementById("formLogin");
loginForm.addEventListener("submit",(event) => {
    event.preventDefault();
    let loginFormData = new FormData(event.target); //loginForm
    loginFormData.forEach((value, key) => {
        console.log(key + ": " + value);
    });

    let username = loginFormData.get("username");
    let password = loginFormData.get("password");

    let url = "src/api/v1.0/" + username + "-" + password +".json";
    fetch(url).then(res => {
        console.log(res);
        return res.json();
    }).then(data => {
        console.log(data);
        if(data.resultado == "OK") {
            alert("Bienvenido, " + data.nombre + "!");
            //TODO: Redirigir a la aplicacion
            setTimeout(() => {
                location.href = "../../index.html";
            }, 2000);
        }
    }).catch(err => {
        alert("El usuario no existe.");
    })

})