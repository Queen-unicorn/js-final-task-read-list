import { SearchSection } from "./searchSection";

export class App {
  constructor(fetchApi) {
    let searchSection = new SearchSection(fetchApi);
  }
}
