import Notiflix from 'notiflix';
import { fetchBooks } from '../fetchBooks';
import { handleModalWindow } from '../modal';
import { drawCategory } from '../categories';
import { Spiner } from '../spiner-loader';
import debounce from 'lodash.debounce';


const mainTitleEl = document.querySelector('.main__title-js');
const mainWraperEl = document.querySelector('.main__list-js');
let currentRenderWidth = window.innerWidth;
let amountRenderBooks = 0;
let idBook = 0;
let title = 0;

const spiner = new Spiner();

window.addEventListener('resize', debounce(handleWindowResize, 50));


// Эта функция отслеживает изменение размера окна браузера. Когда происходит изменение размера, функция получает ширину окна и сравнивает ее с текущей шириной отображения currentRenderWidth. Если происходит изменение условия, указанного в if блоке, то функция вызывает location.reload(), что приводит к перезагрузке страницы. Таким образом, это позволяет перерендерить страницу, когда изменился размер окна, чтобы убедиться, что контент правильно обновляется в соответствии с новым размером окна.

function handleWindowResize(event) {
  const width = event.target.outerWidth;
  // console.log(currentRenderWidth);
  if (
    (width > 767 && currentRenderWidth < 768) ||
    (width > 1439 && currentRenderWidth < 1440) ||
    (width < 1440 && currentRenderWidth > 1439) ||
    (width < 768 && currentRenderWidth > 767)
  ) {
    location.reload();
  }
}

// Этот код объявляет функцию currentWindowWidth, которая в зависимости от ширины экрана определяет число книг, которые следует отображать на странице. Если ширина экрана меньше 768 пикселей, то функция устанавливает amountRenderBooks в 1. Если ширина находится в диапазоне от 768 до 1440, то amountRenderBooks устанавливается в 3. Во всех остальных случаях, amountRenderBooks устанавливается в 5. Однако этот код не содержит инструкций, присваивающих значения переменным currentRenderWidth и amountRenderBooks. Если currentRenderWidth - это глобальная переменная, то вероятно, она была определена в другом месте кода.

const currentWindowWidth = () => {
  if (currentRenderWidth < 768) {
    amountRenderBooks = 1;
  } else if (currentRenderWidth >= 768 && currentRenderWidth < 1440) {
    amountRenderBooks = 3;
  } else {
    amountRenderBooks = 5;
  }
};

// Данный код является функцией с именем validationQuery, которая принимает в качестве аргумента query. Функция проверяет, является ли длина query равной 0. Если да, то выводится уведомление об ошибке, используя вспомогательную библиотеку Notiflix.Notify.failure, и функция завершается, не возвращая никакого значения. Если же длина query не равна 0, то функция завершается без вывода каких-либо сообщений.

const validationQuery = query => {
  if (query.length === 0) {
    Notiflix.Notify.failure(
      'Sorry, there was an error on the server. Please try again.'
    );
    return;
  }
};

// Этот код определяет функцию makeMarkupAllCategories, которая принимает массив объектов categories. Далее функция отображает каждую категорию, используя метод map, создавая для каждой категории строку разметки HTML.

// Функция makeMarkupAllCategories использует функцию makeMarkupGategory(category.books) для создания вложенных элементов списка для каждой категории. А затем склеивает все строки в одну большую строку с помощью метода join().

// В итоге функция makeMarkupAllCategories возвращает строку разметки HTML для всех категорий в переданном массиве.

const makeMarkupAllCategories = categories => {
  return categories
    .map(category => {
      return `
           <li class='all-categories__item'>
           <p class='category-books__title'>${category.list_name}</p>
            <ul class='category-books__list-js card-set'>
           ${makeMarkupGategory(category.books)}
           </ul>
           <button class="load-more-js" type="button" data-category="${
             category.list_name
           }">see more</button>
           </li>
      `;
    })
    .join('');
};

// Данный код экспортирует функцию makeMarkupGategory, которая принимает объект категории книг category в качестве аргумента.

// Функция вызывает вспомогательную функцию trimArrayBooks, которая обрезает массив книг до 10 элементов (если массив больше). Затем массив обрезанных книг отображается в виде списка li элементов с помощью метода map.

// Каждый элемент списка содержит изображение img книги с заданным src, alt, data-id, и классом category-books__img, а также p элемент с надписью quick view.

// Также есть заголовок h3 с названием книги (book.title), которое обрезается до 17 символов с помощью вспомогательной функции checkLengthBookTitle и p элемент с именем автора книги (book.author), который также обрезается до 29 символов. Каждый элемент списка li имеет класс category-books__item.

// Функция map возвращает массив строк, каждая из которых является html-разметкой для одной книги, а затем соединяет эти строки в одну строку с помощью метода join. Результирующая строка содержит html-разметку для всей категории книг.

export const makeMarkupGategory = category => {
  return trimArrayBooks(category)
    .map(book => {
      return `
      <li class='category-books__item'>
       <a href="/" class='category-books__link'>
        <img
          class='category-books__img'
          src='${book.book_image}'
          alt='book'
          data-id="${book._id}"
         loading="lazy"
        />
        <div class='category-books__wrapper'>
        <p class='category-books__text'>quick view</p>
        </div>
        </a>
        <h3 class='category-books__name' >${checkLengthBookTitle(
          book.title,
          17
        )}</h3>
        <p class='category-books__author'>${checkLengthBookTitle(
          book.author,
          29
        )}</p>
      </li>
    `;
    })
    .join('');
};

// Данный код объявляет асинхронную функцию с названием feachAllCategories, которая запускает анимацию загрузки, затем использует функцию fetchBooks.getBestSellers(), чтобы получить массив книг, которые являются бестселлерами. Затем функция validationQuery() используется для проверки полученных книг. Если полученный массив проходит проверку, создаётся HTML-разметка с помощью функции makeMarkupAllCategories(), и она добавляется в элемент mainWraperEl, который находит соответствующие HTML-элементы.

// Затем происходит поиск всех элементов, имеющих класс .load-more-js и .category-books__item, и добавление слушателя событий на каждый из них (методы addEventListenerForBook и addEventListenerForBtn)

// После этого анимация загрузки скрывается, если в процессе выполнения какого-нибудь из шагов возникнет ошибка, она будет обработана в блоке catch. Сообщение об ошибке будет выведено в консоль, и анимация загрузки скрыта.

async function feachAllCategories() {
  try {
    spiner.show();

    

    const categories = await fetchBooks.getBestSellers();
    validationQuery(categories);
    mainWraperEl.innerHTML = makeMarkupAllCategories(categories);

    const seeMoreBtnEl = document.querySelectorAll('.load-more-js');
    const bookCategoryEl = document.querySelectorAll('.category-books__item');

    addEventListenerForBook(bookCategoryEl);
    addEventListenerForBtn(seeMoreBtnEl);

    spiner.hide();
  } catch (error) {
    console.log(error);
    spiner.hide();
  
  }
}

// Этот код экспортирует функцию с именем "showAllCategories". Когда эта функция вызывается, она изменяет содержимое элемента с идентификатором "mainTitleEl" следующим образом: добавляет строку "Best Sellers" и добавляет элемент "span" с классом "main__title--color-purple" и текстом "Books". Затем она вызывает функцию "feachAllCategories". В предположении, что функция "feachAllCategories" определена где-то в коде, этот код, таким образом, запрашивает все категории и отображает их в "mainTitleEl".

export const showAllCategories = () => {
  mainTitleEl.innerHTML =
    ' Best Sellers <span class="main__title--color-purple">Books</span>';
  feachAllCategories();
};

// Этот код объявляет функцию handleImgClick, которая является обработчиком событий клика на изображениях.

// Сначала функция вызывает метод preventDefault() объекта event, чтобы предотвратить поведение по умолчанию при клике на изображение.

// Затем извлекается значение атрибута data-id из элемента, на котором произошел клик, и присваивается переменной idBook.

// Далее проверяется, является ли целевой элемент тегом <img>. Если это не так, функция завершается.

// В конце вызывается функция handleModalWindow с аргументом idBook.

// Объявление функции не содержит никаких ошибок.

const handleImgClick = event => {
  event.preventDefault();
  idBook = event.target.dataset.id;

  if (event.target.nodeName !== 'IMG') {
    return;
  }
  handleModalWindow(idBook);
};

// Данный код экспортирует функцию currentDocumentScroll, которая устанавливает значение scrollTop на элементе document.documentElement в зависимости от значения переменной currentRenderWidth (ширина текущей отрисовки). Если currentRenderWidth меньше 768, scrollTop устанавливается на 736 пикселей. Если currentRenderWidth больше или равен 768 и меньше 1440, scrollTop устанавливается на 650 пикселей. Во всех остальных случаях scrollTop устанавливается на 0.

export const currentDocumentScroll = () => {
  if (currentRenderWidth < 768) {
    document.documentElement.scrollTop = 736;
  } else if (currentRenderWidth >= 768 && currentRenderWidth < 1440) {
    document.documentElement.scrollTop = 650;
  } else {
    document.documentElement.scrollTop = 0;
  }
};

// Данный код объявляет константу handleSeeMoreBtnClick, которая представляет функцию обработчик события клика на кнопке "Показать больше".

// Когда пользователь нажимает на кнопку, происходит событие, которое передается в качестве аргумента event. Затем, из атрибута data-category этого события извлекается значение и присваивается переменной title.

// Функция setCurrentCategory(title) вызывается с переданным в нее значением title, чтобы изменить значение текущей категории.

// Затем функция drawCategory(title) вызывается для отображения выбранной категории, а функция currentDocumentScroll() прокручивает документ на верхнюю часть страницы.


const handleSeeMoreBtnClick = event => {
  title = event.target.dataset.category;

  setCurrentCategory(title);
  drawCategory(title);
  currentDocumentScroll();
};


// Эта функция checkLengthBookTitle принимает два аргумента: title - строку, представляющую заголовок книги и length - максимальное количество символов, которое должно быть возвращено. Функция проверяет длину заголовка (свойство length строки) на превышение максимального значения и если это так, то обрезает заголовок до length символов и добавляет многоточие в конце, используя метод slice() для работы со строками. Если длина заголовка не превышает максимальное значение, функция просто возвращает исходный заголовок без изменений. Например, checkLengthBookTitle('Harry Potter and the Philosopher\'s Stone', 10) вернет строку "Harry Pott...". Весь код экспортируется в виде константы с модификатором export, что позволит использовать его в других файлах модуля.

export const checkLengthBookTitle = (title, length) => {
  if (title.length > length) {
    return `${title.slice(0, length)}...`;
  }

  return title;
};



export const addEventListenerForBook = book => {
  book.forEach(el => {
    el.addEventListener('click', handleImgClick);
  });
};

const addEventListenerForBtn = category => {
  category.forEach(el => {
    el.addEventListener('click', handleSeeMoreBtnClick);
  });
};


const setCurrentCategory = title => {
  const categoriesListChildren = document.querySelector(
    '.categories-list-js'
  ).children;
  for (let i = 0; i < categoriesListChildren.length; i += 1) {
    const category = categoriesListChildren[i];

    category.firstElementChild.classList.remove('selected-categories');

    if (category.textContent.trim() === title.trim()) {
      category.firstElementChild.classList.add('selected-categories');
    }
  }
};

const trimArrayBooks = category => {
  if (amountRenderBooks === 1) {
    category.splice(1, 4);
  } else if (amountRenderBooks === 3) {
    category.splice(3, 2);
  } else {
    category;
  }
  return category;
};

currentWindowWidth();
showAllCategories();
