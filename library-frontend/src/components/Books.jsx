import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";

import { ALL_BOOKS } from "./queries";

const Books = (props) => {
  const [genre, setGenre] = useState('')
  
  const result = useQuery(ALL_BOOKS)
  
  if (!props.show) {
    return null
  }
  

  if (result.loading) {
    return <div>loading...</div>
  }

  const books = result.data.allBooks
  const genres = books.reduce((acc, book) => {
    book.genres.forEach(genre => {
      if (!acc.includes(genre)) {
        acc.push(genre)
      }
    })
    return acc
  }, [])

  

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
          {books.map((a) => {
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
