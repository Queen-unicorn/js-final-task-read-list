import { BookStorage } from "./bookStorage";

export class ToReadList {
  constructor() {
    this.bookList = document.getElementById("to-read-section__book-list");
    this.numberOfReadBooks = 0;
    this.selectedBook;

    this.totalInfo = document.getElementById(
      "to-read-section__header__total-info"
    );
    this.selectedBooks = BookStorage.load();
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
    targetDiv.dataset.read = true;

    this.selectedBooks[targetDiv.id].read = true;
    BookStorage.save(this.selectedBooks);
  }

  onRemoveClicked(targetRemoveButton) {
    const targetDiv = targetRemoveButton.closest(
      ".to-read-section__book-list__item"
    );
    localStorage.removeItem(targetDiv.id);
    delete this.selectedBooks[targetDiv.id];
    this.showBooks();
    this.updateNumberOfBooks(this.numberOfBooks - 1);
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

  updateNumberOfBooks(numberOfBooks) {
    this.numberOfBooks = numberOfBooks;
    const stringHTML = `${numberOfBooks} book(s), ${this.numberOfReadBooks} read`;
    this.totalInfo.innerText = stringHTML;
  }

  showBooks() {
    let stringHTML = "";
    for (let [index, book] of Object.entries(this.selectedBooks)) {
      const isRead = book.read ? "data-read" : "";
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
                <button class="to-read-section__book-list__item__buttons__mark-button">Mark as read</button>
                <button class="to-read-section__book-list__item__buttons__remove-button">Remove from list</button>
            </div>
        </div>
      `;
    }
    this.bookList.innerHTML = stringHTML;
  }
}
