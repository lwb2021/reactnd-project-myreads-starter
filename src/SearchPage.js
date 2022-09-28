import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { search } from "./BooksAPI";
import Shelf from "./Shelf";
import { trackPromise } from "react-promise-tracker";
import { SpinnerSearch } from "./Spinner";

const SearchPage = ({ RESPONSE_KEY_MAP, addBook, moveBook }) => {
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState([]);
  const [blankMsg, setBlankMsg] = useState("");
  const [prevSearchName, setPrevSearchName] = useState("");

  async function searchBook(query) {
    const responseKey = RESPONSE_KEY_MAP.searchResponse;
    const searchResultCache = localStorage.getItem(responseKey);

    // Retrieve from cache if the search result exists
    if (searchResultCache && query === prevSearchName) {
      setSearchResults(JSON.parse(searchResultCache));
    } else {
      try {
        const searchResult = await search(query);
        if (!localStorage.getItem("bookSet"))
          localStorage.setItem("bookSet", [...new Set()]);

        const bookSet = new Set(localStorage.getItem("bookSet").split(","));

        const filteredResult = searchResult.filter(
          (book) => !bookSet.has(book.id)
        );

        // Display the search result to UI
        setSearchResults(filteredResult);

        // Add search result to local storage
        localStorage.setItem(responseKey, JSON.stringify(filteredResult));
      } catch (err) {
        console.log(err);
        setSearchResults([]);
        setBlankMsg("Please try a different search keyword.");
      }
    }
  }

  function getTitle(name) {
    return `Results of "${name}"`;
  }

  function handleClick(searchName) {
    setPrevSearchName(getTitle(searchName));
    trackPromise(searchBook(searchName));
  }

  // Handle Enter key press
  function handleKeyDown(event) {
    if (event.key === "Enter") {
      const searchName = document.getElementById("input").value;
      setPrevSearchName(getTitle(searchName));
      trackPromise(searchBook(searchName));
    }
  }

  return (
    <div className="search-books">
      <div className="search-books-bar">
        <button
          className="close-search"
          onClick={() => {
            navigate("/");
          }}
        >
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
            onKeyDown={handleKeyDown}
          />
        </div>
        <button
          onClick={() => handleClick(document.getElementById("input").value)}
        >
          search
        </button>
      </div>
      <div className="search-books-results">
        {searchResults.length === 0 ? (
          <div className="bookshelf">
            <h2 className="bookshelf-title">{prevSearchName}</h2>
            <h3>{blankMsg}</h3>
          </div>
        ) : (
          <Shelf
            title={prevSearchName}
            books={searchResults}
            addBook={addBook}
            moveBook={moveBook}
            RESPONSE_KEY_MAP={RESPONSE_KEY_MAP}
            setSearchResults={setSearchResults}
          />
        )}
        <SpinnerSearch />
      </div>
    </div>
  );
};

export default SearchPage;
