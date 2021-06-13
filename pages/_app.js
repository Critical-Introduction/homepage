import "../styles/globals.css";
import React, { useState } from "react";
import { Header } from "../components/navigation/Header";
import { loggedInContext } from "../state/loggedInContext";

function MyApp({ Component, pageProps }) {
  const [loggedIn, setLoggedIn] = useState(false);
  return (
    <div>
      <loggedInContext.Provider value={{ loggedIn, setLoggedIn }}>
        <Header />
        <Component {...pageProps} />
      </loggedInContext.Provider>
    </div>
  );
}

export default MyApp;
