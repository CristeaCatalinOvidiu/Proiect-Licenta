import React from 'react'
import {Link, useNavigate} from 'react-router-dom'
import axios from 'axios'
import Alert from './Alert'
import {dispatchLogin} from '../../redux/actions/authAction'
import { useDispatch } from 'react-redux'
import { GoogleLogin } from 'react-google-login';

const initialState = {

    email: '',
    password: '',
    err: '',
    success: ''
}


function Login() {


    const [user, setUser] = React.useState(initialState)
    const [alert, setAlert] = React.useState({show: false, msg:'', type:''})
    const [lg, islg] = React.useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const showAlert = (show = false, type = '', msg = '') => {
    setAlert({ show, type, msg });
  };


 

    const {email, password, err, success} = user

    const handleSubmit = async (e) => {
        
         e.preventDefault()

         if(!email || !password)
                showAlert(true, 'danger', 'please enter email or password')
        else {    
            try {
                 const res = await axios.post('/user/login', {email, password})

                 setUser({...user, err: '', success: res.data.msg})

                showAlert(true, 'success', 'logged in');
             
               //  console.log(res)

                 localStorage.setItem('firstLogin', true)
                 
                 
                 const timeout = setTimeout(() => {
                      dispatch(dispatchLogin())
                      navigate('/')
                 }, 3000)             
                // clearTimeout(timeout)

                

             } catch(error) {
              
              setUser({...user, err:error.msg, success: ''})
              showAlert(true, 'danger', 'Incorrect email or password');

         }
        }
    }

    const responseGoogle = async (response) => {
        
        try {
            

            const res = await axios.post('/user/glog', {tokenId: response.tokenId})

            showAlert(true, 'success', 'Connected with google')

            localStorage.setItem('firstLogin', true)
                 
                 
                 const timeout = setTimeout(() => {
                      dispatch(dispatchLogin())
                      navigate('/')
                 }, 3000) 
            
        } catch (err) {

            showAlert(true, 'danger', 'Error with google log in')
        }
       
    }

    return (
    
        <div className="login_page">
            <h2>Login</h2>

            <form onSubmit={handleSubmit}>
                {alert.show && <Alert {...alert} removeAlert={showAlert}></Alert>}
                <div>
                    <label htmlFor="email">Email Address</label>
                    <input type="text" placeholder='Enter email address' id='email' value={email} name="email" onChange={(e) => {
                        setUser({...user, [e.target.name]:e.target.value, err: '', success: ''})
                    }}></input>
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input type="text" placeholder='Enter password' id='password' value={password} name="password"  onChange={(e) => {
                        setUser({...user, [e.target.name]:e.target.value, err: '', success: ''})
                    }}></input>
                </div>

                <div className='row'>
                    <button type="submit">Login</button>
                    <Link to="/forgotpassword">Forgot password</Link>
                </div>
            </form>

            <div className='hr'>Google login</div>


            <div  className='social'>
              <GoogleLogin
                clientId="557942850742-v0l2t2p17heregir3ju6sgqao667hjlb.apps.googleusercontent.com"
                buttonText="Login with google"
                onSuccess={responseGoogle}
               // onFailure={responseGoogle}
                cookiePolicy={'single_host_origin'}
              />          

            </div>


            <p>New Customer? <Link to="/register/customer">Register</Link></p>
            <p>New Vendor? <Link to="/register/vendor">Register</Link></p>
        </div>
        
    )
}

export default Login
