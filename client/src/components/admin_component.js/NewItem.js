import Waiting from "../page_components/Waiting";
import axios from 'axios'
import { useGlobalContext } from "../context/Context";
import { useNavigate } from "react-router-dom";
import {useState, useEffect} from 'react'
import { useSelector } from "react-redux";
import {useParams} from 'react-router-dom'
import req from "express/lib/request";
export default function NewItem() {



   const credits = {

    photo:false,
    waiting:false,
    updating:false
   } 

   const token = useSelector(state => state.token)
   const auth = useSelector(state => state.auth)


   console.log(token)

   const [iid, setIid]  = useState('')
   const [type,setType] = useState('')
   const [offer,setOffer] = useState(0) 
   const [about,setAbout] =  useState('')
   const [details,setDetails] = useState('') 
   const [typo,setTypo] =  useState('')
   const [depositId, setDepositId] = useState('')
   const [sold, setSold] = useState(0)
   const [_id,set_Id] = useState('')


   


   const {types, setTypes, rerender, setRerender, state, product, setProduct, deposits} = useGlobalContext()



   const navigate = useNavigate()

   const payload = useParams()
   

   const [credit, setCredit] = useState(credits)


   useEffect(() => {

    if(payload.id) {

       
        setCredit({...credit, updating: true})
        product.items.forEach(item => {
            if(item._id === payload.id) {
                setIid(item.iid)
                setType(item.type)
                setOffer(item.offer)
                setAbout(item.about)
                setDetails(item.details)
                setTypo(item.typo)
                set_Id(item._id)
                setCredit({...credit, photo: item.photo, updating: true})
                setSold(item.nr)
               

            }
        })



    } else {
       
        setCredit({...credit, updating: false, photo:false})
        setIid('')
        setType('')
        setOffer(0)
        setAbout('')
        setDetails('')
        setTypo('')
        set_Id('')
        setSold(0)

    }
   }, [payload.id, product])

   const handleUpload = async e => {

    e.preventDefault()
    try {
            if(!auth.isVendor) return alert("You're not an Vendor")
            const file = e.target.files[0]
            
            if(!file) return alert("File not exist.")

            if(file.size > 1024 * 1024) // 1mb
                return alert("Size too large!")

            if(file.type !== 'image/jpeg' && file.type !== 'image/png') // 1mb
                return alert("File format is incorrect.")

            let formData = new FormData()
            formData.append('file', file)

            setCredit({...credit, waiting:true})
            const res = await axios.post('/api/uploadproductimg', formData, {
                headers: {'content-type': 'multipart/form-data', Authorization: token}
            })


            setCredit({...credit, waiting:false, photo:res.data})

        } catch (err) {
            alert(err.response.data.msg)
        }


   }



   const handleDestroy =  async() => {


    try {

        if(!auth.isVendor) return alert("You're not an Vendor")   

        setCredit({...credit, waiting:true})

        
        const del_img = await axios.post('/api/delphoto', {public_id: credit.photo.public_id}, {
                headers: {Authorization: token}})


        setCredit({...credit, waiting:false, photo:false})

        

    } catch(e) {
        alert(e.response)
    }

   }







const handleSubmit = async e => {

    e.preventDefault()


    try {

      if(!auth.isVendor) return alert("no vendor")
      if(!credit.photo) return alert('no photo')
    




    if(credit.updating) {


         console.log(_id)
        console.log(iid, typo, type, credit.photo, about)
        const editing = await axios.patch(`/api/item/${_id}`, {
            item_id:iid,
            item_type:type, 
            item_offer:offer, 
            item_about:about, 
            item_details:details,
            item_typo:typo, 
            item_photo: credit.photo,
            item_nr: sold})

        alert('The item was updated')
   
       

    } else {


       // console.log('dada')

       // console.log(type)
        //console.log(offer)
       // console.log(about)
       // console.log(details)
       // console.log(typo)
       // console.log(credit.photo.url)

       if(!type || !offer || !about || !details || !typo || !depositId)
        return alert('Complete all fields please !')

        console.log(auth.user)
        const posting = await axios.post("api/item", {item_id:iid,
            item_type:type, 
            item_offer:offer, 
            item_about:about, 
            item_details:details,
            item_typo:typo, 
            item_photo: credit.photo,
            item_vendorid:auth.user._id,
            item_depositid:depositId,
            item_nr:sold},
       { headers: {Authorization: token}})

       console.log(posting)


    }

    const last = product.rerender
    setProduct({...product, rerender:!last})
    navigate('/')

    } catch (e) {
        alert(e.response.data.msg)
    }
}






const styleUpload = {
        display: credit.photo ? "block" : "none"
    }

return (
        <div className="create_product">
            <div className="upload">
                <input type="file" name="file" id="file_up" onChange={handleUpload}/>
                {
                    credit.waiting ? <div id="file_img"><Waiting /></div>

                    :<div id="file_img" style={styleUpload}>
                        <img src={credit.photo ? credit.photo.url : ''} alt=""/>
                        <span onClick={handleDestroy}>X</span>
                    </div>
                }
                
            </div>

            <form onSubmit={handleSubmit}>
                <div className="row">
                    <label htmlFor="iid">Product ID</label>
                    <input type="text" name="iid" id="iid" required
                    value={iid} onChange={e => setIid(e.target.value)} disabled={credit.updating} />
                </div>

                <div className="row">
                    <label htmlFor="type">Title</label>
                    <input type="text" name="type" id="type" required
                    value={type} onChange={e => setType(e.target.value)} />
                </div>
                
                <div className="row">
                    <label htmlFor="offer">Price</label>
                    <input type="number" name="offer" id="offer" required
                    value={offer} onChange={e => setOffer(e.target.value)} />
                </div>

                <div className="row">
                    <label htmlFor="about">Description</label>
                    <textarea type="text" name="about" id="about" required
                    value={about} rows="5" onChange={e => setAbout(e.target.value)} />
                </div>

                <div className="row">
                    <label htmlFor="details">Content</label>
                    <textarea type="text" name="details" id="details" required
                    value={details} rows="7" onChange={e => setDetails(e.target.value)} />
                </div>

                <div className="row">
                    <label htmlFor="sold">Please insert number of products</label>
                    <input type="number" min="1"name="sold" id="sold" required
                    value={sold} rows="7" onChange={e => setSold(e.target.value)} />
                </div>

                <div className="row">
                    <label htmlFor="typo">Categories: </label>
                    <select name="typo" value={typo} onChange={e => setTypo(e.target.value)} >
                        <option value="">Please select a category</option>
                        {
                            types?.map(type => (
                                <option value={type._id} key={type._id}>
                                    {type.newp_t}
                                </option>
                            ))
                        }
                    </select>
                </div>
                
                <div className="row">
                    <label htmlFor="depositId">Deposit: </label>
                    <select name="depositId" value={depositId} onChange={e => setDepositId(e.target.value)} >
                        <option value="">Please select a deposit</option>
                        {
                            deposits?.map(deposit => (
                                <option value={deposit._id} key={deposit._id}>
                                    {deposit.address}
                                </option>
                            ))
                        }
                    </select>

                </div>
                <button type="submit">{credit.updating? "Update" : "Create"}</button>
            </form>
        </div>
    )

}