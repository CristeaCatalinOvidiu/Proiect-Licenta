import React from 'react'
import { useEffect } from 'react'
import { useGlobalContext } from '../context/Context'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

export default function PrevOrders() {


    const {types, setTypes, rerender, setRerender, state, product, setProduct, history, setHistory} = useGlobalContext()
    const [det , setDet] = React.useState([])


    const payload = useParams()
    const navigate = useNavigate()


    useEffect(() => {

        if(payload.id) {
            history.forEach(prod =>{

                if(prod._id === payload.id) setDet(prod)
            })

        }

    }, [payload.id, history])

    console.log(det)

    if(det.length === 0) return null
  return (
        <div className="history-page">

            <div className="row">
                <button onClick={() => navigate(-1)} className="go_back">
                    <i className="fas fa-long-arrow-alt-left"></i> Go Back
                </button>
            </div>
            <h1 style={{textAlign: "center", fontSize: "4rem"}}>CARD DETAILS</h1><br></br><br></br>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Address</th>
                        <th>Postal Code</th>
                        <th>Country Code</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{det.dest.recipient_name}</td>
                        <td>{det.dest.line1 + " - " + det.dest.city}</td>
                        <td>{det.dest.postal_code}</td>
                        <td>{det.dest.country_code}</td>
                    </tr>
                </tbody>
            </table>
            <br></br><br></br><br></br>
            <h1 style={{textAlign: "center", fontSize: "4rem"}}>COMAND DETAILS</h1><br></br><br></br>
            <table style={{margin: "30px 0px"}}>
                <thead>
                    <tr>
                        <th></th>
                        <th>Products</th>
                        <th>Quantity</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        det.bag.map(prod =>(
                        <tr key={prod._id}>
                            <td><img src={prod.photo.url} alt="" /></td>
                            <td>{prod.type}</td>
                            <td>{prod.quantity}</td>
                            <td>$ {prod.offer * prod.quantity}</td>
                        </tr>
                        ))
                    }
                    
                </tbody>
            </table>
        </div>
    )
}
