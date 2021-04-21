import { config } from "./config";
import * as ErrorHandler from "./errorHandler";

export class FetchApi {
  search(query, page = 1) {
    const url = `${config.api}?q=${query}&page=${page}`;

    return fetch(url).then(
      (result) => result.json(),
      (error) => ErrorHandler.handleError(error)
    );
  }
}
