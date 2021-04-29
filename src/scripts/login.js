const loginForm = document.getElementById("login-form");

loginForm.addEventListener("submit", (event) => {

    event.preventDefault();

    let loginFormData = new FormData(event.target); //loginForm
    loginFormData.forEach((value, key) => {
        console.log(key + ": " + value);
    });

    fetch("api/v1.0/sesion", {
        method: "POST",
        body: loginFormData
    }).then((res) => {
        if(res.ok) {
            return res.json();
        }
    }).then(data => {
        switch (data.rol) {
            case 'admin':
                window.location.href = 'app/admin';
                break;
            case 'user':
                window.location.href = 'app/usuario';
                break;
        }
        
    }).catch(err => {
        let output = document.getElementById("output");        
        output.textContent = "El usuario no existe." + "\n" + err;
    })

})

/*const loginForm = document.getElementById("formLogin");
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
            //TODO: Redirigir a la aplicacion
            alert("Bienvenido, " + data.nombre + "!");           
        }
    }).catch(err => {
        alert("El usuario no existe.");
    })

})*/