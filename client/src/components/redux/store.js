import React from 'react'
import {createStore} from 'redux'
import rootReducer from './reducers/index.js'
import {Provider} from 'react-redux'
 

const store = createStore(rootReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

export default function DataProvider({children}) {
    return (
        <Provider store={store}>
            {children}
        </Provider>
    )
}
