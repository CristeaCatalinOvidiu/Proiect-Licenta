import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { useGlobalContext } from '../context/Context'
import SingleItemDescriber from './SingleItemDescriber'




export default function About() {

    const {types, setTypes, rerender, setRerender, state,product, setProduct, put_in_bag} = useGlobalContext()
    const [currObj, setCurrObj] = React.useState([])
    const payload = useParams()
    const auth = useSelector(state => state.auth)
    
    useEffect(() => 
    {
        if(payload.id) {
            for(var i = 0; i < product.items.length; i++) {
                if(product.items[i]._id === payload.id) {


                   //console.log(product.items[i])
                    setCurrObj(product.items[i])
                    //console.log(currObj)
                    
                }
            } 
        }

    }, [payload.id, product.items])


  return (
      currObj.length === 0 ?
      null :
          <>
            <div className="detail">
                <img src={currObj.photo.url} alt="" />
                <div className="box-detail">
                    <div className="row">
                        <h2>{currObj.type}</h2>
                        <h6>#id: {currObj.iid}</h6>
                    </div>
                    <span>$ {currObj.offer}</span>
                    <p>{currObj.about}</p>
                    <p>{currObj.details}</p>
                    <p>Stock: {currObj.nr}</p>
                    {
                    (auth.isClient && currObj.nr > 0)  &&
                    <Link  className="cart"
                    to="#!" onClick={() => put_in_bag(currObj)}>
                        Buy Now
                    </Link> 
                    }
                    {
                    ((auth.isClient || auth.isVendor) && currObj.nr == 0) &&
                    <p style={{ color: 'red' }}>OUT OF STOCK</p>
                    }
                    
                </div>
            </div>

            <div>
                <h2>Related products</h2>
                <div className="products">
                    {
                        product.items.map(item => {


                            if(item.typo === currObj.typo)
                                return <SingleItemDescriber key={item._id} product={item} />
                            else 
                                return null

                           
                        })
                    }
                </div>
            </div>
        </>
    
    )
}
