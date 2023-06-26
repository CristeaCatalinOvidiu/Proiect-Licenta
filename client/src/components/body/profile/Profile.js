import React, {useState, useEffect} from 'react'
import axios from 'axios'
import {useSelector, useDispatch} from 'react-redux'
import {Link, Navigate, useNavigate} from 'react-router-dom'
import {fetchAllUsers, dispatchGetAllUsers} from '../../redux/actions/usersAction'
import Alert from '../auth/Alert'

const initialState = {
    name: '',
    password: '',
    cf_password: '',
    err: '',
    success: ''
}

 let res2

function Profile() {
    const auth = useSelector(state => state.auth)
    const token = useSelector(state => state.token)
    const navigate = useNavigate()

    const users = useSelector(state => state.users)

   
    const [alert, setAlert] = React.useState({show: false, msg:'', type:''})

    const {user, isAdmin} = auth
    const [data, setData] = useState(initialState)
    const {name, password, cf_password, err, success} = data
    

    const showAlert = (show = false, type = '', msg = '') => {
    setAlert({ show, type, msg })}
  

    const [avatar, setAvatar] = useState(false)
    const [loading, setLoading] = useState(false)
    const [callback, setCallback] = useState(false)

    

    const [news, setNews] = useState(false)

    const dispatch = useDispatch()

   

    useEffect(() => {
        if(isAdmin){
            fetchAllUsers(token).then(res =>{
                dispatch(dispatchGetAllUsers(res))
            })
        }
    },[token, isAdmin, dispatch, callback])

    const handleChange = e => {
        const {name, value} = e.target
        setData({...data, [name]:value, err:'', success: ''})
    }

    const changeAvatar = async(e) => {
        e.preventDefault()
        try {

           

            const file = e.target.files[0]

            if(!file) return setData({...data, err: "No files were uploaded." , success: ''})

            if(file.size > 1024 * 1024)
                showAlert(true, 'danger', 'File too big')

            if(file.type !== 'image/jpeg' && file.type !== 'image/png')
               showAlert(true, 'danger', 'Invalid File Type')

            let formData =  new FormData()
            formData.append('file', file)

            setLoading(true)
            const res = await axios.post('/api/uploadimg', formData, {
                headers: {'content-type': 'multipart/form-data', Authorization: token}
            })

            setLoading(false)
            setAvatar(res.data.url)
            
        } catch (err) {
             showAlert(true, 'danger', err.error.data)
        }
    }

    const updateInfor = () => {
        try {
            res2 = axios.patch('/user/update', {
                name: name ? name : user.name,
                image: avatar ? avatar : user.img
            },{
                headers: {Authorization: token}
            })

             
        
         const timeout = setTimeout(() => {

         window.location.reload()
    }, 3000);
    
      

            

           
            showAlert(true, 'success', 'Successfull updated')
        } catch (err) {
            showAlert(true, 'danger', 'Error when updating')
        }
    }

    const updatePassword = () => {
      

        try {
            axios.post('/user/reset', {password},{
                headers: {Authorization: token}
            })

            showAlert(true, 'success', 'Successfull password updated')
        } catch (err) {

             showAlert(true, 'danger',  err.error.msg)
          
        }
    }

    const handleUpdate = () => {
        if(name || avatar) updateInfor()
        if(password) updatePassword()
    }

    const handleDelete = async (id) => {
        try {
            if(user._id !== id){
                if(window.confirm("Are you sure you want to delete this account?")){
                    setLoading(true)
                    await axios.delete(`/user/delete/${id}`, {
                        headers: {Authorization: token}
                    })
                    setLoading(false)
                    setCallback(!callback)
                    showAlert(true, 'success',  `User with id : ${id} was deleted`)
                }
            }
            
        } catch (err) {
           showAlert(true, 'danger',  err.error.msg)
        }
    }

    return (
        <>
        <div>
             {alert.show && <Alert {...alert} removeAlert={showAlert}></Alert>}
        </div>
        <div className="profile_page">
            <div className="col-left">
                <h2>{isAdmin ? "Admin Profile": "User Profile"}</h2>

                <div className="avatar">
                    <img src={avatar ? avatar : user.image} alt=""/>
                    <span>
                        <i className="fas fa-camera"></i>
                        <p>Change</p>
                        <input type="file" name="file" id="file_up" onChange={changeAvatar} />
                    </span>
                </div>

                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input type="text" name="name" id="name" defaultValue={user.name}
                    placeholder="Your name" onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" name="email" id="email" defaultValue={user.email}
                    placeholder="Your email address" disabled />
                </div>

                <div className="form-group">
                    <label htmlFor="password">New Password</label>
                    <input type="password" name="password" id="password"
                    placeholder="Your password" value={password} onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label htmlFor="cf_password">Confirm New Password</label>
                    <input type="password" name="cf_password" id="cf_password"
                    placeholder="Confirm password" value={cf_password} onChange={handleChange} />
                </div>

                <div>
                    <em style={{color: "crimson"}}> 
                    * If you update your password here, you will not be able 
                        to login quickly using google and facebook.
                    </em>
                </div>

                <button disabled={loading} onClick={handleUpdate}>Update</button>
            </div>
            {
            auth.isAdmin && 
            <div className="col-right">
                <h2>{"Users"}</h2>

                <div style={{overflowX: "auto"}}>
                    <table className="customers">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Admin</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {   
                            
                                users.map(user => (
                                    <tr key={user._id}>
                                        <td>{user._id}</td>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>
                                            {
                                                user.role === 1
                                                ? <i className="fas fa-check" title="Admin"></i>
                                                : <i className="fas fa-times" title="User"></i>
                                            }
                                        </td>
                                        <td>
                                            <Link to={`/updaterole/${user._id}`}>
                                                <i className="fas fa-edit" title="Edit"></i>
                                            </Link>
                                            <i className="fas fa-trash-alt" title="Remove"
                                            onClick={() => handleDelete(user._id)} ></i>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
            }
        </div>
        </>
    )
}

export default Profile
export {res2}
