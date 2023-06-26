import React from 'react'
import { useGlobalContext } from '../context/Context'
import { useSelector } from 'react-redux'
import axios from 'axios'
import Alert from '../body/auth/Alert'







export default function NewType() {

  const credits = {
    

    currentedit:'',
    currentid:'',
    edit:false

  }


  const token = useSelector(state => state.token)
  const auth = useSelector(state => state.auth)
  const [alert, setAlert] = React.useState({show: false, msg:'', type:''})
  const [credit, setCredit] = React.useState(credits)
  



  const {types, setTypes, rerender, setRerender, state} = useGlobalContext()




const showAlert = (show = false, type = '', msg = '') => {
    setAlert({ show, type, msg });
  };


  const [isEdit, setIsEdit] = React.useState(false)



  const [currentedit, setCurrentedit] = React.useState()
  const [id, setId] = React.useState('')




const delItem = async (item_id, item_name) => {

    try {

        const name = item_name
        if(item_name) {
            const res = await axios.delete(`/api/type/${item_id}`, {
                    headers: {Authorization: token}
                })
            if (res)
                showAlert(true, 'success', 'The TYPE was successfully deleted')
        
            setRerender(!rerender)
        }

    } catch (errror) {

        showAlert(true, 'danger', 'Error when deleting the type')
            
    }
}


const updtItem = (item_id, item_name) => {

    try {

       // console.log('freak')
        if(item_name)
            setCredit({...credit, edit:true, currentedit:item_name, currentid:item_id})
        
    } catch (errror) {
        showAlert(true, 'danger', 'Error when updating the type')
      
    }
}




  return (
      
     <div className="categories">
         
            <form onSubmit={async (e) => {

    e.preventDefault()
    try {
            if(!credit.edit){

                

                const res = await axios.post('/api/type', {name: credit.currentedit}, {
                    headers: {Authorization: token}
                })

                
              
                
                if (res)
                    showAlert(true, 'success', 'The TYPE was successfully created')


               
            }
            if(credit.edit){

               // console.log(credit)
                 const res = await axios.patch(`/api/type/${credit.currentid}`, {name: credit.currentedit}
                    )
                
                if (res)
                    showAlert(true, 'success', 'The TYPE was successfully edited')
            }
           
            setCredit({...credit, currentedit:state.currentedit, currentid:state.isEditing})
            setRerender(!rerender)
            
        } catch (error) {

            

            showAlert(true, 'danger', 'ERROR while creating the new TYPE')
          
        }

}}>
                {alert.show && <Alert {...alert} removeAlert={showAlert}></Alert>}
                <label htmlFor="type">Category</label>
                <input type="text" name="type" value={credit.currentedit} required
                onChange={(e) => setCredit({...credit, currentedit:e.target.value})} />

                <button type="submit">{credit.edit ? "Update" : "Create"}</button>
            </form>

            <div className="col">
                {
                    
                    types?.map(type => (
                        <div className="row" key={type._id}>
                            <p>{type.newp_t}</p>
                            <div>
                                <button onClick={() => updtItem(type._id, type.newp_t)}>Edit</button>
                                <button onClick={() => delItem(type._id, type.newp_t)}>Delete</button>
                            </div>
                        </div>
                        
                    ))
                    
                }
            </div>
        </div>
  )
}
