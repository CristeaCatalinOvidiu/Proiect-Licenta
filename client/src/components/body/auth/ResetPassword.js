import React, {useState} from 'react'
import axios from 'axios'
import {useParams} from 'react-router-dom'
import Alert from './Alert'



const initialState = {
    password: '',
    cf_password: '',
    err: '',
    success: ''
}

function ResetPassword() {
    const [data, setData] = useState(initialState)
    const [first, setFirst] = useState(false)
    let token = useParams().token
    const [alert, setAlert] = React.useState({show: false, msg:'', type:''})


    const showAlert = (show = false, type = '', msg = '') => {
    setAlert({ show, type, msg });
  };

    const {password, cf_password, err, success} = data

    const handleChangeInput = e => {
        const {name, value} = e.target
        setData({...data, [name]:value, err: '', success: ''})
    }


    const handleResetPass = async () => {

      

        if(password.length <= 6)
            showAlert(true, 'danger', 'Short password')

    
        else if(password != cf_password)
            showAlert(true, 'danger',  `Pssword don't match`)
        
        else {
            try {
               
                if(first || localStorage.getItem('firstchange')) {
                    token = ''
                } 
                const res = await axios.post('/user/reset', {password}, {
                    headers: {Authorization: token}
                })
                showAlert(true, 'success', 'Password success reset')
                setFirst(true)
                localStorage.setItem('firstchange', true)
               
           

            } catch (err) {
               
                showAlert(true, 'danger', 'ERROR')
            }
        }

       
        
    }


    return (
        <div className="fg_pass">

            {alert.show && <Alert {...alert} removeAlert={showAlert}></Alert>}
            <h2>Reset Your Password</h2>

            <div className="row">
                
               

                <label htmlFor="password">Password</label>
                <input type="password" name="password" id="password" value={password}
                onChange={handleChangeInput} />

                <label htmlFor="cf_password">Confirm Password</label>
                <input type="password" name="cf_password" id="cf_password" value={cf_password}
                onChange={handleChangeInput} />         

                <button onClick={handleResetPass}>Reset Password</button>
            </div>
        </div>
    )
}

export default ResetPassword