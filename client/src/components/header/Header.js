import React from 'react'
import {Link} from 'react-router-dom'
import {useSelector} from 'react-redux'
import axios from 'axios'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import userBag from '../items/userBag'
import { useGlobalContext } from '../context/Context'
	
import ReactCountryFlag from "react-country-flag"

export default function Header() {

    const auth = useSelector(state => state.auth)
   // console.log(auth.user)
    const {types, setTypes, rerender, setRerender, state, product, setProduct, currbag, setCurrbag} = useGlobalContext()
    //console.log(auth)

    const {user, isLogged} = auth
    const userLink = () => {
        return <li className='drop-nav'>
            <Link to="#" className='avatar'>
            <img src={user.image} alt=""/>{user.name}<i className="fas fa-angle-down"></i>
            </Link>
            <ul className='dropdown'>
                <li><Link to="/profile">Profile</Link></li>
                
                    {
                    (auth.isAdmin || auth.isVendor) &&
                   <li> <Link to="/map">Map</Link> </li>
                    }
               
                <li><Link to="/" onClick={async() => {
                    try {
                        
                        const  logout = await axios.delete('/user/logout')

                        //console.log(logout)
                            
                        localStorage.removeItem('firstLogin')
                        //console.log('here')
                        window.location.href = "/"

                    } catch(error) {
                        window.location.href = "/"
                    }
                }}>Logout</Link></li>
                <li>
                {auth.isLogged &&
                <Link to='history'>Prev Transactions</Link>
                }
                </li>
                <li>
                {
                !auth.isAdmin &&
                <Link to='items'>View Items</Link>
                }
                </li>                        
            </ul>
        </li>
    }

    const transForm = {
        transform: isLogged ? "translateY(-5px)" : 0
    }

    return (
        <header>
            <div className='logo'>
                <h1><Link to="/">SAVE UKRAINE     <ReactCountryFlag
                countryCode="UA"
                svg
                style={{
                    width: '2em',
                    height: '3em',
                }}
                title="UA"
            /></Link></h1>
                

               

            
            </div>

            <ul style={transForm}>
                <li>
                    

                    {
                    auth.isClient ?
                    <div>
                    <Link to="bag"><i className={`fas fa-cart-arrow-down ${currbag.length !== 0 && `fa-beat-fade`}`} style={{color:"red"}}></i>Bag</Link>
                    </div>
                    :
                    ''                    
                    }
                </li>
                    

                  
                
                  { auth.isVendor? 
                    
                    <>
                    <li><Link to="/newitem"><i className="fa-brands fa-shopify fa-beat-fade" style={{color:'red'}}></i>New Item</Link></li>
                    <li><Link to="/newtype"><i className="fa-solid fa-cart-flatbed-suitcase fa-beat-fade" style={{color:'red'}}></i>Create Type</Link></li>
                    </>
                    :
                    ''
                  }
                    
                

                {
                    isLogged ? userLink() :
                <li>
                     <Link to="/login"><i className="fas fa-users" style={{color:"red"}}></i>Login</Link>
                </li>
                }
            </ul>
        </header>
    )
}
