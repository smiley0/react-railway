import React from 'react';
import Navbar from './components/Navbar'
import {BrowserRouter, Route} from 'react-router-dom'
import Home from './components/Home'
import About from './components/About'
import Select from './components/Select'
import Passenger from './components/Passenger'
import Footer from './components/Footer'
import Login from './components/Login'
import User from './components/User'

import {loadState} from './components/localStorage'
import { connect } from 'react-redux'
//import {compose} from 'redux'


class App extends React.Component {
  componentDidMount = () => {
    console.log("LOCAL STORAGE")
    const state = loadState();
    console.log(state)
    if(state !== undefined){
        this.props.updateState(state)
        console.log('NAVBAR STATE')
        console.log(state)
        this.forceUpdate();
    }
  }
  render(){
    console.log("APP ROUTER")
    console.log(window.location.pathname)
    return (
      <BrowserRouter>
        <div className="App">
        {/*<Navbar></Navbar>*/}
          {window.location.pathname !== '/login'?<Navbar></Navbar>:null}
          <Route exact path='/' component={Home} />
          <Route path='/login' component={Login} />
          <Route path='/about' component={About} />
          <Route path='/select' component={Select} />
          <Route path='/user/:username' component={User} />
          <Route path='/passenger' component={Passenger} />
          {window.location.pathname !== '/login'?<Footer></Footer>:null}
        {/*<Footer></Footer>*/}
        </div>
      </BrowserRouter>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
      updateState: (state) => {dispatch({type: 'SET_WHOLE_STATE', state: state})}
  }
}

const mapStateToProps = (state) => {
  return {
      state: state,
  }
}

export default connect(mapStateToProps, mapDispatchToProps) (App)
/*export default compose(
  withRouter, 
  connect(mapStateToProps, mapDispatchToProps)
) (App)*/