import React, {useContext} from 'react'
import {Link} from 'react-router-dom'
import { useGlobalContext } from '../context/Context'
import { useSelector } from 'react-redux'


function BtnRender({product, deleteProduct}) {
    const {types, setTypes, rerender, setRerender, state, setProduct, put_in_bag} = useGlobalContext()
    const auth = useSelector(state => state.auth)

    
    return (
        <div className="row_btn">
            {
                auth.isVendor ? 
                <>
                    <Link id="btn_buy" to="#!" 
                    onClick={() =>deleteProduct(product._id, product.photo.public_id)}>
                        Delete
                    </Link>
                    <Link id="btn_view" to={`/editprod/${product._id}`}>
                        Edit
                    </Link>
                    <Link id="btn_view2" to={`/about/${product._id}`}>
                        View
                    </Link>
                </>
                : <>
                    {
                    (auth.isClient && product.nr > 0) ?
                    <Link id="btn_buy" to="#!" onClick={() => put_in_bag(product)}>
                        Buy
                    </Link> :
                    <p style={{ color: 'red', opacity: '1' }}>OUT OF STOCK</p>
                    }
                    <Link id="btn_view" to={`/about/${product._id}`}>
                        View
                    </Link>
                </>
            }
                
        </div>
    )
}

export default BtnRender