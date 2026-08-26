document.addEventListener('DOMContentLoaded', () => {
  const track = document.querySelector('.carousel');
  if (!track) return; // Exit if carousel doesn't exist on page

  const slides = Array.from(track.children);
  const nextButton = document.querySelector('.carousel__button--next');
  const prevButton = document.querySelector('.carousel__button--prev');
  const dotsNav = document.querySelector('.carousel__dots');

  if (!nextButton || !prevButton || !dotsNav) return;

  const dots = Array.from(dotsNav.children);

  // When I click left, move slides to the left
  // When I click right, move slides to the right
  // When I click the nav indicators, move to that slide

  const moveToSlide = (currentSlideIndex, targetSlideIndex) => {
    // Basic bounds checking
    if (targetSlideIndex < 0) {
      targetSlideIndex = slides.length - 1; // loop back to end
    } else if (targetSlideIndex >= slides.length) {
      targetSlideIndex = 0; // loop back to start
    }

    const amountToMove = targetSlideIndex * -100;
    track.style.transform = `translateX(${amountToMove}%)`;

    // Update active dot
    dots.forEach(dot => dot.classList.remove('carousel__dot--active'));
    dots[targetSlideIndex].classList.add('carousel__dot--active');

    // Update data attribute for tracking state
    track.dataset.currentIndex = targetSlideIndex;
  };

  nextButton.addEventListener('click', e => {
    const currentIndex = parseInt(track.dataset.currentIndex || 0);
    moveToSlide(currentIndex, currentIndex + 1);
  });

  prevButton.addEventListener('click', e => {
    const currentIndex = parseInt(track.dataset.currentIndex || 0);
    moveToSlide(currentIndex, currentIndex - 1);
  });

  dotsNav.addEventListener('click', e => {
    // what indicator was clicked on?
    const targetDot = e.target.closest('button');

    if (!targetDot) return;

    const currentIndex = parseInt(track.dataset.currentIndex || 0);
    const targetIndex = dots.findIndex(dot => dot === targetDot);

    moveToSlide(currentIndex, targetIndex);
  });
});
