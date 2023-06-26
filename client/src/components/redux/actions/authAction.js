import ACTIONS from './index'
import axios from 'axios'


export const dispatchLogin = () => {

    return {
        type: 'LOGIN'
    }

}

export const fetchUser = async(token) => {
    //console.log(token)
    const res = await axios.get('/user/userinfo',{ headers: {Authorization: token} })
    
    return res
}


export const dispatchGetUser = (res) => {
    
    return {
        type: 'GET_USER',
        payload: {
            user: res.data,
            isAdmin: res.data.role === 1 ? true : false,
            isVendor: res.data.role === 2 ? true : false,
            isClient: res.data.role === 0 ? true : false
        }
    }
}