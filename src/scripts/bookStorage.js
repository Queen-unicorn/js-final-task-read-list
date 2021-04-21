export class BookStorage {
  static load() {
    return JSON.parse(localStorage.getItem("booksInReadList") || "{}");
  }

  static save(books) {
    localStorage.setItem("booksInReadList", JSON.stringify(books));
  }
}
