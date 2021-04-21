import { ErrorHandler } from "./errorHandler";
import { SearchSection } from "./searchSection";

export class DescriptionSection {
  processSelectedBook(item) {
    this.showDescription(item);
  }

  showDescription(book) {
    const descriptionSection = document.getElementById("description-section");

    const bookHTML = `
      <h2 id="description-section__title">${book.title}</h2>
      <h3 id="description-section__subtitle">${book.subtitle || ""}</h3>
      <div id="description-section__info">
      <p>Languages available: ${book.language || "unknown"}</p>
      <p>Full text available: ${book.has_fulltext ? "Yes" : "No"}</p>
      <p>First publish year: ${book.first_publish_year || "unknown"}</p>
      <p>Year published: ${book.publish_year || "unknown"}</p>
      </div>
      <button id="description-section__add-button">Add this book to Read List</button>
    `;
    descriptionSection.innerHTML = bookHTML;
  }
}
