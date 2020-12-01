import { useState } from 'react'
import './App.css'
import useDataApi from './hooks/useDataApi'
import useHackerNewApi from './hooks/useHackerNewApi'

function App() {
  const [query, setQuery] = useState('redux')
  // const [{ data, isLoading, isError }, doFetch] = useHackerNewApi(`https://hn.algolia.com/api/v1/search?query=redux`, {
  //   hits: [],
  // })
  const [{ data, isLoading, isError }, doFetch] = useDataApi(`https://hn.algolia.com/api/v1/search?query=redux`, {
    hits: [],
  })
  return (
    <>
      <form
        onSubmit={(event) => {
          event.preventDefault()
          doFetch(`https://hn.algolia.com/api/v1/search?query=${query}`)
        }}
      >
        <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} />
        <button type="submit">Search</button>
      </form>
      {isError && <div>Something went wrong ...</div>}
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <ul>
          {data.hits.map((item) => (
            <li key={item.objectID}>
              <a href={item.url}>{item.title}</a>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

export default App
