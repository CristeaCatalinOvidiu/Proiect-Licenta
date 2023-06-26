import axios from 'axios'

export const fetchAllUsers = async (token) => {
    const res = await axios.get('/user/all', {
        headers: {Authorization: token}
    })
    return res
}

export const dispatchGetAllUsers = (res) => {
    console.log(res)
    return {
        type: 'GET_ALL_USERS',
        payload: res.data
    }
}