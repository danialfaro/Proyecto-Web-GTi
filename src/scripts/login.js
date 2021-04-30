const loginForm = document.getElementById("formLogin");

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
        let loginFormOutput = document.getElementById("login-form-output");
        loginFormOutput.textContent = "El usuario no existe.";
    })

})