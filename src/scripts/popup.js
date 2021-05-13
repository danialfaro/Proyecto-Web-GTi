var btnAbrirPopup = document.getElementById('popupContact'),
    overlay= document.getElementById('overlayID'),
    popup = document.getElementById('popupID'),
    btnCerrarPopup = document.getElementById('btn-cerrar-popup');

var mail = document.getElementById("mailOK");
var nombre = document.getElementById("nombreOK");
var asunto = document.getElementById("asuntoOK");
var text = document.getElementById("mensaje");



mail.addEventListener("input", function (event) {
	
	console.log("Mail: "+mail.validity.typeMismatch);
	console.log("Nombre: "+nombre.validity.valueMissing);
	console.log("Asunto: "+asunto.validity.valueMissing);
	console.log("Text: "+text.validity.valueMissing);
	if (mail.validity.typeMismatch || nombre.validity.valueMissing ||asunto.validity.valueMissing  ||text.validity.valueMissing ) {} 
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


