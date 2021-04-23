import { BookStorage } from "./bookStorage";

export class ToReadList {
  constructor() {
    this.bookList = document.getElementById("to-read-section__book-list");
    this.selectedBooks = BookStorage.load();
    this.numberOfReadBooks = (() => {
      let counter = 0;
      for (let [index, book] of Object.entries(this.selectedBooks)) {
        if (book.read) counter++;
      }
      return counter;
    })();
    this.selectedBook;

    this.totalInfo = document.getElementById(
      "to-read-section__header__total-info"
    );
    this.showBooks();
    this.updateNumberOfBooks(Object.keys(this.selectedBooks).length);

    this.bookList.addEventListener("click", (event) => {
      let target = event.target.closest(
        ".to-read-section__book-list__item__buttons__mark-button"
      );
      console.log(target);
      if (target) {
        this.onMarkClicked(target);
        return;
      }
      target = event.target.closest(
        ".to-read-section__book-list__item__buttons__remove-button"
      );
      if (target) {
        this.onRemoveClicked(target);
        return;
      }

      target = event.target.closest(".to-read-section__book-list__item");
      if (!target) return;

      this.onDivClicked(target);
    });
  }

  onMarkClicked(targetMarkButton) {
    const targetDiv = targetMarkButton.closest(
      ".to-read-section__book-list__item"
    );
    if (this.selectedBooks[targetDiv.id].read !== true) {
      this.updateNumberOfBooks(this.numberOfBooks, this.numberOfReadBooks + 1);
      targetMarkButton.innerText = "Mark as unread";

      this.selectedBooks[targetDiv.id].read = true;
      BookStorage.save(this.selectedBooks);
      targetDiv.dataset.read = true;
    } else {
      this.updateNumberOfBooks(this.numberOfBooks, this.numberOfReadBooks - 1);
      this.selectedBooks[targetDiv.id].read = false;
      targetMarkButton.innerText = "Mark as read";
      BookStorage.save(this.selectedBooks);
      targetDiv.dataset.read = false;
    }
  }

  onRemoveClicked(targetRemoveButton) {
    const targetDiv = targetRemoveButton.closest(
      ".to-read-section__book-list__item"
    );
    const bookId = targetDiv.id;
    this.updateNumberOfBooks(
      this.numberOfBooks - 1,
      this.selectedBooks[bookId].read
        ? this.numberOfReadBooks - 1
        : this.numberOfReadBooks
    );

    localStorage.removeItem(bookId);
    delete this.selectedBooks[bookId];
    this.showBooks();
  }

  onDivClicked(targetDiv) {
    if (this.selectedBook) {
      this.selectedBook.removeAttribute("data-selected");
    }

    targetDiv.dataset.selected = true;
    this.selectedBook = targetDiv;

    const selectedBookId = this.selectedBook.id;
    const eventSelectedBook = new CustomEvent("bookSelect", {
      detail: this.selectedBooks[selectedBookId],
    });
    document.dispatchEvent(eventSelectedBook);
  }

  processSelectedBook(book) {
    if (!this.selectedBooks[book.id]) {
      this.updateNumberOfBooks(this.numberOfBooks + 1);
      this.selectedBooks[book.id] = book;
      BookStorage.save(this.selectedBooks);
    }
    this.showBooks();
  }

  updateNumberOfBooks(
    numberOfBooks,
    numberOfReadBooks = this.numberOfReadBooks
  ) {
    this.numberOfBooks = numberOfBooks;
    this.numberOfReadBooks = numberOfReadBooks;
    const stringHTML = `${numberOfBooks} book(s), ${this.numberOfReadBooks} read`;
    this.totalInfo.innerText = stringHTML;
  }

  showBooks() {
    let stringHTML = "";
    for (let [index, book] of Object.entries(this.selectedBooks)) {
      const isRead = book.read ? "data-read=true" : "";
      const isReadForButton = book.read ? "Mark as unread" : "Mark as read";
      stringHTML += `
        <div class="to-read-section__book-list__item" id="${book.id}" ${isRead}>
            <p class="to-read-section__book-list__item__title">${book.title}</p>
            <p class="to-read-section__book-list__item__subtitle">${
              book.subtitle || ""
            }</p>
            <p class="to-read-section__book-list__item__author">${
              book.author_name || "unknown"
            }</p>
            <div class="to-read-section__book-list__item__buttons">
                <button class="to-read-section__book-list__item__buttons__mark-button">${isReadForButton}</button>
                <button class="to-read-section__book-list__item__buttons__remove-button">Remove from list</button>
            </div>
        </div>
      `;
    }
    this.bookList.innerHTML = stringHTML;
  }
}
