import React, {useContext, useState} from 'react'
import { useGlobalContext } from '../context/Context';
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {useParams} from 'react-router-dom'
import Alert from '../body/auth/Alert';
import Waiting from '../page_components/Waiting';
import SingleItemDescriber from './SingleItemDescriber';
import axios from 'axios';
import LoadMore from './Helper';
import Filter from './Wait'



export default function Item() {


    const view ={
        waiting: false,
        verified:false
    }
    const token = useSelector(state => state.token)
    const auth = useSelector(state => state.auth)
    const {types, setTypes, rerender, setRerender, state, product, setProduct, waitprod} = useGlobalContext()
    const [alert, setAlert] = React.useState({show: false, msg:'', type:''})
    const [states, setStates] = React.useState(view)
    const showAlert = (show = false, type = '', msg = '') => {
    setAlert({ show, type, msg });
  };

  //console.log('john')
  //console.log(product.items)
  

  const chck = (iid) =>{

   product.items.forEach(item => {
       if(item._id === iid)
        item.checked = !item.checked 
       })
   setProduct({...product, items:product.items})

  }

  const chckall = () => {

    product.items.forEach(item => {
        item.checked = !states.verified  
    })
    setProduct({...product, items: product.items})
    setStates({...states, verified:!states.verified})

  }

  const delall = () => {

    product.items.forEach(item => {

        if(item.checked)
            delItem(item._id, item.photo.public_id)

    })

  }

  const delItem = async(iid, pbl_id) => {

    try {


        setStates({...states, waiting:true})

        
        const del_img = await axios.post('/api/delphoto', {public_id: pbl_id}, {
                headers: {Authorization: token}})
        
         if(window.confirm("Are you sure you want to delete this offer?")) {

            
            
              const delitem = await axios.delete(`/api/item/${iid}`, {
                headers: {Authorization: token}
            })
        
              
            
        }

      
        
        setProduct({...product, rerender: !product.rerender}) 
        setStates({...states, waiting:false})   

    } catch(error) {

        showAlert(true, 'danger', 'Problem while deleting item')

    }


  }

    







  return (
      waitprod ?
      <div>
          <Waiting></Waiting>
      </div>
      :

      
       
      product.items.length === 0  ? 

      <h1 style={{textAlign: "center", fontSize: "3rem"}}>Sorry, you don't have products published...</h1>

      :

       <>
        <Filter></Filter>
        
        {
            !auth.isVendor ?
            '' 
            :
            <div className="delete-all">
                <span>Select all</span>
                <input type="checkbox" checked={states.verified} onChange={chckall} />
                <button onClick={delall}>Delete ALL</button>
            </div>
    
        }

        <div className="products">
            {   
               
                
                product.items.map(item => {
                    
                    return <SingleItemDescriber  key={item._id} product={item}
                    isAdmin={auth.isVendor} deleteProduct={delItem} handleCheck={chck} />
                })  
                               
            } 
        </div>

        <LoadMore></LoadMore>
        
        </>
      
    
  )
}

