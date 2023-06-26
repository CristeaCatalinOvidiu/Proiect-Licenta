import React from 'react'
import BtnRender from './Overlap'

export default function SingleItemDescriber({product, isAdmin, deleteProduct, handleCheck}) {
  return (
    <div style = {{opacity: `${product.nr === 0 && '0.4'}`}} className="product_card" >
            {
                isAdmin && <input type="checkbox" checked={product.checked}
                onChange={() => handleCheck(product._id)} />
            }
            <img src={product.photo.url} alt="" />

            <div className="product_box">
                <h2 title={product.type}>{product.type}</h2>
                <span> {product.offer} $ </span>
                <p>{product.about}</p>
            </div>

            
            <BtnRender product={product} deleteProduct={deleteProduct} />
        </div>
  )
}
