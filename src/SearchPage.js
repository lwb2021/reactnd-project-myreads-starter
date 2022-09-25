import React, { useState } from "react";
import { search } from "./BooksAPI";
import terms from "./SearchTerms";
import Shelf from "./Shelf";

const SearchPage = ({ switchPage }) => {
  const [searchResults, setSearchResults] = useState([]);

  async function searchBook(query) {
    const response = await search(query);
    console.log(response);
    setSearchResults(response);
  }

  return (
    <div className="search-books">
      <div className="search-books-bar">
        <button className="close-search" onClick={() => switchPage()}>
          Close
        </button>
        <div className="search-books-input-wrapper">
          {/*
                  NOTES: The search from BooksAPI is limited to a particular set of search terms.
                  You can find these search terms here:
                  https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md

                  However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
                  you don't find a specific author or title. Every search is limited by search terms.
                */}
          <input
            type="text"
            id="input"
            placeholder="Search by title or author"
          />
        </div>
        <button
          onClick={() => searchBook(document.getElementById("input").value)}
        >
          search
        </button>
      </div>
      <div className="search-books-results">
        {/* <ol className="books-grid"></ol> */}
        <Shelf
          title="Results"
          books={searchResults}
          // shelfIndex={CATEGORIES.indexOf("currentlyReading")}
          // moveBook={moveBook}
        />
      </div>
    </div>
  );
};

export default SearchPage;
