import { DescriptionSection } from "./descriptionSection";
import { SearchSection } from "./searchSection";

export class App {
  constructor(fetchApi) {
    let searchSection = new SearchSection(fetchApi);
    let descriptionSection = new DescriptionSection();
  }
}
