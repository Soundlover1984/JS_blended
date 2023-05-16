import axios from 'axios';

class BooksApiService {
  constructor() {
    this.BASE_URL = "https://books-backend.p.goit.global";
    // Для дінамічної зміної book categori
    this.selectedCategory = nall;
    // Для дінамічної зміної book Id
    this.bookId = nall;
    // нижче можна додавати свої this якщо буде потреба (повідомляти тім ліда)
  }

  /**
   * Отримання списку категорій
   * @returns {Array} - Масив з категоріями
   */
  async getCategoryList() {
    try {
      const response = await axios.get(`${this.BASE_URL}/books/category-list`);
      const categoryList = response.data;
      console.log('Category List:', categoryList);
      return categoryList;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to fetch category list');
    }
  }

  /**
   * Отримання списку популярних книг
   * @returns {Array} - Масив з популярними книгами
   */
  async getTopBooks() {
    try {
      const response = await axios.get(`${this.BASE_URL}/books/top-books`);
      const topBooks = response.data;
      console.log('Top Books:', topBooks);
      return topBooks;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to fetch top books');
    }
  }

  /**
   * Отримання списку книг за обраною категорією
   * @returns {Array} - Масив з книгами в обраній категорії
   */
  async getCategoryBooks() {
    try {
      const response = await axios.get(`${this.BASE_URL}/books/category`, {
        params: {
          category: this.selectedCategory
        }
      });
      const booksCategori = response.data;
      console.log('BooksCategori:', booksCategori);
      return booksCategori;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to fetch Books Category');
    }
  }

  /**
   * Отримання даних про книгу за її ідентифікатором
   * @returns {Object} - Об'єкт з даними книги
   */
    async getBookOnId() {
      try {
      const response = await axios.get(`${this.BASE_URL}/books/${this.bookId}`);
      const book = response.data;
      console.log('Book:', book);
      return book;
  } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch Book');
      }
    }
    }
  


// Створення екземпляру класу і виклик методів (цей код для прикладу)
// const booksApiService = new BooksApiService();

// booksApiService.getCategoryList();
// booksApiService.getTopBooks();
// booksApiService.getCategoryBooks();
// booksApiService.getBookOnId();


export { BooksApiService };

// приклад підключення до свого файлу
// 
// імпортуймо до свого файлу
// import { BooksApiService } from './booksApiService';
// 
// обявлення нового класу
// const booksApiService = new BooksApiService;
// 
// функція для отримання необхібних данних
// async function getBookDetails() {
//   try {
//     const book = await booksApiService.getBookOnId(); //ось тут ставте свій шлях
//     renderBookDetails(book);
//   } catch (error) {
//     console.error(error);
//     throw new Error('Failed to fetch book details');
//   }
// }
// Далі функцію рендеру