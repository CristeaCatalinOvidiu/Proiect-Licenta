export const reducer = (state, action) => {

    if(action.type === 'SET_ID') {
        return {...state, id: action.payload}

    }


    if(action.type === 'SET_TYPE') {
        
        return {...state, currentedit: action.payload}

    }

    if(action.type === 'SET_EDIT ') {
        
        const current_Editing = state.isEditing
        return {...state, isEditing: !current_Editing}
    }

    if(action.type === 'RESET_EDIT') {

        return {
            ...state,
            id: '',
            currentedit:'',
            isEditing:false
        }

    }

   

    throw new Error('no matching action type')


}