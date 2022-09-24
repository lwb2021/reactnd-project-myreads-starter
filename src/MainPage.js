import Shelf from "./Shelf";
import React, { useEffect, useState } from "react";
import { getAll } from "./BooksAPI";
import { trackPromise } from "react-promise-tracker";

const MainPage = () => {
  const CATEGORIES = ["currentlyReading", "read", "wantToRead"];
  const [currentlyReadBooks, setCurrentlyReadBooks] = useState([]);
  const [readBooks, setReadBooks] = useState([]);
  const [wantToReadBooks, setWantToReadBooks] = useState([]);

  useEffect(() => {
    async function fetchBooks() {
      const response = await getAll();
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
    trackPromise(fetchBooks());
  }, []);

  return (
    <div className="list-books">
      <div className="list-books-title">
        <h1>MyReads</h1>
      </div>
      <div className="list-books-content">
        <div>
          <Shelf title="Currently Reading" books={currentlyReadBooks} />
          <Shelf title="Read" books={readBooks} />
          <Shelf title="Want To Read" books={wantToReadBooks} />
        </div>
      </div>
      <div className="open-search">
        <button onClick={() => this.setState({ showSearchPage: true })}>
          Add a book
        </button>
      </div>
    </div>
  );
};

export default MainPage;
