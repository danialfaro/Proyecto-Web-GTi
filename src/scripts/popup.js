const overlay= document.getElementById('overlayID');
const popup = document.getElementById('popupID');

const mail = document.getElementById("mailOK");
const nombre = document.getElementById("nombreOK");
const asunto = document.getElementById("nombreOK");
const text = document.getElementById("mensaje");


const btnCerrarPopup = document.getElementById('btn-cerrar-popup');
btnCerrarPopup.addEventListener('click',function (){
	overlay.classList.remove('active');
	popup.classList.remove('active');
});

const formContactanos = document.getElementById("formContactanos");

formContactanos.addEventListener("input", function (event) {

	if (mail.validity.typeMismatch || nombre.validity.valueMissing || asunto.validity.valueMissing || text.validity.valueMissing ) {
		//incorrecto
		console.log("incorrecto/incompleto");
	}

});

formContactanos.addEventListener("submit", (event) => {

	event.preventDefault();

	overlay.classList.add('active');
	popup.classList.add('active');

})
