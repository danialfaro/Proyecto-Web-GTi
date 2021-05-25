
//** Validacion
const mail = document.getElementById("mail");
const nombre = document.getElementById("nombre");
const asunto = document.getElementById("nombre");
const text = document.getElementById("mensaje");

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

const overlay= document.getElementById('overlayID');
const popup = document.getElementById('popupID');

// Abrir boton al enviar
formContactanos.addEventListener("submit", (event) => {

	//event.preventDefault();

	overlay.classList.add('active');
	popup.classList.add('active');
})

const btnCerrarPopup = document.getElementById('btn-cerrar-popup');
btnCerrarPopup.addEventListener('click',function (){
	overlay.classList.remove('active');
	popup.classList.remove('active');
});
