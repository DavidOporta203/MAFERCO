function initSlider(){

    const imageList = document.querySelector(".slider-wrapper .image-list");
    const slideButtons = document.querySelectorAll(".slider-wrapper .slide-button");
    const sliderScrollbar = document.querySelector(".container-slider .slider-scrollbar");
    const scrollbarThumb = sliderScrollbar.querySelector(".scrollbar-thumb");
    const maxScrollLeft = imageList.scrollWidth - imageList.clientWidth;


    //handles scrollbar thumb drag
    scrollbarThumb.addEventListener("mousedown", (e)  => {
        const startX = e.clientX;
        const thumbPosition = scrollbarThumb.offsetLeft;


        //Update the thumb position on mouse move
        const handleMouseMove =  (e)  =>{
            const deltaX = e.clientX -startX;
            const newThumpPosition = thumbPosition + deltaX;
            const maxThumbPosition = sliderScrollbar.getBoundingClientRect().width - scrollbarThumb.offsetWidth;

            //Restringe que el scrollbar no se salga de la linea de dimensión
            const boundedPosition = Math.max(0, Math.min(maxThumbPosition, newThumpPosition));
            const scrollPosition = (boundedPosition / maxThumbPosition) * maxScrollLeft;

            scrollbarThumb.style.left = `${boundedPosition}px`;
            imageList.scrollLeft = scrollPosition;
        }

        //Remove event listeners on mouse up, basicamente hace que el scrollbar de abajo no se quede ajustado al movimiento del mouse
        const handleMouseUp = () =>{
            document.removeEventListener("mousemove", handleMouseMove);
        }


        //Add event listeners for drag interaction
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    });

    //Deslizar imagenes de acuerdo al click de los botones
    slideButtons.forEach(button => {
        button.addEventListener("click", () => {
            const direction = button.id ==="prev-slide" ? -1 : 1;
            const scrollAMount = imageList.clientWidth *direction;
            imageList.scrollBy({left: scrollAMount, behavior: "smooth"})
        });

        const handleSlideButtons = () =>{
            slideButtons[0].style.display = imageList.scrollLeft <= 0 ? "none" : "block";
            slideButtons[1].style.display = imageList.scrollLeft >=  maxScrollLeft ? "none" : "block";
        }
        const uopdateScrollThumbPosition = ()  => {
            const scrollPosition = imageList.scrollLeft;
            const thumbPosition = (scrollPosition / maxScrollLeft) * (sliderScrollbar.clientWidth - scrollbarThumb.offsetWidth);
            scrollbarThumb.style.left = `${thumbPosition}px`;
        }

        imageList.addEventListener("scroll", () => {
            handleSlideButtons();
            uopdateScrollThumbPosition();
        });
    });
}

window.addEventListener("load", initSlider);


