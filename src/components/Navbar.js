import React from 'react'
import {NavLink} from 'react-router-dom'
import './Navbar.css'
import logo from './logo.png'

const Navbar = () => {
    return(
        <nav id='navbar'>
            <div className='center'>
                <div className='left'>
                    <NavLink to='/'><img src={logo} alt="logo"></img></NavLink>                        
                    <ul>
                        <li><span>SK</span></li>
                        <li>/</li>
                        <li><span>EN</span></li>
                    </ul>
                </div>
                <div className='right'>
                    <button className="register">Register</button>
                    <button>Login</button>
                </div>
            </div>
        </nav>
    )
}
export default Navbar