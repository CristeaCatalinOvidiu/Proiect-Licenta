import React, {useState, useEffect} from 'react'
import {useParams, Link} from 'react-router-dom'
import axios from 'axios'
import {Alert2} from './Alert.js'


function ActivationEmail() {
    const {activation_token} = useParams()
    const [err, setErr] = useState('')
    const [success, setSuccess] = useState('')
    const [alert, setAlert] = React.useState({show: false, msg:'', type:''})

    const showAlert = (show = false, type = '', msg = '') => {
    setAlert({ show, type, msg });
  };

    useEffect(() => {
        if(activation_token){
            const activationEmail = async () => {
                try {
                    const res = await axios.post('/user/activation', {activation_token})
                    showAlert(true, 'success', res.data.msg)
                } catch (err) {
                    err.response.data.msg && 
                    showAlert(true, 'danger', err.response.data.msg)
                }
            }
            activationEmail()
        }
    
    },[activation_token])

    return (
        <div className>
           {alert.show && <Alert2 {...alert} removeAlert={showAlert}></Alert2>}
           <p className='return'>Return to Login Page? <Link to="/login">Login</Link></p>
        </div>
    )
}

export default ActivationEmail