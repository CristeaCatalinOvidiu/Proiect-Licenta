
const users =[]

const usersReducer = (state = users, action) => {

    if(action.type === 'GET_ALL_USERS')
        return action.payload
    

    return users
}

export default usersReducer