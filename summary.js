(function () {
    const wrapper = document.querySelector('.slider-track-wrapper');
    const track = document.querySelector('.slider-track');
    const slides = Array.from(document.querySelectorAll('.slide'));
    const prevBtn = document.querySelector('.nav-prev');
    const nextBtn = document.querySelector('.nav-next');
    let currentIndex = 0;

    if (!track || slides.length === 0) return;

    // Set wrapper to overflow hidden
    if (wrapper) wrapper.style.overflow = 'hidden';

    function getSlideWidth() {
        const style = getComputedStyle(slides[0]);
        return slides[0].offsetWidth + parseInt(style.marginLeft) + parseInt(style.marginRight) + 20; // 20 = gap
    }

    function getVisible() {
        const containerW = (wrapper || document.querySelector('.slider-container')).offsetWidth;
        return Math.max(1, Math.floor(containerW / getSlideWidth()));
    }

    function updateSlider() {
        const max = Math.max(0, slides.length - getVisible());
        if (currentIndex < 0) currentIndex = 0;
        if (currentIndex > max) currentIndex = max;
        track.style.transform = 'translateX(-' + (getSlideWidth() * currentIndex) + 'px)';
    }

    if (prevBtn) prevBtn.addEventListener('click', function () { currentIndex--; updateSlider(); });
    if (nextBtn) nextBtn.addEventListener('click', function () { currentIndex++; updateSlider(); });
    window.addEventListener('resize', updateSlider);
    updateSlider();
})();