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
        haveRegistrationResponse: false,
        registrationResponse: {},
        uname: "",
        display: false,
        register_display: false,
        uname2: "",
        psw: "",
        rpsw: "",
        fname: "",
        lname: "",
        email: "",
        loginError: false,
        loginErrorMessage: "",
        registerError: false,
        registerErrorMessage: "",
    }

  componentDidMount() {
    this.forceUpdate();
  }
  componentDidUpdate(prevProps, prevState) {
    if(!equal(this.props.uname, prevProps.uname)) // Check if it's a new user, you can also use some unique property, like the ID  (this.props.user.id !== prevProps.user.id)
    {
      this.setState({uname: this.props.uname})
    }
    if(prevState.haveResponse !== this.state.haveResponse){
        this.closeLogin();
        this.closeRegister();
        this.forceUpdate();
    }
    if(prevState.haveRegistrationResponse !== this.state.haveRegistrationResponse){
        /* Prisla kladna odpoved */
        if(this.state.registrationResponse.hasOwnProperty('username')){
            if(this.state.registrationResponse.username === this.state.uname2){
                this.handleClick();
            }
        }
    }
  }
  handleLogout = () => {
    removeState();
    this.props.updateUnameToken("", "")

  }

  login = () => {
      this.setState({display: true})
  }
  register = () => {
      this.setState({register_display: true})
  }
  checkClick = (event) => {
      if(event.target.className === 'loginPage'){
          this.setState({display: false})
      }
  }
  checkRegisterClick = (event) => {
      if(event.target.className === 'registerPage'){
        this.setState({register_display: false})
      }
  }
  closeLogin = () => {
    this.setState({display: false})
  }
  closeRegister = () => {
      this.setState({register_display: false})
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
        fetch('http://127.0.0.1:8000/accounts/login/', requestOptions)
            .then(res => {
                const statusCode = res.status;
                const data = res.json();
                return Promise.all([statusCode, data]);
            })
            .then(([res, data]) => {
                if(res === 200){
                    let state = this.props.state;
                    state.token = data.token;
                    state.uname = this.state.uname2;
                    saveState(state);
                    this.props.updateState(state);
                    this.setState({
                        haveResponse: true,
                        loginError: false,
                        //response: json,
                    })
                }
                else{
                    this.setState({
                        loginError: true,
                        loginErrorMessage: data.detail,
                    })
                }
            })
            .catch(error => {
                console.error(error);
            })
    }
    handleRegisterClick = () => {
        const post = {};
        post.username = this.state.uname2;
        post.first_name = this.state.fname;
        post.last_name = this.state.last_name;
        post.email = this.state.email;
        post.password = this.state.psw;
        post.password_confirm = this.state.rpsw;
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('accept', 'application/json');

        const requestOptions = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(post)
        };

        fetch('http://127.0.0.1:8000/accounts/register/', requestOptions)
            .then(res => {
                const statusCode = res.status;
                const data = res.json();
                return Promise.all([statusCode, data]);
            })
            .then(([res, data]) => {
                if(res === 201){
                    this.setState({
                        registrationResponse: data,
                        haveRegistrationResponse: true,
                        registerError: false,
                    })
                }
                else{
                    this.setState({
                        registerError: true,
                    })
                    if('username' in data){
                        this.setState({
                            registerErrorMessage: data.username[0],
                        })
                    }
                    else if('password_confirm' in data){
                        this.setState({
                            registerErrorMessage: data.password_confirm[0],
                        })
                    }
                    else{
                        this.setState({
                            registerErrorMessage: 'An error has occurred',
                        })
                    }
                }
            })
            .catch(error => {
                console.error(error);
            })

    }
    handleChange = (e) => {
        if(e.target.id === "uname"){
            this.setState({uname2: e.target.value})
        }
        else if(e.target.id === "psw"){
            this.setState({psw: e.target.value})
        }
        else if(e.target.id === "rpsw"){
            this.setState({rpsw: e.target.value})
        }
        else if(e.target.id === "fname"){
            this.setState({fname: e.target.value})
        }
        else if(e.target.id === "lname"){
            this.setState({lname: e.target.value})
        }
        else if(e.target.id === "email"){
            this.setState({email: e.target.value})
        }
    }
    render(){
        return (
            <div>
                {this.state.display ?
                    <div className='modalPage' onClick={this.checkClick}>
                        <div className='formContent'>
                            <form onSubmit={this.handleSubmit}>
                                <div className='imageContent'>
                                    <span className='close'><i onClick={this.closeLogin} className="fas fa-times fa-2x"/></span>
                                    <img src={avatar} alt="Avatar" className="avatar"/>
                                </div>
                                <div className="loginForm">
                                    <label htmlFor="uname"><b>Username</b></label>
                                    <input id='uname' onChange={this.handleChange} type="text" placeholder="Enter Username" name="uname" required/>

                                    <label htmlFor="psw"><b>Password</b></label>
                                    <input id='psw' onChange={this.handleChange} type="password" placeholder="Enter Password" name="psw" required/>

                                    {this.state.loginError? <span className='errorMessage'>{this.state.loginErrorMessage}</span>: null}

                                    <button onClick={this.handleClick} type="submit">Login</button>
                                    <label> Remember me</label>
                                    <input type="checkbox" name="remember" defaultChecked/>

                                </div>
                            </form>
                        </div>
                    </div> :
                    null
                }
                {this.state.register_display ?
                    <div className='modalPage' onClick={this.checkRegisterClick}>
                        <div className='formContent'>
                            <div className='introContent'>
                                <h1>Zaregistrujte sa</h1>
                                <p>Prosím vyplnte formulár k vytvoreniu účtu <span>(* - povinné údaje)</span></p>

                                <span className='close'><i onClick={this.closeRegister} className="fas fa-times fa-2x"/></span>
                                <hr/>
                            </div>
                            <form onSubmit={this.handleSubmit}>
                                <div className="loginForm">
                                    <label htmlFor="uname"><b>Username *</b></label>
                                    <input id='uname' onChange={this.handleChange} type="text" placeholder="Enter Username" name="uname" required/>

                                    <label htmlFor="fname"><b>First name</b></label>
                                    <input id='fname' onChange={this.handleChange} type="text" placeholder="Enter First name" name="fname"/>

                                    <label htmlFor="lname"><b>Last name</b></label>
                                    <input id='lname' onChange={this.handleChange} type="text" placeholder="Enter Last name" name="lname"/>

                                    <label htmlFor="email"><b>Email</b></label>
                                    <input id='email' onChange={this.handleChange} type="text" placeholder="Enter Email" name="email"/>

                                    <label htmlFor="psw"><b>Password *</b></label>
                                    <input id='psw' onChange={this.handleChange} type="password" placeholder="Enter Password" name="psw" required/>

                                    <label htmlFor="psw-repeat"><b>Repeat Password *</b></label>
                                    <input id='rpsw' onChange={this.handleChange} type="password" placeholder="Repeat Password" name="psw-repeat" required/>

                                    {this.state.registerError? <span className='errorMessage'>{this.state.registerErrorMessage}</span>: null}

                                    <button onClick={this.handleRegisterClick} type="submit">Register</button>

                                    <label> Remember me</label>
                                    <input type="checkbox" name="remember" defaultChecked/>

                                </div>
                            </form>
                        </div>
                    </div>:
                    null
                }
                {this.props.uname !== "" ? (
                    <nav id='navbar'>
                        <div className='center'>
                            <div className='left'>
                                <NavLink to='/'><img src={logo} alt="logo"/></NavLink>
                            </div>
                            <div className='right'>
                                <NavLink to={'/user/'+this.props.uname}><div className="userName"><h3>{this.props.uname}</h3></div></NavLink>
                                <NavLink to='/'><button className="login" onClick={this.handleLogout}>Logout</button></NavLink>
                            </div>
                        </div>
                    </nav>
                ) : (
                    <nav id='navbar'>
                        <div className='center'>
                            <div className='left'>
                                <NavLink to='/'><img src={logo} alt="logo"/></NavLink>
                            </div>
                            <div className='right'>
                                <button onClick={this.register} className="register">Register</button>
                                {/*<a href='/login'><button className="login">Login</button></a>*/}
                                <button onClick={this.login} className="login">Login</button>
                            </div>
                        </div>
                    </nav>
                )}
                <nav id="snav">
                    <div className='center'>
                        <ul>
                            <li><NavLink to='/' className='felem'><i className="fas fa-home"/></NavLink></li>
                            <li><NavLink to='/page/reservations'>Rezervácie</NavLink></li>
                            <li><NavLink to='/page/changes'>Výluky</NavLink></li>
                            <li><NavLink to='/prices'>Ceny a lístky</NavLink></li>
                            <li><NavLink to='/page/about'>O nás</NavLink></li>
                            <li><NavLink to='/page/contact'>Kontakt</NavLink></li>
                        </ul>
                    </div>
                </nav>
            </div>
        )
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
