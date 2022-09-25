import React, { useState } from "react";
import "./App.css";
import SearchPage from "./SearchPage";
import MainPage from "./MainPage";

const BooksApp = () => {
  // constructor() {
  //   super();
  //   this.state = {
  //     /**
  //      * TODO: Instead of using this state variable to keep track of which page
  //      * we're on, use the URL in the browser's address bar. This will ensure that
  //      * users can use the browser's back and forward buttons to navigate between
  //      * pages, as well as provide a good URL they can bookmark and share.
  //      */
  //     showSearchPage: false,
  //   };
  // }

  const [state, setState] = useState(false);

  function switchPage() {
    setState(!state);
  }

  return (
    <div className="app">
      {!state ? (
        <SearchPage switchPage={switchPage} />
      ) : (
        <MainPage switchPage={switchPage} />
      )}
    </div>
  );
};

export default BooksApp;
