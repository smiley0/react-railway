import React from 'react'

const Navbar = () => {
    return(
        <nav id='navbar'>
            <div className='menu'>
                <div className='menu-left'>
                    <ul>
                        <li><a href='/'><span>Railway Co.</span></a></li>
                        <li><a href='/about'>About</a></li>
                    </ul>   
                </div>
                <div className='menu-right'>
                    <ul>
                        <li><a href='/register'>Register</a></li>
                        <li><a href='/login'>Login</a></li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}
export default Navbar