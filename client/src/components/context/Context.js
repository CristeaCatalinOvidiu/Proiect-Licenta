import React, { useState, useContext, useEffect } from 'react'
import axios, { Axios } from 'axios'
import { reducer } from './editReducer'
import { useReducer } from 'react'
import { useSelector } from 'react-redux'
import { truncate } from 'fs'





const initialState = {

    id: '',
    currentedit:'',
    isEditing: false

}


const itemState = {

    items:[],
    rerender:false,
    type:'',
    sortbymethod:'',
    searchbymethod:'',
    filter:1,
    response:0

}


const AppContext = React.createContext()



const AppProvider = ({children}) => {



    const [types, setTypes] = useState([])
    const [deposits, setDeposits] = useState([])
    const [destinations, setDestinations] = useState([])
    
    const [rerender, setRerender] = useState(false)
    const [newdep, setNewdep] = useState(false)
    const [state, dispatch] =  useReducer(reducer, initialState)
    const [product, setProduct] = useState(itemState)
    const [currbag, setCurrbag] = useState([])
    const [history, setHistory] = useState([])
    const [deliveryQueue, setDeliveryQueue] = useState([])
    const [truck, setTruck] = useState(new Map())
    const [altertransaction, setAltertransaction] = useState(false)
    const [maptransaction, setMaptransaction] = useState(new Map())
    const [waiting, setWaiting] = useState(false)
    const [waitprod, setWaitprod] = useState(false)
    const [delivered, setDelivered] = useState(false)
    
    const auth = useSelector(state => state.auth)
    const token = useSelector(state => state.token)




    

    const getDest = async() => {

        if(auth.isAdmin) {

                const res = await axios.get('/user/getdestinations', {
                        headers: {Authorization: token}
                    })

                setDestinations(res.data.all_destinations)

        }

    }

    useEffect(() => {
        getDest()


    }, [token, auth.isAdmin, setDestinations])
  

    const makedeliverpoint = async(transactionid) => {

        

            const CancelToken = axios.CancelToken
                            const source = CancelToken.source();
                            const timeout = setTimeout(() => {
                             source.cancel();
                                setDelivered(!delivered)
                                }, 30000);
    

                await axios.patch('/user/maketransactiondelivered', {transactionid}, {cancelToken: source.token}).then(res => clearTimeout(timeout)
                
                )
        
    }

    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    
     
    const getprevtrans = async() => {


        if(auth.isAdmin) {


                setWaiting(true)
                const res = await axios.get('/user/getadmintransactions', {
                        headers: {Authorization: token}
                    })
                 setHistory(res.data.data)
                setWaiting(false)


                for(let i = 0; i < res.data.data.length; i++) {

                    
                    if(res.data.data[i].status !== 0) {


                      



                            if(res.data.data[i].destid !== undefined) {
                            res.data.data[i].bag.forEach(item => {
                                    
                                let  key = res.data.data[i]._id + '%' + item.depositId
                                
                               
                                if(truck.get(key) === undefined) 
                                        truck.set(key, [item])
                                    
                                else
                                    truck.set(key, [...truck.get(key), item])

                                setTruck(truck)


                            })
                        
                        

                       
                       
                            const dest =  await axios.get(`/user/getdestinationbyid/${res.data.data[i].destid}`)

                            
                            maptransaction.set(res.data.data[i]._id, dest.data.dest.receiver_location)
                            setMaptransaction(maptransaction)
                            
                        }
                        


                        if(res.data.data[i].status === 1) {

                            await makedeliverpoint(res.data.data[i]._id)
                            

                        }


                    }
                }
                
                
               
                
               

               
        

        } else if(auth.isClient) {
            
            setWaiting(true)
           // console.log('picaciu1')

            const res = await axios.get('/user/prevops', {
                        headers: {Authorization: token}
                    })
            
            
          // console.log(res.data.data)
          
            setHistory(res.data.data)
            setWaiting(false)
            
        } else if(auth.isVendor) {

            
            const res = await axios.post('/user/getvendortransactions', 
            {vendorid : auth.user._id})
            //console.log('picaciu')
           // console.log(res)
            
             setHistory(res.data.vendortransactions)
             setWaiting(false)

        }

    }

    useEffect(() => {
        if(token) {


            




            getprevtrans()
            



        }

    }, [token, auth.isAdmin, setHistory, auth.isVendor, auth.isClient, altertransaction, delivered])
    


     const getDeposits = async() => {

        try {
        

       
        
        
        
        const  res = await axios.get(`/user/getdeposit`, {
                headers: {Authorization: token}
                }) 
       

       // console.log('masinile mele')
        //console.log(res)
   
        if (res) {

           // console.log('masinile mele regine')
            //console.log(res)
            setDeposits(res.data.vendordeposits)

        }
            
        
        } catch (error) {
            console.log(error.msg)
        }
    }

    useEffect(() => {

        if(token)

         getDeposits()

    }, [newdep, token])
    
     


    async function put_in_bag(prod) {

        try {

        if(auth.isLogged) {

            const check = currbag.every(item => {

                return item._id !== prod._id
            })


            if(check)   {

                setCurrbag([...currbag, {...prod, quantity: 1}])
                const inc_bag = await axios.patch('/user/putinbag', 
                {
                    bag: [...currbag, {...prod, quantity: 1}]

                }, 
                {
                headers: {Authorization: token}
                }
            )
              //  console.log(inc_bag)

            }
            else {
                alert("This product has been added to cart.")
            }

        }
        } catch(error) {



        }

    } 

    const findItems = async () => {

        try {

            setWaitprod(true)
            const user =  await axios.get('/user/userinfo', {
                        headers: {Authorization: token}
                    })

            await axios.get(`/api/item?limit=${product.filter*9}&${product.typo}&${product.sortbymethod}&type[regex]=${product.searchbymethod}&vendorid=${user.data._id}&role=${user.data.role}`).then(res => {
                setProduct({...product, items:Object.values(res.data)[0], response:Object.values(res.data)[0].length})
            })
            setWaitprod(false)

        } catch(error) {
            alert(error)

        }


    }


    const setUserBag = async() => {

        try {
            

                const user =  await axios.get('/user/userinfo', {
                        headers: {Authorization: token}
                    })
                
                console.log(user.data)
                setCurrbag(user.data.bag)
    
                
            
            
        } catch(error) {
            alert(error)
        }
        
    }


    

    useEffect(() => {

        if(token) 
            setUserBag()
           
        


    }, [token])


    useEffect(() => {

       // console.log(product.items)
       if(token)
        findItems()


    }, [product.rerender, product.typo, product.sortbymethod, product.searchbymethod, product.filter, token])


    const resetEdit = () => {

        dispatch({type:'RESET_EDIT'})
    }

    const seteditId = (id) => {

        dispatch({type:'SET_ID', payload:id})
    }

    const setcurrentEdit =  (curredit) => {

        dispatch({type:'SET_TYPE', payload:curredit})
    }


    const isEditing = () => {

        dispatch({type:'SET_EDIT'})

    }



   
    const getTypes = async() => {
        try {
        const res = await axios.get('/api/type')
        //console.log(res.data)
        if(res)
            setTypes(res.data)

        } catch(error) {
            console.log(error.msg)
        }
    }
    useEffect(() => {

        getTypes()

    }, [rerender])

    return (
        <AppContext.Provider value={{
            state,
            types, 
            setTypes, 
            rerender, 
            setRerender,
            resetEdit,
            seteditId,
            setcurrentEdit,
            isEditing, 
            product,
            setProduct,
            currbag,
            setCurrbag,
            put_in_bag,
            history,
            setHistory,
            deposits,
            newdep,
            setNewdep, 
            destinations, 
            setDestinations, 
            deliveryQueue,
            setDeliveryQueue,
            altertransaction,
            setAltertransaction,
            maptransaction,
            setMaptransaction,
            waiting,
            setWaiting,
            truck,
            setTruck,
            waitprod,
            setWaitprod
            }}>
            {children}
        </AppContext.Provider>

    )

}


export const useGlobalContext = () => {
    return useContext(AppContext)
}

export {AppContext, AppProvider}