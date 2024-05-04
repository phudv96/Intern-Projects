const slideClass = document.querySelectorAll(".slides img");

slideClass.forEach((slide) => slide.classList.add("slide"));

let slideIndex=0;
let intervalId= null;

document.addEventListener("DOMContentLoaded",initializeSlider);

function initializeSlider(){
    slideClass[slideIndex].classList.add("displaySlide");
}

function showSlide(index){
    slideClass.forEach(slide => {
        slide.classList.remove("displaySlide");
    })
    slideClass[slideIndex].classList.add("displaySlide");
}


function prevSlide(){
    slideIndex = (slideIndex == 0) ? 3 : (slideIndex - 1);
    showSlide(slideIndex);
    showSlide(slideIndex);

}

function nextSlide(){
    slideIndex = (slideIndex == 3) ? 0 : (slideIndex + 1);
    showSlide(slideIndex);

}