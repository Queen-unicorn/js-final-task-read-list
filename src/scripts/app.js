import { DescriptionSection } from "./descriptionSection";
import { SearchSection } from "./searchSection";
import { ToReadList } from "./toReadList";

export class App {
  constructor(fetchApi) {
    const searchSection = new SearchSection(fetchApi);
    const descriptionSection = new DescriptionSection();
    const toReadList = new ToReadList();

    document.addEventListener("bookSelect", (event) =>
      descriptionSection.processSelectedBook(event.detail)
    );

    document.addEventListener("addBook", (event) => {
      toReadList.processSelectedBook(event.detail);
    });
  }
}
