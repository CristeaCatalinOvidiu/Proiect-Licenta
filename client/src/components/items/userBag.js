import React, { useEffect } from 'react'
import { useGlobalContext } from '../context/Context'
import axios from 'axios'
import { useSelector } from 'react-redux'
import PaypalButton from './Transaction'




export default function UserBag() {

    const {types, setTypes, rerender, setRerender, state, product, setProduct, currbag, setCurrbag, altertransaction,
            setAltertransaction} = useGlobalContext()
    const token = useSelector(state => state.token)
    const auth = useSelector(state => state.auth)
    const [money, setMoney] = React.useState(0)



    const money_spent = () => {
        
        setMoney(currbag.reduce((prev, prod) => {
            return prev + (prod.offer * prod.quantity)
        }, 0))



    }

    useEffect(() => {

        money_spent()

    }, [currbag])


    const updatebag = async(currbag) => {

        try {

            const bought = axios.patch('/user/putinbag', 
                {bag:currbag}, {
                headers: {Authorization: token}
            })
       } catch(error) {


        alert(error)


        }

    }


    const inc = (iid) => {

        currbag.forEach(prod => {
            if(prod._id === iid) {

                if(prod.quantity < prod.nr)
                    prod.quantity += 1 
                else 
                    prod.quantity = prod.nr
            }
        })
        setCurrbag([...currbag])
        updatebag(currbag)
    
    }

    const dec = (iid) => {

        currbag.forEach(prod => {
            if(prod._id === iid) {
                if(prod.quantity === 1) {

                        prod.quantity = 1

                }
                else  { 
                    prod.quantity -= 1                    
                }
            }
        })
        setCurrbag([...currbag])
        updatebag(currbag)
    
    }


    const rmvitem = (iid) => {
        if(window.confirm("Do you want to delete this product?")){
            currbag.forEach((item, index) => {
                if(item._id === iid){
                    currbag.splice(index, 1)
                }
            })

            setCurrbag([...currbag])
            updatebag(currbag)
        }
    }


    

  async function validate_payment(payment) {

    const mid = payment.paymentID
    const dest = payment.address

   // console.log(payment)


   // console.log(mid)
   // console.log('yaya')
   // console.log(dest)
    

    const payU = await axios.post('/api/Transaction',  {
        destination : dest,
        bag : currbag,
        method_id:mid       
    },{
                headers: {Authorization: token}
            })

 

    const payA = await axios.post('/user/newadmintransaction',  {
        
        destination : dest,
        bag : currbag,
        method_id:mid       
    },{
                headers: {Authorization: token}
            })
    
    const msg_to_deliver  = `You can see your transaction at the transaction history called "Prev Transactions", it will have a method id called ${mid}. <br> 
    Also, the amount spent by you was worth ${money} $ `

    /*
    const user =  await axios.get('/user/userinfo', {
                        headers: {Authorization: token}
                    })
   */

    if(payU && payA) {
    

        //user.data.mail

    const notifyUser = await  axios.post('/user/notifyuser', {
        receiver_email: "cristeacatalinovidiu@gmail.com",
        txt: msg_to_deliver

    })
    if(notifyUser) {
    
    setAltertransaction(!altertransaction)
    setProduct({...product, rerender: !product.rerender})
    setCurrbag([])
    updatebag([])
     }
    }
    //put alert
  }


  return (


    currbag.length === 0 ?
        
  <h2 style={{textAlign: "center", fontSize: "5rem"}}>Cart Empty</h2>

 :

<div>
            {
                currbag.map(item => (
                    <div className="detail cart" key={item._id}>
                        <img src={item.photo.url} alt="" />

                        <div className="box-detail">
                            <h2>{item.type}</h2>

                            <h3> {item.offer * item.quantity} $</h3>
                            <p>{item.about}</p>
                            <p>{item.details}</p>

                            <div className="amount">
                                <button onClick={() => dec(item._id)}> - </button>
                                <span>{item.quantity}</span>
                                <button onClick={() => inc(item._id)}> + </button>
                            </div>
                            
                            <div className="delete" 
                            onClick={() => rmvitem(item._id)}>
                                X
                            </div>
                        </div>
                    </div>
                ))
            }

            <div className="total">
                <h3>Total:  {money} $</h3>
                <PaypalButton
                total={money}
                tranSuccess={validate_payment} />
            </div>
        </div>


  )
}
