var btnAbrirPopup = document.getElementById('popupContact'),
    overlay= document.getElementById('overlayID'),
    popup = document.getElementById('popupID'),
    btnCerrarPopup = document.getElementById('btn-cerrar-popup');

btnAbrirPopup.addEventListener('click',function (){
    overlay.classList.add('active');
    popup.classList.add('active');
});

btnCerrarPopup.addEventListener('click',function (){
    overlay.classList.remove('active');
    popup.classList.remove('active');
});