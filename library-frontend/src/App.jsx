import { useEffect, useState,  createContext} from "react";
import { useApolloClient } from "@apollo/client";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import Login from "./components/Login";
import TokenContext from "./hooks/TokenContext";

const App = () => {
  const [page, setPage] = useState("authors");
  const [token, setToken] = useState(null)
  const client = useApolloClient()

  useEffect(() => {
    if ( window.localStorage.getItem("bookApp-user-token")) {
      setToken(window.localStorage.getItem("bookApp-user-token"))
    }
  }, [])

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  return (
    <TokenContext.Provider value={{token, setToken, setPage}}>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        {token
          ? <>
            <button onClick={() => setPage("add")}>add book</button>
            <button onClick={logout}>logout</button>
            </>
          : <button onClick={() => setPage("login")}>login</button>}
      </div> 

      <Authors show={page === "authors"} /> 

      <Books show={page === "books"} />

      <NewBook show={page === "add"} />

      <Login show={page === 'login'}/>
    </TokenContext.Provider>
  );
};

export default App;
