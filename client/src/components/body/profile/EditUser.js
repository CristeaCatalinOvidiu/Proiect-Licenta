import React, {useState, useEffect} from 'react'
import {useParams,  useNavigate} from 'react-router-dom'
import {useSelector} from 'react-redux'
import axios from 'axios'
import Alert from '../auth/Alert'


function EditUser() {
    const {id} = useParams()
    
    const [editUser, setEditUser] = useState([])
    const [alert, setAlert] = React.useState({show: false, msg:'', type:''})

    const showAlert = (show = false, type = '', msg = '') => {
    setAlert({ show, type, msg })}

    const users = useSelector(state => state.users)
    const token = useSelector(state => state.token)
    const navigate = useNavigate()

    const [checkAdmin, setCheckAdmin] = useState(false)
    const [err, setErr] = useState(false)
    const [success, setSuccess] = useState(false)
    const [num, setNum] = useState(0)

    useEffect(() => {
        if(users.length !== 0){
            users.forEach(user => {
                if(user._id === id){
                    setEditUser(user)
                    setCheckAdmin(user.role === 1 ? true : false)
                }
            })
        }else{
            navigate('/profile')
        }
    },[users, id, navigate])

    const handleUpdate = async () => {
        try {
            if(num % 2 !== 0){
                const res = await axios.patch(`/user/updaterole/${editUser._id}`, {
                    role: checkAdmin ? 1 : 0
                }, {
                    headers: {Authorization: token}
                })

                
                showAlert(true, 'success', res.data.msg)
                setNum(0)
            }
        } catch (err) {
            showAlert(true, 'danger', err.error.data)
        }
    }

    const handleCheck = () => {
        setSuccess('')
        setErr('')
        setCheckAdmin(!checkAdmin)
        setNum(num + 1)
    }

    return (
        <div className="profile_page edit_user">
            <div className="row">
                <button onClick={() => navigate(-1)} className="go_back">
                    <i className="fas fa-long-arrow-alt-left"></i> Go Back
                </button>
            </div>

            <div className="col-left">
                <h2>Edit User</h2>

                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input type="text" name="name" defaultValue={editUser.name} disabled/>
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" name="email" defaultValue={editUser.email} disabled />
                </div>

                <div className="form-group">
                    <input type="checkbox" id="isAdmin" checked={checkAdmin}
                    onChange={handleCheck} />
                    <label htmlFor="isAdmin">isAdmin</label>
                </div>

                <button onClick={handleUpdate}>Update</button>



               {alert.show && <Alert {...alert} removeAlert={showAlert}></Alert>}
            </div>
        </div>
    )
}

export default EditUser