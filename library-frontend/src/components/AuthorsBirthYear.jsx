import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import Select from "react-select";

import { EDIT_AUTHOR_BIRTHYEAR, ALL_AUTHORS } from "./queries";

const AuthorsBirthYear = ({ authors }) => {
  const [name, setName] = useState("");
  const [bornYear, setBornYear] = useState("");

  const [editAuthorBornYear, result] = useMutation(EDIT_AUTHOR_BIRTHYEAR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  });

  const nameOptions = authors.map((a) => {
    return { value: a.name, label: a.name };
  });

  const submit = (event) => {
    event.preventDefault();

    editAuthorBornYear({
      variables: { name, setBornTo: Number(bornYear) },
    });

    setName("");
    setBornYear("");
  };

  useEffect(() => {
    if (result.data && result.data.editAuthor === null) {
      console.log("author not found");
    }
  }, [result.data]);

  return (
    <div>
      <h3>Set Birthyear</h3>
      <form onSubmit={submit}>
        <Select
          defaultValue={name}
          onChange={({ value }) => setName(value)}
          options={nameOptions}
        />
        <div>
          born{" "}
          <input
            type="number"
            value={bornYear}
            onChange={({ target }) => setBornYear(target.value)}
          />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  );
};

export default AuthorsBirthYear;
