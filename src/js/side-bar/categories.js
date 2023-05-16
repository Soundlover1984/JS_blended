import Notiflix from 'notiflix';
import { BooksApiService } from '../api/booksApiService';

const categoriesContainer = document.querySelector('.categories__list');
const booksApiService = new BooksApiService();
booksApiService.selectedCategory = '0';

async function displayCategories() {
  try {
    const categoryList = await booksApiService.getCategoryList();
    createCategoriesList(categoryList);
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch category list');
  }

  function createCategoriesList(categoryList) {
    const categoriesItem = categoryList
      .map(({ list_name }) => `<li class="categories__item">${list_name}</li>`)
      .join('');
    categoriesContainer.insertAdjacentHTML('beforeend', categoriesItem);
  }
}
displayCategories();

categoriesContainer.addEventListener('click', selectCategory);

function selectCategory(event) {
  if (!event.target.classList.contains('categories__item')) {
    return;
  } else {
    const categoriesItems = document.querySelectorAll('.categories__item');
    categoriesItems.forEach(item =>
      item.classList.remove('categories-is-active')
    );
    event.target.classList.add('categories-is-active');
    booksApiService.selectedCategory = event.target.textContent;
    console.log(booksApiService.selectedCategory);
    getSelectCategory();
  }
}

async function getSelectCategory() {
  try {
    const listSelectCategoryBooks = await booksApiService.getCategoryBooks();
    renderSelectBooks(listSelectCategoryBooks);
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch category list');
  }

  // функція яка буде рендерити розмітку, Notiflix.Notify.info буде встановлено, якщо категорія книг буде порожня
  function renderSelectBooks(books) {
    Notiflix.Notify.info(
      'Unfortunately, nothing was found with the specified parameters. Please try changing the parameters and performing a new search. Thank you for using our website!',
      {
        width: '1000px',
        position: 'center-center',
        fontSize: '20px',
        backOverlayColor: 'rgba(17,17,17,0.6)',
      }
    );
    console.log(books);
  }
}
