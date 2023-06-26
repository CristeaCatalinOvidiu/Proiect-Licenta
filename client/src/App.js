import {BrowserRouter as Router, Route,Routes} from 'react-router-dom'
import Login from './components/body/auth/Login'
import Register from './components/body/auth/Register'
import ActivationEmail from './components/body/auth/ActivationEmail'
import { useDispatch, useSelector } from 'react-redux'
import {dispatchLogin, fetchUser, dispatchGetUser} from './components/redux/actions/authAction'
import NotFound  from './components/utils/NotFound/NotFound'
import ForgotPassword from './components/body/auth/ForgotPassword'
import ResetPassword from './components/body/auth/ResetPassword'
import Header from './components/header/Header'
import Body from './components/body/Body'
import { useEffect } from 'react'
import axios from 'axios'
import Profile from './components/body/profile/Profile'
import EditUser  from './components/body/profile/EditUser'
import NewType from './components/admin_component.js/NewType'
import NewItem from './components/admin_component.js/NewItem'
import Item from './components/items/Item'
import About from './components/items/About'
import UserBag from './components/items/userBag'
import PrevTransaction from './components/items/PrevTransaction'
import PrevOrders from './components/items/PrevOrders'
import Map from './components/redux/Map'
import VendorHistory from './components/items/VendorHistory'

function App() {



  const dispatch = useDispatch()
  const token = useSelector(state => state.token)
  const auth = useSelector(state => state.auth)
  //console.log(token)

  useEffect(() => {
    const firstLogin = localStorage.getItem('firstLogin')
    if(firstLogin) {
      const getToken = async () => {

          try {
          const res = await axios.post('/user/refreshtoken', null)
          
          dispatch({type : 'GET_TOKEN', payload: res.data})

          }
          catch(error) {
            console.log(error)
          }
      }
      getToken()
     
    }
  }, [auth.isLogged, dispatch])


  useEffect(() => {

    if(token) {
      
      const getUser = () => {

        dispatch(dispatchLogin())
        //console.log(token)
        return fetchUser(token).then(res => {
          dispatch(dispatchGetUser(res))
        })

      }
       getUser()
    }

  }, [token, dispatch])



  return (

    <Router>       
      <div className="App">
        <Header/>
        <Routes>
          <Route exact path='/login' element = {auth.isLogged ? <NotFound/> : <Login/>}>
          </Route>
          <Route exact path='/register/:type' element = {auth.isLogged ? <NotFound/> : <Register/>}>
          </Route>
          <Route exact path='/forgotpassword' element = {auth.isLogged ? <NotFound/> : <ForgotPassword/>}>
          </Route>
          <Route exact path='/user/activate/:activation_token' element = {<ActivationEmail></ActivationEmail>}>
          </Route>
          <Route exact path='/user/activate/:activation_token' element = {<ActivationEmail></ActivationEmail>}>
          </Route>
          <Route exact path='/user/reset/:token' element = {auth.isLogged ? <NotFound/> : <ResetPassword/>}>
          </Route>
           <Route exact path='/profile' element = {auth.isLogged ? <Profile/> : <NotFound/>}>
          </Route>
           <Route exact path='/updaterole/:id' element = {auth.isLogged ? <EditUser/> : <NotFound/>}>
          </Route>  
          <Route exact path='/newtype' element = {auth.isLogged ? <NewType/> : <NotFound/>}>
            </Route>    
          <Route exact path='/newitem' element = {auth.isLogged ? <NewItem/> : <NotFound/>}>
            </Route>       
          <Route exact path='/items' element={auth.isLogged ? <Item/> : <NotFound />}>
          </Route>
          <Route exact path='/editprod/:id' element={auth.isVendor ? <NewItem/> : <NotFound />}>
          </Route>
          <Route exact path='/about/:id' element={auth.isLogged ? <About/> : <NotFound />}>
          </Route>
          <Route exact path='/bag' element={auth.isLogged ? <UserBag/> : <NotFound />}>
          </Route> 
          <Route exact path='/history' element={auth.isLogged ? <PrevTransaction/> : <NotFound />}>
          </Route> 
          <Route exact path='/history/:id' element={auth.isLogged ? <PrevOrders/> : <NotFound />}>
          </Route> 
           <Route exact path='/map/:tid/:destid' element={(auth.isLogged && (auth.isVendor || auth.isAdmin)) && <Map/>}>
          </Route> 
           <Route exact path='/map' element={(auth.isLogged && (auth.isVendor || auth.isAdmin)) && <Map/>}>
          </Route> 
           <Route exact path='/vendorhistory' element={auth.isLogged ? <VendorHistory/> : <NotFound />}>
          </Route> 
        </Routes>
      </div>
    </Router>



  );
}

export default App;
