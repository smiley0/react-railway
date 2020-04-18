import React from 'react'
import {NavLink} from 'react-router-dom'
import './Navbar.css'
import logo from './logo.png'
import { connect } from 'react-redux'
import equal from 'fast-deep-equal'
import {removeState} from './localStorage'

class Navbar extends React.Component {
    state = {
        uname: "",
    }
    
  componentDidMount() {
    console.log("NAVBAR REDUX STATE")
    console.log(this.props.uname)

    this.forceUpdate();
  }
  componentDidUpdate(prevProps) {
    if(!equal(this.props.uname, prevProps.uname)) // Check if it's a new user, you can also use some unique property, like the ID  (this.props.user.id !== prevProps.user.id)
    {
        console.log("JOOOOOOOOOOOOOOOOOOOOOOOOOOOOO")
        console.log(prevProps)
        console.log(this.props)
      this.setState({uname: this.props.uname})
    }
  } 
  handleLogout = () => {
    removeState();
    this.props.updateUnameToken("", "")
                
  }
    render(){
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
                            <NavLink to='/'><button className="login" onClick={this.handleLogout}>Logout</button></NavLink>
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
                            <a href='/login'><button className="login">Login</button></a>
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
const mapDispatchToProps = (dispatch) => {
    return {
        updateUnameToken: (uname, token) => {dispatch({type: 'UPDATE_UNAME_TOKEN', uname: uname, token: token})}
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (Navbar)