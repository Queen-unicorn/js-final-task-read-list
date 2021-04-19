import { ErrorHandler } from "./errorHandler";

export class App {
  constructor(fetchApi) {
    this.searchSection = document.getElementById("search-section__book-list");
    this.descriptionSection = document.getElementById("descriprion-section");

    this.currentBooksOnPage = [];

    const searchInputField = document.getElementById(
      "search-section__form__input"
    );
    const searchSubmitButton = document.getElementById(
      "search-section__form__submit"
    );

    searchSubmitButton.addEventListener("click", () => {
      const query = searchInputField.value;
      if (!query) return;

      fetchApi.search(query).then(
        (fetchedBooks) => {
          this.processSearchResult(fetchedBooks);
        },
        (error) => ErrorHandler(error)
      );
    });
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
              book.language
            })</p>
        </div>
      `;
    }
    this.searchSection.innerHTML = booksHTML;
  }
}
