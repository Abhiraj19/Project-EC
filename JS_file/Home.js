let slideIndex = 1;
showSlides(slideIndex);

// Next/previous controls
function plusSlides(n) {
    showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("mySlides");
    let dots = document.getElementsByClassName("dot");

    if (n > slides.length) { slideIndex = 1 }
    if (n < 1) { slideIndex = slides.length }

    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }

    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }

    slides[slideIndex - 1].style.display = "block";
    dots[slideIndex - 1].className += " active";
}

// Auto-play (Optional)
setInterval(() => {
    plusSlides(1);
}, 5000); // Change slide every 5 seconds

const slideContainer = document.querySelector('#slide_cont_2');
const slideTrack = document.createElement('div');
const slideCards = Array.from(document.querySelectorAll('.slide_card'));

// Create Slide Track
slideTrack.classList.add('slide_track');
slideCards.forEach(card => slideTrack.appendChild(card));
slideContainer.appendChild(slideTrack);

// Create Navigation Buttons
const prevBtn = document.createElement('button');
const nextBtn = document.createElement('button');
prevBtn.id = 'prevBtn';
nextBtn.id = 'nextBtn';
prevBtn.className = 'slide_nav';
nextBtn.className = 'slide_nav';
prevBtn.innerHTML = '❮';
nextBtn.innerHTML = '❯';
slideContainer.appendChild(prevBtn);
slideContainer.appendChild(nextBtn);

// Slider State
let currentIndex = 0;
const cardWidth = slideCards[0].offsetWidth + 20; // Card width + gap

// Function to Update Slider
function updateSlider() {
    slideTrack.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
    slideTrack.style.transition = 'transform 0.3s ease-in-out';
}

// Navigate to Previous Slide
prevBtn.addEventListener('click', () => {
    currentIndex = Math.max(currentIndex - 1, 0); // Ensure it doesn't go below 0
    updateSlider();
    resetAutoSlide();
});

// Navigate to Next Slide
nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % slideCards.length; // Loop to first card
    updateSlider();
    resetAutoSlide();
});

// Auto-Slide Functionality
let autoSlideInterval = setInterval(nextSlide, 3000);

// Function for Auto-Slide
function nextSlide() {
    currentIndex = (currentIndex + 1) % slideCards.length;
    updateSlider();
}

// Reset Auto-Slide on User Interaction
function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    autoSlideInterval = setInterval(nextSlide, 3000);
}

// Pause Auto-Slide on Hover
slideContainer.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
slideContainer.addEventListener('mouseleave', resetAutoSlide);

// Handle Window Resize for Responsive Slider
window.addEventListener('resize', () => {
    currentIndex = 0; // Reset index on resize
    updateSlider();
});
