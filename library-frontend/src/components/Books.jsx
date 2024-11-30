import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";

import { ALL_BOOKS } from "./queries";

const Books = (props) => {
  const [genre, setGenre] = useState('')
  
  const allBookResult = useQuery(ALL_BOOKS, {
    variables: {genre: ""}
  })
  const filterBookResult = useQuery(ALL_BOOKS,{
    variables: {genre}
  })
  
  if (!props.show) {
    return null
  }
  

  if (allBookResult.loading || filterBookResult.loading) {
    return <div>loading...</div>
  }

  const allBooks = allBookResult.data.allBooks
  const genres = allBooks.reduce((acc, book) => {
    book.genres.forEach(genre => {
      if (!acc.includes(genre)) {
        acc.push(genre)
      }
    })
    return acc
  }, [])

  const filterBooks = filterBookResult.data.allBooks

  return (
    <div>
      <h2>Books</h2>
      { (genre !== '') && <div>in genre <strong>{genre}</strong></div> }
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {filterBooks.map((a) => {
            if (genre==='' || a.genres.includes(genre)) {
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
      <div>
        {genres.map(genre => {
          return <button key={genre} onClick={ () => {
            setGenre(genre)
          }}>{genre}</button>
        })}
      <button onClick={() => setGenre('')}>all genres</button>
      </div>
    </div>
  )
}

export default Books
