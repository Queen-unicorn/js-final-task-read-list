import { ErrorHandler } from "./errorHandler";

export class SearchSection {
  constructor(api) {
    this.searchSection = document.getElementById("search-section__book-list");
    this.api = api;
    this.currentBooksOnPage = [];

    this.query = "";
    this.currentPage = 0;
    this.selectedItem;

    this.searchInputField = document.getElementById(
      "search-section__form__input"
    );
    const searchSubmitButton = document.getElementById(
      "search-section__form__submit"
    );

    searchSubmitButton.addEventListener("click", () => this.search());
    this.searchInputField.addEventListener("keyup", (event) => {
      if (event.key == "Enter") this.search();
    });

    this.searchSection.addEventListener("click", (event) => {
      const target = event.target.closest(".search-section__book-list__item");
      if (!target) return;

      console.log(target);
      if (this.selectedItem) {
        this.selectedItem.removeAttribute("data-selected");
      }
      target.dataset.selected = true;
      this.selectedItem = target;
    });
  }

  search() {
    this.currentPage = 0;
    this.query = this.searchInputField.value;
    if (!this.query) return;

    this.fetchApi();
  }

  processSearchResult(fetchedBooks) {
    console.log(fetchedBooks);

    fetchedBooks.docs.forEach((book) => {
      book.id = book.key.split("/").pop();
    });

    this.currentBooksOnPage = fetchedBooks.docs;
    let booksHTML = "";

    for (let [index, book] of Object.entries(this.currentBooksOnPage)) {
      booksHTML += `
        <div class="search-section__book-list__item">
            <p class="search-section__book-list__item__title">${book.title}</p>
            <p class="search-section__book-list__item__subtitle">${
              book.subtitle || ""
            }</p>
            <p class="search-section__book-list__item__language">(${
              book.language || "unknown"
            })</p>
        </div>
      `;
    }
    this.searchSection.innerHTML = booksHTML;
    this.showSearchFooter(fetchedBooks.numFound);
  }

  showSearchFooter(foundBooksNum) {
    const searchFooter = document.getElementById("search-section__info");
    const footer = `
        <div id="search-section__info__numbers">
            <p>Found: ${foundBooksNum}</p>
            <p>Start: ${this.currentPage * 100}</p>
            <p>Page size: 100</p>
        </div>
        <div id="search-section__info__navigation">
            <p id="search-section__info__navigation__prev-button">Previous results</p>
            <p id="search-section__info__navigation__next-button">Next results</p>
        </div>
    `;
    searchFooter.innerHTML = footer;

    const prevButton = document.getElementById(
      "search-section__info__navigation__prev-button"
    );
    const nextButton = document.getElementById(
      "search-section__info__navigation__next-button"
    );

    if (this.currentPage === 0) {
      prevButton.dataset.disabled = true;
    }
    if (this.currentPage === Math.ceil(foundBooksNum / 100) - 1) {
      nextButton.dataset.disabled = true;
    }

    prevButton.addEventListener("click", () => {
      if (prevButton.dataset.disabled) return;
      this.goToPage(this.currentPage - 1);
    });

    nextButton.addEventListener("click", () => {
      if (nextButton.dataset.disabled) return;
      this.goToPage(this.currentPage + 1);
    });
  }

  fetchApi() {
    this.api.search(this.query, this.currentPage + 1).then(
      (fetchedBooks) => {
        this.processSearchResult(fetchedBooks);
      },
      (error) => ErrorHandler(error)
    );
  }

  goToPage(currentPage) {
    this.currentPage = currentPage;
    this.fetchApi();
  }
}
