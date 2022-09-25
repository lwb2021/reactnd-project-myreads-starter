import Shelf from "./Shelf";
import React, { useEffect, useState } from "react";
import { getAll } from "./BooksAPI";
import { trackPromise } from "react-promise-tracker";

const MainPage = ({ switchPage }) => {
  const CATEGORIES = ["currentlyReading", "read", "wantToRead"];
  const RESPONSE_KEY = "response";
  const [currentlyReadBooks, setCurrentlyReadBooks] = useState([]);
  const [readBooks, setReadBooks] = useState([]);
  const [wantToReadBooks, setWantToReadBooks] = useState([]);

  function moveBook(book, prevCategory, currCategory) {
    // Remove the book from the previous shelf
    if (prevCategory === CATEGORIES[0]) {
      setCurrentlyReadBooks(
        currentlyReadBooks.filter((item) => item.id !== book.id)
      );
    } else if (prevCategory === CATEGORIES[1]) {
      setReadBooks(readBooks.filter((item) => item.id !== book.id));
    } else if (prevCategory === CATEGORIES[2]) {
      setWantToReadBooks(wantToReadBooks.filter((item) => item.id !== book.id));
    }

    // Move the book to the new shelf
    if (currCategory === CATEGORIES[0]) {
      setCurrentlyReadBooks(currentlyReadBooks.concat(book));
    } else if (currCategory === CATEGORIES[1]) {
      setReadBooks(readBooks.concat(book));
    } else if (currCategory === CATEGORIES[2]) {
      setWantToReadBooks(wantToReadBooks.concat(book));
    }

    // Save the most updated shelves' information to the local storage
    const booksInfo = Array.prototype.concat(
      currentlyReadBooks,
      readBooks,
      wantToReadBooks
    );
    localStorage.setItem(RESPONSE_KEY, JSON.stringify(booksInfo));
  }

  useEffect(() => {
    function displayBooks(response) {
      const currentlyReading = response.filter(
        (item) => item.shelf === CATEGORIES[0]
      );
      setCurrentlyReadBooks(currentlyReading);
      const read = response.filter((item) => item.shelf === CATEGORIES[1]);
      setReadBooks(read);
      const wantToRead = response.filter(
        (item) => item.shelf === CATEGORIES[2]
      );
      setWantToReadBooks(wantToRead);
    }

    async function fetchBooks() {
      const response = await getAll();
      localStorage.setItem(RESPONSE_KEY, JSON.stringify(response));
      displayBooks(response);
    }

    // Retrieve the shelves' information from the local storage if it exists
    if (window.localStorage.getItem(RESPONSE_KEY) !== null) {
      const response = window.localStorage.getItem(RESPONSE_KEY);
      if (response) {
        displayBooks(JSON.parse(response));
      }
    } else {
      trackPromise(fetchBooks());
    }
  }, []);

  return (
    <div className="list-books">
      <div className="list-books-title">
        <h1>MyReads</h1>
      </div>
      <div className="list-books-content">
        <div>
          <Shelf
            title="Currently Reading"
            books={currentlyReadBooks}
            shelfIndex={CATEGORIES.indexOf("currentlyReading")}
            moveBook={moveBook}
          />
          <Shelf
            title="Read"
            books={readBooks}
            shelfIndex={CATEGORIES.indexOf("read")}
            moveBook={moveBook}
          />
          <Shelf
            title="Want To Read"
            books={wantToReadBooks}
            shelfIndex={CATEGORIES.indexOf("wantToRead")}
            moveBook={moveBook}
          />
        </div>
      </div>
      <div className="open-search">
        <button onClick={() => switchPage()}>Add a book</button>
      </div>
    </div>
  );
};

export default MainPage;
