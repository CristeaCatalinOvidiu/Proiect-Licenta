import React, {useState} from 'react'
import axios from 'axios'
import Alert from './Alert'


const initialState = {
    email: '',
    err: '',
    success: ''
}

function ForgotPassword() {
    const [data, setData] = useState(initialState)
    const [alert, setAlert] = React.useState({show: false, msg:'', type:''})

    const showAlert = (show = false, type = '', msg = '') => {
    setAlert({ show, type, msg });
  };

    const email_regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    const {email, err, success} =  data

    


    return (
        <div className='fg_pass'>
            {alert.show && <Alert {...alert} removeAlert={showAlert}></Alert>}
            <h2>Forgot your password?</h2>
            <div className='row'>
                <label htmlFor="email">Enter your email address</label>
                <input type="email" name="email" id="email" value={email}
                onChange = {(e) => {
                    setData({...data, [e.target.name]:e.target.value, err:'', success:''})
                }} />
                <button onClick={async() => {
                    if(!email_regex.test(email))
                        showAlert(true, 'danger', 'Invalid email type, email format is name@domain.com')
                    try {
                        

                        if(email_regex.test(email)) {
                        const res = await axios.post('/user/forgot', {email})
                        
                        localStorage.removeItem('firstchange')
                        showAlert(true, 'success', 'We sent an email to your account to put a new password !!!')
                        }
                        
                        
                    } catch(err) {
                        showAlert(true,'danger', 'This email does not exist in out database !')
                        
                    }

                }}>Verify your email</button>
            </div>
        </div>
    )
}

export default ForgotPassword
