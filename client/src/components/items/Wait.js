import React from 'react'
import { useGlobalContext } from '../context/Context';

export default function Filter() {


    const {types, setTypes, rerender, setRerender, state, product, setProduct} = useGlobalContext()
  return (
      <div className="filter_menu">
            <div className="row">
                <span>Filters: </span>
                <select  value={product.typo} onChange={(e) => {
        setProduct({...product, typo: e.target.value, searchbymethod:''})
    }} >
                    <option value=''>All Products</option>
                    {
                        types?.map(type => (
                            <option value={"typo=" + type._id} key={type._id}>
                                {type.newp_t}
                            </option>
                        ))
                    }
                </select>
            </div>

            <input type="text" value={product.searchbymethod} placeholder="Find product !"
            onChange={e => setProduct({...product, searchbymethod:e.target.value.toLowerCase()})} />

            <div className="row sort">
                <span>Sort By: </span>
                <select value={product.sortbymethod} onChange={e => setProduct({...product, sortbymethod: e.target.value})} >
                    <option value=''>Newest</option>
                    <option value='sort=oldest'>Oldest</option>
                    <option value='sort=-nr'>Best sales</option>
                    <option value='sort=-offer'>Offer: Hight-Low</option>
                    <option value='sort=offer'>Offer: Low-Hight</option>
                </select>
            </div>
        </div>
  )
}
