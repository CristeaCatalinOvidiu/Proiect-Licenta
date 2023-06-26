import ACTIONS from '../actions/index.js'


const initialState = {

    user: [],
    isLogged: false,
    isAdmin: false,
    isVendor: false,
    isClient: false
}


const authReducer = (state = initialState, action) => {


        if(action.type === ACTIONS.LOGIN)
            return {
                ...state,
                isLogged: true
            }
        if(action.type === 'GET_USER')
            return {
                ...state, 
                user: action.payload.user,
                isAdmin: action.payload.isAdmin,
                isVendor: action.payload.isVendor,
                isClient: action.payload.isClient
            }

        return state
}

export default authReducer;