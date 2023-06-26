import React, {useContext} from 'react'
import { useGlobalContext } from '../context/Context'

function LoadMore() {
    const {types, setTypes, rerender, setRerender, state, product, setProduct} = useGlobalContext()

    return (
        <div className="load_more">
            {
                product.response < product.filter * 9 ? ""
                : <button onClick={() => setProduct({...product, filter:product.filter + 1})}>Load more</button>
            }
        </div>
    )
}

export default LoadMore