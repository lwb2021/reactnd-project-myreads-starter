import Shelf from "./Shelf";
import { useNavigate } from "react-router-dom";
import React, { useEffect } from "react";
import { getAll } from "./BooksAPI";
import { trackPromise } from "react-promise-tracker";

const MainPage = ({
  CATEGORIES,
  RESPONSE_KEY_MAP,
  moveBook,
  currentlyReadBooks,
  setCurrentlyReadBooks,
  readBooks,
  setReadBooks,
  wantToReadBooks,
  setWantToReadBooks,
}) => {
  const navigate = useNavigate();

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
      try {
        const response = await getAll();
        localStorage.setItem(
          RESPONSE_KEY_MAP.fetchResponse,
          JSON.stringify(response)
        );

        // Add all book IDs to the set
        const bookSet = new Set(response.map((book) => book.id));
        localStorage.setItem("bookSet", [...bookSet]);
        displayBooks(response);
      } catch (err) {
        console.log(err);
      }
    }

    // Retrieve the shelves' information from the local storage if it exists
    if (localStorage.getItem(RESPONSE_KEY_MAP.fetchResponse)) {
      const response = localStorage.getItem(RESPONSE_KEY_MAP.fetchResponse);
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
        <button onClick={() => navigate("/search")}>Add a book</button>
      </div>
    </div>
  );
};

export default MainPage;
