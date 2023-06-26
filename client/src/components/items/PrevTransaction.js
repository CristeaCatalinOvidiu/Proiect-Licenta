import React from 'react'
import { useGlobalContext } from '../context/Context'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'
import { useState } from 'react'
import Alert from '../body/auth/Alert'
import { useCallback } from 'react'
import Waiting from '../page_components/Waiting'



export default function PrevTransaction() {

    const {types, setTypes, rerender, setRerender, state, product, setProduct, history, setHistory, destinations, setDestinations, deliveryQueue, setDeliveryQueue, altertransaction, setAltertransaction, maptransaction, setMaptransaction, waiting, truck, setTruck} = useGlobalContext()
    
    
    
    const [destinationAddress, setDestinaionAddress] = useState('')
    const [transactionmid, setTransactionmid] = useState('')
    const [transactionid, setTransactionid] = useState('')
    const [callback1, setCallback1] = useState(false)
    const [destinationId, setDestinationId] = useState(new Map())
    const token = useSelector(state => state.token)
    const auth = useSelector(state => state.auth)
    
    
     const [alert, setAlert] = React.useState({show: false, msg:'', type:''})

     const showAlert = (show = false, type = '', msg = '') => {
    setAlert({ show, type, msg });
    

};
 
    

//console.log('tiem')

   // console.log(truck)


    
//history
    const handleClick = async(e, id, mid) => {

    
    

    // console.log('heree')
     //console.log(id)
     console.log(destinationId.get(id))

        if(destinationId.get(id) === undefined) {
            showAlert(true, 'danger', `Pease select a DESTINATION !!!`)
        }

        else {
        const destination = await axios.get(`/user/getdestinationbyid/${destinationId.get(id)}`)
        

        if (destination) {
       
            if (window.confirm(`Do you really want to deliver payment with id ${mid} to ${destination.data.dest.receiver_location}?`)) {
                
                const set_on_transit = await axios.patch('/user/settransactionidontransit', {transactionid : id,
                destid: destinationId.get(id)}) 

               

                if (set_on_transit) {
               

             
                
              
                    showAlert(true, 'success', `Payment with id ${transactionmid} is on transit`)

                    setAltertransaction(!altertransaction)

                    setTransactionid('')
        setTransactionmid('')
    }
                 
               
                
                }
            

         }

        

        }
        

        

    }


  return (
        
    
    waiting  ?
    <div>
        <Waiting></Waiting>
    </div> 
    :

    <div className="history-page">


            {alert.show && <Alert {...alert} removeAlert={showAlert}></Alert>}
            <h2>History</h2>

            {
            auth.isAdmin &&
            
            <h4>You have  <span style={{color:'red'}}>{history.filter(item => item.status === 0).length}</span> orders to deliver<br></br></h4>
            
            }
             {
            auth.isAdmin &&
            
            <h4>You have <span style={{color:'red'}}>{history.filter(item => item.status === 1).length}</span> orders on transit<br></br></h4>
            
            }
             {
            auth.isAdmin &&
            
            <h4>You have <span style={{color:'red'}}>{history.filter(item => item.status === 2).length}</span> orders delivered<br></br></h4>
            
            }

            {
                auth.isVendor &&
                <h4>You have {history.length} orders that contain items posted by you</h4>
            }

             {
                auth.isClient &&
                <h4>You have {history.length} orders paid by you</h4>
            }

            <table>
                <thead>
                    <tr>
                        <th>Payment ID</th>
                        <th>Date of Purchased</th>
                        <th>Details</th>
                        {
                        auth.isAdmin &&
                        <th>Delivery Address</th>
                        }
                        {
                        auth.isAdmin &&
                        <th>Status</th>
                        }
                    </tr>
                </thead>
                <tbody>
                    {   

                        history?.map((transaction, index) => (
                            <tr key={transaction._id}>
                                <td>{transaction.mid}</td>
                                 <td>{new Date(transaction.createdAt).toLocaleDateString()}</td>
                                <td><Link to={`/history/${transaction._id}`}>View</Link></td>
                                {

                                (auth.isAdmin && transaction.status === 0) &&
                                <td>
                                
                                <select key={transaction._id} name="destinationId" value={destinationId.get(transaction._id)} onChange={e => {
                                    
                                    destinationId.set(transaction._id, e.target.value)
                                   
                                    }} >
                                    <option  value="">Please select a destination</option>
                                    {
                                        destinations?.map((destination, index) => (
                                        <option key={index} value={destination._id}  >
                                            {destination.receiver_location}
                                        </option>
                                        ))
                                    }
                                </select>
                            
                                </td>

                                }

                                {
                                    (auth.isAdmin && (transaction.status === 1 || transaction.status === 2) ) &&
                                    <td style={{color:'red'}}>{maptransaction.get(transaction._id)}</td>
                                }

                    
                               {
                                   
                               ( transaction.status === 0 && auth.isAdmin) &&
                                <td><button onClick={(e) => handleClick(e, transaction._id, transaction.mid)}>Deliver To</button></td>
                                }
                                {
                                     ( transaction.status === 1 && auth.isAdmin) &&
                                   <td>On Transit</td>
                                }

                                {
                                     ( transaction.status === 2 && auth.isAdmin) &&
                                    <td><Link to={`/map/${transaction._id}/${transaction.destid}`}>Delivered</Link></td>
                                }
                            </tr>
                                ))
                    
                        
                    }
                </tbody>
            </table>
        </div>
  )
}
