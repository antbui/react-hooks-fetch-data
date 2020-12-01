import { useState, useEffect, useReducer } from 'react'
import axios from 'axios'

const ACTIONS = {
  FETCH_SUCCESS: 'fetch_success',
  FETCH_INIT: 'fetch_init',
  FETCH_FAILURE: 'fetch_failure',
}

const dataFetchReducer = (state, action) => {
  const { type, payload } = action
  switch (type) {
    case ACTIONS.FETCH_INIT:
      return {
        ...state,
        isLoading: true,
        isError: false,
      }
    case ACTIONS.FETCH_FAILURE:
      return {
        ...state,
        isLoading: false,
        isError: true,
      }
    case ACTIONS.FETCH_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: payload,
      }
    default:
      throw new Error()
  }
}

export default function useDataApi(initialUrl, initialData) {
  const [state, dispatch] = useReducer(dataFetchReducer, {
    isError: false,
    isLoading: false,
    data: initialData,
  })
  const [url, setUrl] = useState(initialUrl)

  useEffect(() => {
    let didCancel = false
    const fetchData = async () => {
      dispatch({ type: ACTIONS.FETCH_INIT })
      try {
        const result = await axios(url)

        if (!didCancel) {
          dispatch({ type: ACTIONS.FETCH_SUCCESS, payload: result.data })
        }
      } catch {
        if (!didCancel) {
          dispatch({ type: ACTIONS.FETCH_FAILURE })
        }
      }
    }
    fetchData()

    return () => {
      didCancel = true
    }
  }, [url])

  return [state, setUrl]
}
