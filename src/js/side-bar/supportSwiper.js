import Swiper from 'swiper';
const btnSwiper = document.querySelector('.swiper-button');
const swiper = new Swiper('.swiper', {
  direction: 'vertical',
  slidesPerView: 'auto',
  spaceBetween: 20,
  rewind: true,
  navigation: {
    nextEl: '.swiper-button',
  },
});
swiper.update();
btnSwiper.addEventListener('click', () => {
  swiper.slideNext();
});
