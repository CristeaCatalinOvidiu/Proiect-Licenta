import React from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import axios from 'axios'
import Alert from './Alert'


const email_regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const initialState = {
    name: '',
    email: '',
    password: '',
    cf_password: '',
    err: '',
    success: ''
}




function Register() {
    const [user, setUser] = React.useState(initialState)
    const [alert, setAlert] = React.useState({show: false, msg:'', type:''})


    const register_type = useParams()

    


   

    const showAlert = (show = false, type = '', msg = '') => {
    setAlert({ show, type, msg });
  };

    const {name, email, password,cf_password, err, success} = user

    const handleChangeInput = e => {
        setUser({...user, [e.target.name]:e.target.value, err: '', success: ''})
    }


    const handleSubmit = async e => {
        e.preventDefault()

        if(!name || !password )
            showAlert(true, 'danger', 'Pleas fill all')

        if(!email_regex.test(email))
            showAlert(true, 'danger', 'Please  write a valid email')
        
        

        if(password !== cf_password)
            showAlert(true, 'danger', "Passwords don't match")
        
        else {
            try {
                const res = await axios.post('/user/register', {
                name, email, password, register_type : register_type.type
            })

            showAlert(true, 'success', res.data.msg)

            } catch (err) {
                err.response.data.msg && 
                showAlert(true, 'danger', err.response.data.msg)
            }
        }
    }

    return (
        <div className="login_page">
            <h2>Register</h2>
           {alert.show && <Alert {...alert} removeAlert={showAlert}></Alert>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Name</label>
                    <input type="text" placeholder="Enter your name" id="name"
                    value={name} name="name" onChange={handleChangeInput} />
                </div>

                <div>
                    <label htmlFor="email">Email Address</label>
                    <input type="text" placeholder="Enter email address" id="email"
                    value={email} name="email" onChange={handleChangeInput} />
                </div>

                <div>
                    <label htmlFor="password">Password</label>
                    <input type="password" placeholder="Enter password" id="password"
                    value={password} name="password" onChange={handleChangeInput} />
                </div>

                <div>
                    <label htmlFor="cf_password">Confirm Password</label>
                    <input type="password" placeholder="Confirm password" id="cf_password"
                    value={cf_password} name="cf_password" onChange={handleChangeInput} />
                </div>

                <div className="row">
                    { register_type.type === 'customer' ?
                    <button type="submit">New Client</button> :
                    <button type="submit">New Vendor</button>
                    }
                </div>

                
                
            </form>

            <p>Already an account? <Link to="/login">Login</Link></p>
        </div>
    )
}

export default Register