import { useEffect, useState } from "react";
import {
  useApolloClient,
  useQuery,
  useMutation,
  useSubscription,
} from "@apollo/client";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import Login from "./components/Login";
import TokenContext from "./hooks/TokenContext";
import Recommend from "./components/Recommend";
import { BOOK_ADDED } from "./queries";

const App = () => {
  const [page, setPage] = useState("authors");
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const client = useApolloClient();

  useEffect(() => {
    if (window.localStorage.getItem("bookApp-user-token")) {
      setToken(window.localStorage.getItem("bookApp-user-token"));
    }
  }, []);

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      console.log(data);
      alert(`New Book '${data.data.bookAdded.title}' is added`);
    },
  });

  const logout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
  };

  return (
    <TokenContext.Provider value={{ token, setToken, setPage, user, setUser }}>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        {token ? (
          <>
            <button onClick={() => setPage("add")}>add book</button>
            <button onClick={() => setPage("recommend")}>recommend</button>
            <button onClick={logout}>logout</button>
          </>
        ) : (
          <button onClick={() => setPage("login")}>login</button>
        )}
      </div>

      <Authors show={page === "authors"} />

      <Books show={page === "books"} />

      <NewBook show={page === "add"} />

      <Recommend show={page === "recommend"} />

      <Login show={page === "login"} />
    </TokenContext.Provider>
  );
};

export default App;
