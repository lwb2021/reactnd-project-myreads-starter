import React, { useEffect } from "react";

const Book = ({
  book,
  shelfIndex,
  addBook,
  moveBook,
  RESPONSE_KEY_MAP,
  setSearchResults,
}) => {
  const WIDTH = 128;
  const HEIGHT = 193;

  function onSelect(event) {
    // undefined means this book is from the search result
    const prevCategory = book.shelf === undefined ? undefined : book.shelf;
    const currCategory = event.currentTarget.value;

    if (currCategory !== prevCategory) {
      // Change the book's shelf to the current shelf
      book.shelf = currCategory;

      moveBook(book, prevCategory, currCategory);

      // Delete the downloaded book from the search result
      if (!prevCategory) {
        addBook(book);

        // Update search result to local storage
        const searchCache = localStorage.getItem(
          RESPONSE_KEY_MAP.searchResponse
        );

        const updatedSearchCache = JSON.parse(searchCache).filter(
          (item) => item.id !== book.id
        );

        setSearchResults(updatedSearchCache);

        localStorage.setItem(
          RESPONSE_KEY_MAP.searchResponse,
          JSON.stringify(updatedSearchCache)
        );
      }
    }
  }

  useEffect(() => {
    // Set the default selected option of all the dropdown menus
    (function setDefaultSelected() {
      const elem = document.getElementById(book.id);
      // Plus 1 since the index 0 of the dropdown is a disabled option
      elem.options.selectedIndex = shelfIndex + 1;
    })();
  });

  return (
    <div className="book">
      <div className="book-top">
        <div
          className="book-cover"
          style={{
            width: WIDTH,
            height: HEIGHT,
            backgroundImage: `url("${book.imageLinks.thumbnail}")`,
          }}
        ></div>
        <div className="book-shelf-changer">
          <select onChange={onSelect} id={book.id}>
            <option value="move" disabled>
              Move to...
            </option>
            <option value="currentlyReading">Currently Reading</option>
            <option value="read">Read</option>
            <option value="wantToRead">Want to Read</option>
          </select>
        </div>
      </div>
      <div className="book-title">{book.title}</div>
      <div className="book-authors">{book.authors}</div>
    </div>
  );
};

export default Book;
