const slider = document.querySelector("#slider");
//let sliderSection= document.querySelector(".slider__section");
let sliderSection= document.getElementsByClassName("slider__section");
let sliderSectionLast= sliderSection[sliderSection.length -1];

const  btnLeft = document.querySelector("#btn-left");
const  btnRight = document.querySelector("#btn-right");
console.log(sliderSectionLast);
console.log(sliderSection);
slider.insertAdjacentElement('afterbegin', sliderSectionLast);

function Next(){
    let sliderSectionFirst = document.querySelectorAll(".slider__section")[0];
    slider.style.marginLeft = "-100%";
    slider.style.transition = "all 0.5s";
    setTimeout(function (){
        slider.style.transition = "none";
        slider.insertAdjacentElement('beforeend', sliderSectionFirst);
        slider.style.marginLeft = "-50%";
    }, 500);
}

function Prev(){
    let sliderSectionFirst = document.querySelectorAll(".slider__section");
    let sliderSectionLast= sliderSection[sliderSection.length -1];
    slider.style.marginLeft = "0%";
    slider.style.transition = "all 0.5s";
    setTimeout(function (){
        slider.style.transition = "none";
        slider.insertAdjacentElement('afterbegin', sliderSectionLast);
        slider.style.marginLeft = "-50%";
    }, 500);
}

btnRight.addEventListener('click', function (){
    Next();
});
btnLeft.addEventListener('click', function (){
    Prev();
});

setInterval(function (){
    Next();
}, 6000);