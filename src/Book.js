import React, { useEffect } from "react";

const Book = ({ book, shelfIndex, moveBook }) => {
  const WIDTH = 128;
  const HEIGHT = 193;

  function onSelect(event) {
    const prevCategory = book.shelf;
    const currCategory = event.currentTarget.value;
    if (currCategory !== prevCategory) {
      // Change the book's shelf to the current shelf
      book.shelf = currCategory;
      moveBook(book, prevCategory, currCategory);
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
