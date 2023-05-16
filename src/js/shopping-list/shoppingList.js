const refs = {
    btnRemove: document.getElementsByClassName("shop-card__delete"),
    shopCard: document.getElementsByClassName("shop"),
}

// refs.btnRemove.addEventListener('click', onRemoveCard);

// function onRemoveCard(ev) {
//     ev.preventDefault();
//     localStorage.removeItem(SHOPPING_LIST_KEY);
// }

function renderMarkup(book) {
    const markup = createCardBook(book);
    refs.shopCard.insertAdjacentHTML('beforeend', markup);
    return;
}

function createCardBook(book) {
  return book
    .map(
        ({
            book_image,
            title,
            list_name,
            description,
            author,
            buy_links,


      }) => {
        return `  <div class="shop-card">
            <div>
               <img class="shop-card__img" src="${book_image}" alt="${title}" width="100" height="142" /> 
            </div>
            <div class="shop-card___inform">
                <div class="shop-card__wrap-first">
                    <div class="shop-card__wrap-inform">
                        <h2 class="shop-card__name">${title}</h2>
                        <p class="shop-card__category">${list_name}</p>
                    </div>
                    <button class="shop-card__delete" type="button">
                        <svg class="shop-card__delete-svg" width="28" height="28">
                            <use href="./images/icons.svg#icon-delete"></use>
                        </svg>
                    </button>
                </div>
                <div class="shop-card__wrap-second">
                    <p class="shop-card__title">${description}
                    </p>
                </div>
                <div class="shop-card__wrap-third">
                    <p class="shop-card__author">${author}</p>
                    <ul class="market">
                        <li class="market__marketplace"><a href="">${buy_links[0]}
                            <img srcset="./images/modal/image-1@1x.png 1x, ./images/modal/image-1@2x.png 2x" 
                            src="./images/modal/image-1@1x.png" alt="marketplace" width="32"
                                class="market__png" />
                        </a></li>
                        <li class="market__marketplace"><a href="">${buy_links[0]}
                            <img srcset="./images/modal/image-2@1x.png 1x, ./images/modal/image-2@2x.png 2x"
                             src="./images/modal/image-2@1x.png"
                                alt="marketplace" width="16" class="market__png" />
                        </a></li>
                        <li class="market__marketplace"><a href="">${buy_links[4]}
                            <img srcset="./images/modal/image3-1x.png 1x, ./images/modal/image3-2x.png 2x" 
                            src="./images/modal/image3-1x.png"
                                alt="marketplace" width="16" class="market__png" />
                            </svg>
                        </a></li>
                    </ul>
                </div>
            </div>
        </div>`;
      }
    )
    .join('');
}