import { BookStorage } from "./bookStorage";
import { DescriptionSection } from "./descriptionSection";
import { SearchSection } from "./searchSection";
import { ToReadList } from "./toReadList";

export class App {
  constructor(fetchApi) {
    const selectedBooks = BookStorage.load();
    const searchSection = new SearchSection(fetchApi);
    const descriptionSection = new DescriptionSection(selectedBooks);
    const toReadList = new ToReadList(selectedBooks);

    document.addEventListener("bookSelect", (event) =>
      descriptionSection.processSelectedBook(event.detail)
    );

    document.addEventListener("addBook", (event) => {
      toReadList.processSelectedBook(event.detail);
    });
  }
}
