import React from 'react'
import {NavLink} from 'react-router-dom'
import './Navbar.css'
import logo from './logo.png'
import { connect } from 'react-redux'

class Navbar extends React.Component {
    render(){
        console.log("registered user")
        console.log(this.props.uname)
        if(this.props.uname !== ""){
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
                            <NavLink to={'/user/'+this.props.uname}><div className="userName"><h3>{this.props.uname}</h3></div></NavLink>
                            <NavLink to='/login'><button className="login">Logout</button></NavLink>
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
        else{
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
                            <NavLink to='/login'><button className="login">Login</button></NavLink>
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
    }
}

const mapStateToProps = (state) => {
    return {
        uname: state.uname,
    }
}

export default connect(mapStateToProps) (Navbar)