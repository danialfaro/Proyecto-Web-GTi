
//** Validacion
/*const mail = document.getElementById("correo");
const nombre = document.getElementById("nombre");
const asunto = document.getElementById("asunto");
const text = document.getElementById("mensaje");*/

const formContactanos = document.getElementById("formContactanos");
const submitButtonContact = document.getElementById("submitButtonContact");
formContactanos.addEventListener("input", function (event) {

	if (formContactanos.checkValidity()) {
		submitButtonContact.removeAttribute("disabled");
	} else {
		submitButtonContact.setAttribute("disabled", true);
	}

});

//** Popup

const overlay = document.getElementById('overlayID');
const popup = document.getElementById('popupID');

// Abrir boton al enviar
formContactanos.addEventListener("submit", (event) => {

	event.preventDefault();

	let formData = new FormData(formContactanos);

	let mailToDisplay = popup.getElementsByTagName("b")[0];
	mailToDisplay.innerText = formData.get("correo");

	overlay.classList.add('active');
	popup.classList.add('active');

	fetch("enviar-form.php", {
		method: "post",
		body: formData,
	})
})

const btnCerrarPopup = document.getElementById('btn-cerrar-popup');
btnCerrarPopup.addEventListener('click',function (){
	overlay.classList.remove('active');
	popup.classList.remove('active');
	formContactanos.reset();
});
