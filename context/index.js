import { createContext, useReducer } from 'react'
// import { ADD_FRUIT } from "./actionTypes";

useEffect(() => {
  async function getPageData() {
    // localStorage.theme = 'light'
    //   location.assign('/')
    // if (sessionStorage.getItem('item_key')) sessionStorage.removeItem('item_key') // remove contract key session

    const apiUrlEndpoint = `https://conan.ai/_functions/clibCategoryList`
    const response = await fetch(apiUrlEndpoint)
    const res = await response.json()
    const details = await res.items
    console.log('details', details)
    setItems(details)
    // const data = fetchedData.contractData
  }
  getPageData()
}, [])
//initial state
const initialState = {
  productList: {
    computer: [
      { name: 'pc', price: 100 },
      { name: 'note-book', price: 200 }
    ],
    fruits: [
      { name: 'banana', price: 10 },
      { name: 'apple', price: 20 }
    ]
  }
}

// create context
const Context = createContext({})

// create reducer
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_FRUIT:
      return {
        ...state,
        productList: {
          ...state.productList,
          fruits: [...state.productList.fruits, action.payload]
        }
      }
    default:
      return state
  }
}

// create Provider component (High order component)
const Provider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const value = { state, dispatch }
  return <Context.Provider value={value}>{children}</Context.Provider>
}

export { Context, Provider }
