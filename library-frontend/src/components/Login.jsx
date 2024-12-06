import { useMutation } from "@apollo/client";
import { useEffect, useState, useContext } from "react";
import TokenContext from "../hooks/TokenContext";
import { LOGIN } from "../queries";

const Login = (props) => {
  const { setToken, setPage } = useContext(TokenContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loginServive, result] = useMutation(LOGIN, {
    onError: (error) => {
      console.log(error);
    },
  });
  useEffect(() => {
    if (result.data) {
      setToken(result.data.login.value);
      window.localStorage.setItem(
        "bookApp-user-token",
        result.data.login.value,
      );
      setPage("authors");
    }
  }, [result.data, setToken, setPage]);

  if (!props.show) {
    return null;
  }

  const submit = (event) => {
    event.preventDefault();
    loginServive({
      variables: { username, password },
    });

    setUsername("");
    setPassword("");
  };

  return (
    <form onSubmit={submit}>
      <div>
        name{" "}
        <input
          type="text"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password{" "}
        <input
          type="password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  );
};

export default Login;
