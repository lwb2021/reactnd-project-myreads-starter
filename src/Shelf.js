import React from "react";
import Book from "./Book";
import { Spinner } from "./Spinner";

const Shelf = ({
  title,
  books,
  shelfIndex,
  addBook,
  moveBook,
  RESPONSE_KEY_MAP,
  setSearchResults,
}) => {
  return (
    <div className="bookshelf">
      <h2 className="bookshelf-title">{title}</h2>
      <div className="bookshelf-books">
        <ol className="books-grid">
          {books.map((book) => (
            <li key={book.id}>
              <Book
                book={book}
                shelfIndex={shelfIndex}
                addBook={addBook}
                moveBook={moveBook}
                RESPONSE_KEY_MAP={RESPONSE_KEY_MAP}
                setSearchResults={setSearchResults}
              />
            </li>
          ))}
        </ol>
        <Spinner />
      </div>
    </div>
  );
};

export default Shelf;
