import * as ErrorHandler from "./errorHandler";

export class SearchSection {
  constructor(api) {
    this.searchSection = document.getElementById("search-section__book-list");
    this.api = api;
    this.currentBooksOnPage = [];

    this.query = "";
    this.currentPage = 0;
    this.foundBooksNum = 0;
    this.selectedBookItem;

    this.searchInputField = document.getElementById(
      "search-section__form__input"
    );
    this.searchSubmitButton = document.getElementById(
      "search-section__form__submit"
    );

    this.searchSubmitButton.addEventListener("click", () => {
      this.search();
    });
    this.searchInputField.addEventListener("keyup", (event) => {
      if (event.key == "Enter") {
        this.search();
      }
    });

    this.searchSection.addEventListener("click", (event) => {
      this.onBookItemClick(event);
    });

    this.searchSection.addEventListener("scroll", (event) => {
      if (
        this.searchSection.scrollTop + this.searchSection.clientHeight >=
        this.searchSection.scrollHeight
      ) {
        this.loadMoreBooks();
      }
    });
  }

  onBookItemClick(event) {
    const target = event.target.closest(".search-section__book-list__item");
    if (!target) return;

    if (this.selectedBookItem) {
      this.selectedBookItem.removeAttribute("data-selected");
    }
    target.dataset.selected = true;
    this.selectedBookItem = target;

    const selectedBookItemId = this.selectedBookItem.id;

    const eventSelectedBook = new CustomEvent("bookSelect", {
      detail: this.currentBooksOnPage[selectedBookItemId],
    });
    document.dispatchEvent(eventSelectedBook);
  }

  search() {
    this.currentPage = 0;
    this.query = this.searchInputField.value;
    if (!this.query) {
      this.searchInputField.dataset.isEmpty = true;
      return;
    } else {
      this.searchInputField.dataset.isEmpty = false;
    }

    this.searchSubmitButton.innerHTML = "Loading...";

    this.fetchApi(true);
  }

  loadMoreBooks() {
    this.currentPage++;
    if (this.currentPage >= this.foundBooksNum / 100) return;

    this.searchSubmitButton.innerHTML = "Loading...";

    this.fetchApi(false);
  }

  fetchApi(isNewQuery) {
    this.api.search(this.query, this.currentPage + 1).then(
      (fetchedBooks) => {
        this.processSearchResult(fetchedBooks, isNewQuery);
      },
      (error) => ErrorHandler.handleError(error)
    );
  }

  processSearchResult(fetchedBooks, isNewQuery) {
    this.searchSubmitButton.innerHTML = "Go";

    fetchedBooks.docs.forEach((book) => {
      book.id = book.key.split("/").pop();
    });

    if (isNewQuery) this.currentBooksOnPage = {};
    let booksHTML = "";

    for (let [index, book] of Object.entries(fetchedBooks.docs)) {
      this.currentBooksOnPage[book.id] = book;
      booksHTML += `
        <div class="search-section__book-list__item" id=${book.id}>

            <p class="search-section__book-list__item__title" data-index="${
              +index + fetchedBooks.start + 1
            }">${book.title}</p>
            <p class="search-section__book-list__item__subtitle">${
              book.subtitle || ""
            }</p>
            <p class="search-section__book-list__item__language">(${
              book.language || "unknown"
            })</p>
        </div>
      `;
    }
    if (isNewQuery) {
      this.searchSection.innerHTML = booksHTML;
    } else {
      this.searchSection.innerHTML += booksHTML;
    }
    this.foundBooksNum = fetchedBooks.numFound;
    this.showSearchFooter();
  }

  showSearchFooter() {
    const searchFooter = document.getElementById("search-section__info");
    const footer = `
        <div id="search-section__info__numbers">
            <p>Found: ${this.foundBooksNum} book(s)</p>
        </div>
    `;
    searchFooter.innerHTML = footer;
  }
}
