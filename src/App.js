import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import SearchPage from "./SearchPage";
import MainPage from "./MainPage";

const BooksApp = () => {
  const CATEGORIES = ["currentlyReading", "read", "wantToRead"];
  let [currentlyReadBooks, setCurrentlyReadBooks] = useState([]);
  let [readBooks, setReadBooks] = useState([]);
  let [wantToReadBooks, setWantToReadBooks] = useState([]);
  const RESPONSE_KEY_MAP = {
    fetchResponse: "fetchResponse",
    searchResponse: "searchResponse",
  };
  // Pass the props to child components in bulk
  const multipleProps = {
    moveBook,
    addBook,
    CATEGORIES,
    RESPONSE_KEY_MAP,
    currentlyReadBooks,
    setCurrentlyReadBooks,
    readBooks,
    setReadBooks,
    wantToReadBooks,
    setWantToReadBooks,
  };

  function moveBook(book, prevCategory, currCategory) {
    /* 
    - Remove the book from the old shelf
    - prevCategory is undefined when it is from the search result
     */
    if (prevCategory && prevCategory === CATEGORIES[0]) {
      currentlyReadBooks = currentlyReadBooks.filter(
        (item) => item.id !== book.id
      );
      setCurrentlyReadBooks(currentlyReadBooks);
    } else if (prevCategory && prevCategory === CATEGORIES[1]) {
      readBooks = readBooks.filter((item) => item.id !== book.id);
      setReadBooks(readBooks);
    } else if (prevCategory && prevCategory === CATEGORIES[2]) {
      wantToReadBooks = wantToReadBooks.filter((item) => item.id !== book.id);
      setWantToReadBooks(wantToReadBooks);
    }

    // Move the book to the new shelf
    if (currCategory === CATEGORIES[0]) {
      currentlyReadBooks.push(book);
      setCurrentlyReadBooks(currentlyReadBooks);
    } else if (currCategory === CATEGORIES[1]) {
      readBooks.push(book);
      setReadBooks(readBooks);
    } else if (currCategory === CATEGORIES[2]) {
      wantToReadBooks.push(book);
      setWantToReadBooks(wantToReadBooks);
    }

    // Save the most updated shelves' information to the local storage
    const booksInfo = Array.prototype.concat(
      currentlyReadBooks,
      readBooks,
      wantToReadBooks
    );

    const responseKey = RESPONSE_KEY_MAP.fetchResponse;
    localStorage.setItem(responseKey, JSON.stringify(booksInfo));
  }

  // Record all the downloaded books
  function addBook(book) {
    const bookSet = new Set(localStorage.getItem("bookSet").split(","));
    bookSet.add(book.id);
    localStorage.setItem("bookSet", [...bookSet]);
  }

  return (
    <div className="app">
      <Routes>
        <Route path="/" exact element={MainPage(multipleProps)} />
        <Route path="/search" exact element={SearchPage(multipleProps)} />
        <Route path="/*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
};

export default BooksApp;
