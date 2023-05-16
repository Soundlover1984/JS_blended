// Імпорт необхідних модулів
import { BooksApiService } from '../api/booksApiService';
import { iconUrls } from './icon-urls';

// Створення екземпляру BooksApiService
const booksApiService = new BooksApiService();


// Ключ для зберігання списку покупок в локальному сховищі
const SHOPPING_LIST_KEY = 'SHOPPING_LIST_KEY';

// Масив книг
let bookArray = [];

// Отримання поточних даних з локального сховища
const currentStorage = JSON.parse(localStorage.getItem(SHOPPING_LIST_KEY));


// Посилання на елементи DOM
const refs = {
  bookModal: document.querySelector('.content-conteiner'),
  openModalBtn: document.querySelector('[data-modal-open]'),
  closeModalBtn: document.querySelector('[data-modal-close]'),
  backdrop: document.querySelector('.js-backdrop'),
  btnAddBook: document.querySelector('.js-btn-modal-add-book'),
  removeCover: document.querySelector('.js-remove-book-cover'),
  removeBtn: document.querySelector('.js-btn-modal-remove-book'),
};

refs.removeCover.classList.add('is-hidden');

if (currentStorage) {
  bookArray = currentStorage;
} else {
  localStorage.setItem(SHOPPING_LIST_KEY, JSON.stringify([]));
}

refs.openModalBtn.addEventListener('click', openModal);
refs.closeModalBtn.addEventListener('click', removeModal);
refs.btnAddBook.addEventListener('click', addBookBtnClick);
refs.removeBtn.addEventListener('click', removeBookBtnClick);

// Змінна для зберігання поточних даних про книгу
let currentBookData = null;

/**
 * Обробник кліку на кнопці "Додати книгу"
 * Отримує дані про книгу та додає їх до масиву книг
 */
async function addBookBtnClick() {
  const bookData = await getBookDetails();
  if (bookData) {
    currentBookData = bookData;
    const bookIndex = bookArray.findIndex(book => book._id === currentBookData._id);
    if (bookIndex === -1) {
      bookArray.push(bookData);
      localStorage.setItem(SHOPPING_LIST_KEY, JSON.stringify(bookArray));
      refs.btnAddBook.classList.add('is-hidden');
      refs.removeCover.classList.remove('is-hidden');
    }
  }
}

/**
 * Обробник кліку на кнопці "Видалити книгу"
 * Видаляє поточну книгу з масиву книг
 */
function removeBookBtnClick() {
  if (currentBookData) {
    const bookIndex = bookArray.findIndex(book => book._id === currentBookData._id);
    if (bookIndex !== -1) {
      bookArray.splice(bookIndex, 1);
      localStorage.setItem(SHOPPING_LIST_KEY, JSON.stringify(bookArray));
      currentBookData = null;
      refs.btnAddBook.classList.remove('is-hidden');
      refs.removeCover.classList.add('is-hidden');
    }
  }
}

/**
 * Отримання деталей про книгу
 * @returns {Promise<Object>} - Об'єкт з деталями про книгу
 * @throws {Error} - Помилка при отриманні деталей про книгу
 */
async function getBookDetails() {
  try {
    const bookData = await booksApiService.getBookOnId();
    return bookData;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch book details');
  }
}

/**
 * Відкриття модального вікна з деталями про книгу
 */
async function openModal() {
  const bookData = await getBookDetails();
  if (bookData) {
    renderBookDetails(bookData);
    document.body.classList.add('show-modal');
    refs.backdrop.addEventListener('click', backdropClickHandler);
    document.addEventListener('keydown', keydownHandler);
    refs.closeModalBtn.addEventListener('click', removeModal);
  }
}

/**
 * Рендеринг деталей про книгу
 * @param {Object} bookData - Об'єкт з деталями про книгу
 */
function renderBookDetails(bookData) {
  const markup = createBookDetailsMarkup(bookData);
  refs.bookModal.innerHTML = markup;
}

/**
 * Створення розмітки книги
 * @param {Object} book - Об'єкт з даними книги
 * @returns {string} - Розмітка книги
 */
function createBookDetailsMarkup(bookData) {
  const { book_image, title, author, description, buy_links } = bookData;

  const markup = `
    <div class="book-details">
      <img class="book-details__cover" src="${book_image}" alt="${title}" />
      <div class="book-details__info">
        <h2 class="book-details__title">${title}</h2>
        <h3 class="book-details__author">${author}</h3>
        <p class="book-details__description">${description}</p>
        <ul class="modal-shopping-list">
          ${buy_links ? createBuyLinksMarkup(buy_links) : ''}
        </ul>
      </div>
    </div>`;
  return markup;
}

/**
        Створення розмітки посилань на покупку
        @param {Array} buyLinks - Масив з посиланнями на покупку
        @returns {string} - Розмітка посилань на покупку
        */
function createBuyLinksMarkup(buyLinks) {
  const supportedStores = ["Amazon", "Apple Books", "Bookshop"];

  const filteredLinks = buyLinks.filter(link => supportedStores.includes(link.name));

  return filteredLinks
    .map((link) => {
      const { name, url } = link;
      const { iconUrl, iconUrl2x } = getIconUrlForStore(name);
      return `<li class="modal-shopping-list__item">
                <a class="buy-link" href="${url}" target="_blank" rel="noopener noreferrer nofollow">
                  <img class="buy-link__img"
                    srcset="${iconUrl} 1x, ${iconUrl2x} 2x"
                    src="${iconUrl}"
                    alt="${name}"
                    width="40"
                    height="40"
                  />
                </a>
              </li>`;
    })
    .join("");
}

/**
        
        Отримання URL-адреси іконки магазину
        @param {string} storeName - Назва магазину
        @returns {Object} - Об'єкт з URL-адресами іконки магазину
        */
function getIconUrlForStore(storeName) {
  const store = iconUrls.find(item => item.name === storeName);
  if (store) {
    return {
      iconUrl: store.iconUrl,
      iconUrl2x: store.iconUrl2x,
    };
  } else {
    return {
      iconUrl: '',
      iconUrl2x: '',
    };
  }
}

/**
 * Закриття модального вікна
 */
function removeModal() {
  refs.bookModal.innerHTML = '';
  document.body.classList.remove('show-modal');
  refs.closeModalBtn.removeEventListener('click', removeModal);
  refs.backdrop.removeEventListener('click', backdropClickHandler);
  document.removeEventListener('keydown', keydownHandler);
}

/**
 * Обробник кліку на підкладці (backdrop)
 * @param {Event} event - Об'єкт події
 */
function backdropClickHandler(event) {
  if (event.target === refs.backdrop) {
    removeModal();
  }
}

/**
 * Обробник натискання клавіші
 * @param {KeyboardEvent} event - Об'єкт події
 */
function keydownHandler(event) {
  if (event.code === 'Escape') {
    removeModal();
  }
}

