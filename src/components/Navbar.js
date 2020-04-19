import React from 'react'
import {NavLink} from 'react-router-dom'
import './Navbar.css'
import logo from './logo.png'
import { connect } from 'react-redux'
import equal from 'fast-deep-equal'
import {removeState, saveState} from './localStorage'
import avatar from './avatar.jpg'

class Navbar extends React.Component {
    state = {
        haveResponse: false,
        uname: "",
        display: false,
        uname2: "",
        psw: "",
    }
    
  componentDidMount() {
    console.log("NAVBAR REDUX STATE")
    console.log(this.props.uname)

    this.forceUpdate();
  }
  componentDidUpdate(prevProps, prevState) {
    if(!equal(this.props.uname, prevProps.uname)) // Check if it's a new user, you can also use some unique property, like the ID  (this.props.user.id !== prevProps.user.id)
    {
        console.log("JOOOOOOOOOOOOOOOOOOOOOOOOOOOOO")
        console.log(prevProps)
        console.log(this.props)
      this.setState({uname: this.props.uname})
    }
    if(prevState.haveResponse !== this.state.haveResponse){
        this.closeLogin();
        this.forceUpdate();
    }
  } 
  handleLogout = () => {
    removeState();
    this.props.updateUnameToken("", "")
                
  }
  login = () => {
      console.log("Login was clicked")
      this.setState({display: true})      
  }
  checkClick = (event) => {
      console.log("EVENT")
      console.log(event.target.className)
      if(event.target.className === 'loginPage'){
          this.setState({display: false})
      }
  }
  closeLogin = () => {
    this.setState({display: false})
  }
  handleSubmit = (e) => {
    e.preventDefault();
    }
    handleClick = () => {
        const post = {};
        post.login = this.state.uname2;
        post.password = this.state.psw;
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('accept', 'application/json');

        const requestOptions = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(post)
        };
        console.log("REQUEST OPTIONS")
        console.log(requestOptions)
        fetch('http://127.0.0.1:8000/accounts/login/', requestOptions)
            .then(res => res.json())
            .then(json => {
                let state = this.props.state;
                state.token = json.token;
                state.uname = this.state.uname2;

                console.log(state)
                saveState(state);
                this.props.updateState(state);
                //this.forceUpdate;
                this.setState({
                    haveResponse: true,
                    //response: json,
                })
            });
    }
    handleChange = (e) => {
        if(e.target.id === "uname"){
            this.setState({uname2: e.target.value})
        }
        else if(e.target.id === "psw"){
            this.setState({psw: e.target.value})
        }
        
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
                {this.state.display?
                    <div className='loginPage' onClick={this.checkClick}>
                        <div className='formContent'>
                            <form onSubmit={this.handleSubmit}>
                                <div className='imageContent'>
                                    <span className='close'><i onClick={this.closeLogin} className="fas fa-times fa-2x"></i></span>
                                    <img src={avatar} alt="Avatar" className="avatar"></img>
                                </div>
                                <div className="loginForm">
                                    <label htmlFor="uname"><b>Username</b></label>
                                    <input id='uname' onChange={this.handleChange} type="text" placeholder="Enter Username" name="uname" required></input>

                                    <label htmlFor="psw"><b>Password</b></label>
                                    <input id='psw' onChange={this.handleChange} type="password" placeholder="Enter Password" name="psw" required></input>
                                        
                                    <button onClick={this.handleClick} type="submit">Login</button>
                                    <label> Remember me</label>
                                    <input type="checkbox" name="remember" defaultChecked></input>
                                    
                                </div>   
                            </form>  
                        </div>              
                    </div> :
                    null
                }
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
                            {/*<a href='/login'><button className="login">Login</button></a>*/}
                            <button onClick={this.login} className="login">Login</button>
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
        state: state,
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        updateUnameToken: (uname, token) => {dispatch({type: 'UPDATE_UNAME_TOKEN', uname: uname, token: token})},
        updateState: (state) => {dispatch({type: 'SET_WHOLE_STATE', state: state})}
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (Navbar)