import { fundArray } from './supportFundArray';

const fundList = document.querySelector('.support__list-js');
const fundItem = fundArray
  .map(
    (
      { title, url, img_1x, img_2x },
      position
    ) => `<li class="support__list-item swiper-slide">
  <p class="support__number">${(position + 1).toString().padStart(2, '0')}</p>
  <a class="support__link" href="${url}" target="_blank" rel="noopener noreferrer nofollow">
    <img class="support__logo"
      srcset="${img_1x} 1x, ${img_2x} 2x"
      src="${img_1x}"
      alt="${title}"
      loading="lazy"
    />
  </a>
</li>`
  )
  .join('');

fundList.insertAdjacentHTML('beforeend', fundItem);
