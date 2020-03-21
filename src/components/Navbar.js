import React from 'react'
import {NavLink} from 'react-router-dom'

const Navbar = () => {
    return(
        <nav id='navbar'>
            <div className='menu'>
                <div className='menu-left'>
                    <ul>
                        <li><NavLink to='/'><span>Railway Co.</span></NavLink></li>
                        <li><NavLink to='/about'>About</NavLink></li>
                    </ul>   
                </div>
                <div className='menu-right'>
                    <ul>
                        <li><NavLink to='/register'>Register</NavLink></li>
                        <li><NavLink to='/login'>Login</NavLink></li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}
export default Navbar