import React, { useEffect, useState } from "react";
import { RESPONSE_KEY_MAP, CATEGORIES } from "./constants";

const Book = ({
  book,
  shelfIndex,
  addBook,
  moveBook,
  setSearchResults,
  onSearchPage,
}) => {
  const WIDTH = 128;
  const HEIGHT = 193;
  const DELETE = "delete";
  const NONE_OPTION_INDEX = 4;
  const CHECKMARK_ID = `checkmark_${book.id}`;
  const [optionStatus, setOptionStatus] = useState(false);

  function onSelect(event) {
    // undefined means this book is from the search result
    const prevCategory = book.shelf === undefined ? undefined : book.shelf;
    const currCategory = event.currentTarget.value;
    moveBook(book, prevCategory, currCategory);

    if (currCategory === DELETE) {
      /*
        delete the book
      */
      const answer = window.confirm("Do you want to delete it?");
      if (answer) {
        // Remove the book from the bookSet
        const bookSet = localStorage
          .getItem("bookSet")
          .split(",")
          .filter((item) => item.id !== book.id);
        localStorage.setItem("bookSet", JSON.stringify([...bookSet]));

        // Remove the book from the downloaded cache
        const downloadedCache = new Map(
          JSON.parse(localStorage.getItem(RESPONSE_KEY_MAP.downloadedResponse))
        );

        for (let pair of downloadedCache) {
          if (pair[0] === book.id) {
            downloadedCache.delete(pair[0]);
          }
        }

        localStorage.setItem(
          RESPONSE_KEY_MAP.downloadedResponse,
          JSON.stringify(Array.from(downloadedCache.entries()))
        );

        // Mark the book as unchecked
        const checkmark = document.getElementById(CHECKMARK_ID);
        checkmark.style.visibility = "hidden";
      }
    } else if (currCategory !== prevCategory) {
      // initialize the cache for downloaded books
      let downloadedCache = new Map();
      if (!localStorage.getItem(RESPONSE_KEY_MAP.downloadedResponse))
        localStorage.setItem(
          RESPONSE_KEY_MAP.downloadedResponse,
          JSON.stringify(Array.from(downloadedCache.entries()))
        );
      else {
        downloadedCache = new Map(
          JSON.parse(localStorage.getItem(RESPONSE_KEY_MAP.downloadedResponse))
        );
      }

      downloadedCache.set(book.id, currCategory);

      localStorage.setItem(
        RESPONSE_KEY_MAP.downloadedResponse,
        JSON.stringify(Array.from(downloadedCache.entries()))
      );

      // Record the downloaded book
      if (!prevCategory) {
        addBook(book);

        // Mark the book as checked
        const checkmark = document.getElementById(CHECKMARK_ID);
        checkmark.style.visibility = "visible";
      }
    }
    // Change the book's dropdown menu
    const elem = document.getElementById(book.id);
    // Plus 1 since the index 0 of the dropdown is a disabled option
    elem.options.selectedIndex =
      currCategory === DELETE
        ? NONE_OPTION_INDEX
        : CATEGORIES.indexOf(currCategory) + 1;
    if (currCategory === DELETE) {
      setOptionStatus(false);
    } else setOptionStatus(true);
  }

  useEffect(() => {
    // Set the default selected option of all the dropdown menus
    (function setDefaultSelected() {
      const elem = document.getElementById(book.id);
      // Plus 1 since the index 0 of the dropdown is a disabled option
      const index = onSearchPage ? NONE_OPTION_INDEX : shelfIndex + 1;
      elem.options.selectedIndex = index;
    })();

    // Set the default visibility of all checkmarks
    (function setCheckmarkVisibility() {
      const checkElement = document.getElementById(CHECKMARK_ID);
      const downloadedCache = new Map(
        JSON.parse(localStorage.getItem(RESPONSE_KEY_MAP.downloadedResponse))
      );

      // Mark the book as downloaded
      if (downloadedCache && downloadedCache.has(book.id) && onSearchPage) {
        checkElement.style.visibility = "visible";
      }

      // Label the category for the downloaded book
      if (onSearchPage && downloadedCache.has(book.id)) {
        const elem = document.getElementById(book.id);
        elem.options.selectedIndex =
          CATEGORIES.indexOf(downloadedCache.get(book.id)) + 1;
        setOptionStatus(true);
      }
    })();
  }, []);

  return (
    <div className="book">
      <div className="book-top">
        <div
          className="book-cover"
          style={{
            width: WIDTH,
            height: HEIGHT,
            backgroundImage:
              `${book.imageLinks}` !== "undefined"
                ? `url("${book.imageLinks.thumbnail}")`
                : `url(undefined)`,
          }}
        ></div>
        <img
          id={`checkmark_${book.id}`}
          className="checkmark"
          alt="checkmark"
          src="checkmark.jpeg"
        />
        <div className="book-shelf-changer">
          <select onChange={onSelect} id={book.id}>
            <option value="move" disabled>
              Move to...
            </option>
            <option value="currentlyReading" disabled={optionStatus}>
              Currently Reading
            </option>
            <option value="read" disabled={optionStatus}>
              Read
            </option>
            <option value="wantToRead" disabled={optionStatus}>
              Want to Read
            </option>
            {onSearchPage ? (
              <option value="none" disabled>
                None
              </option>
            ) : (
              <option value="delete">Delete</option>
            )}
          </select>
        </div>
      </div>
      <div className="book-title">{book.title}</div>
      <div className="book-authors">{book.authors}</div>
    </div>
  );
};

export default Book;
