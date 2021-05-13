var btnAbrirPopup = document.getElementById('popupContact'),
    overlay= document.getElementById('overlayID'),
    popup = document.getElementById('popupID'),
    btnCerrarPopup = document.getElementById('btn-cerrar-popup');

var mail = document.getElementById("mailOK");
var nombre = document.getElementById("nombreOK");
var asunto = document.getElementById("nombreOK");
var text = document.getElementById("mensaje");



mail.addEventListener("input", function (event) {

	if (mail.validity.typeMismatch || nombre.validity.valueMissing || asunto.validity.valueMissing || text.validity.valueMissing ) {
		//
	}
	else {
  
		btnAbrirPopup.addEventListener('click',function (){
			overlay.classList.add('active');
			popup.classList.add('active');
		});

		btnCerrarPopup.addEventListener('click',function (){
		  overlay.classList.remove('active');
		  popup.classList.remove('active');
		});
	}
});

let formContactanos = document.getElementById("formContactanos");
formContactanos.addEventListener("submit", (event) => {

	event.preventDefault();

	overlay.classList.add('active');
	popup.classList.add('active');

})


