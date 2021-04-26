export class DescriptionSection {
  constructor(selectedBooks) {
    this.selectedBooks = selectedBooks;
    this.selectedBookId = "";

    document.addEventListener("onRemoveClick", (event) => {
      this.onRemoveClicked(event);
    });
  }

  onRemoveClicked(event) {
    if (event.detail == this.selectedBookId) {
      const addButton = document.getElementById(
        "description-section__add-button"
      );
      addButton.dataset.disable = false;
    }
  }

  processSelectedBook(item) {
    this.showDescription(item);
  }

  showDescription(book) {
    const descriptionSection = document.getElementById("description-section");
    const bookDiv = document.getElementById(book.id);
    this.selectedBookId = book.id;

    const bookHTML = `
      <h2 id="description-section__title">${book.title}</h2>
      <h3 id="description-section__subtitle">${book.subtitle || ""}</h3>
      <div id="description-section__info">
      <p>Author: ${book.author_name || "unknown"}</p>
      <p>Languages available: ${book.language || "unknown"}</p>
      <p>Full text available: ${book.has_fulltext ? "Yes" : "No"}</p>
      <p>First publish year: ${book.first_publish_year || "unknown"}</p>
      <p>Year published: ${book.publish_year || "unknown"}</p>
      </div>
      <button id="description-section__add-button">Add this book to Read List</button>
    `;
    descriptionSection.innerHTML = bookHTML;

    const addButton = document.getElementById(
      "description-section__add-button"
    );
    const eventAddBook = new CustomEvent("addBook", {
      detail: book,
    });

    if (this.selectedBooks[bookDiv.id]) {
      addButton.dataset.disable = true;
    }
    addButton.addEventListener("click", () => {
      if (!this.selectedBooks[bookDiv.id]) {
        addButton.dataset.disable = true;
        book.read = false;
        document.dispatchEvent(eventAddBook);
      }
    });
  }
}
