import { BookStorage } from "./bookStorage";

export class ToReadList {
  constructor() {
    this.numberOfReadBooks = 0;

    this.totalInfo = document.getElementById(
      "to-read-section__header__total-info"
    );
    this.selectedBooks = BookStorage.load();
    this.showBooks();
    this.updateNumberOfBooks(Object.keys(this.selectedBooks).length);
  }

  processSelectedBook(book) {
    if (!this.selectedBooks[book.id]) {
      this.updateNumberOfBooks(this.numberOfBooks + 1);
      this.selectedBooks[book.id] = book;
      BookStorage.save(this.selectedBooks);
    }
    this.showBooks();
  }

  updateNumberOfBooks(numberOfBooks) {
    this.numberOfBooks = numberOfBooks;
    const stringHTML = `${numberOfBooks} book(s), ${this.numberOfReadBooks} read`;
    this.totalInfo.innerText = stringHTML;
  }

  showBooks() {
    const bookList = document.getElementById("to-read-section__book-list");
    let stringHTML = "";
    for (let [index, book] of Object.entries(this.selectedBooks)) {
      stringHTML += `
        <div class="to-read-section__book-list__item">
            <p class="to-read-section__book-list__item__title">${book.title}</p>
            <p class="to-read-section__book-list__item__subtitle">${
              book.subtitle || ""
            }</p>
            <p class="to-read-section__book-list__item__author">${
              book.author_name || "unknown"
            }</p>
            <div class="to-read-section__book-list__item__buttons">
                <button class="to-read-section__book-list__item__buttons__mark-button">Mark as read</button>
                <button class="to-read-section__book-list__item__buttons__remove-button">Remove from list</button>
            </div>
        </div>
      `;
    }
    bookList.innerHTML = stringHTML;
  }
}
