import { useQuery } from "@apollo/client";
import { CURRENT_USER, ALL_BOOKS } from "./queries";
import { useEffect } from "react";

const Recommend = (props) => {
  const currentUserResult = useQuery(CURRENT_USER)
  const bookResult = useQuery(ALL_BOOKS, {
    variables: {genre: ""}
  })

  if (!props.show) {
    return null
  }
  
  if (currentUserResult.loading || bookResult.loading) {
    return <div>loading...</div>
  }

  const genre = currentUserResult.data.me.favoriteGenre

  const books = bookResult.data.allBooks

  
  return <div>
    <h2>Recommendations</h2>
    <div>books in your favorite genre <strong>{genre}</strong></div>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => {
            if (genre && a.genres.includes(genre)) {
              return (
              <tr key={a.title}>
                  <td>{a.title}</td>
                  <td>{a.author.name}</td>
                  <td>{a.published}</td>
                </tr>
              )
            }
          }
          )}
        </tbody>
      </table>
  </div>
}

export default Recommend
