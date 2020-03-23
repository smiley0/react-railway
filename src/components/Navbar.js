import React from 'react'
import {NavLink} from 'react-router-dom'
import './Navbar.css'
import logo from './logo.png'

const Navbar = () => {
    return(
        <div>
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
                    <button className="login">Login</button>
                </div>
            </div>
        </nav>
        <nav id="snav">
            <div className='center'>
            <ul>
                <li><NavLink to='/' className='felem'><i className="fas fa-home"></i></NavLink></li>
                <li><NavLink to='#'>Rezervacie</NavLink></li>
                <li><NavLink to='#'>Vyluky</NavLink></li>
                <li><NavLink to='#'>Ceny a listky</NavLink></li>
                <li><NavLink to='#'>O nas</NavLink></li>
                <li><NavLink to='#'>Kontakt</NavLink></li>
            </ul>
            </div>
        </nav>
        </div>
    )
}
export default Navbar