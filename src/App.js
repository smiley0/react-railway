import React from 'react';
import Navbar from './components/Navbar'
import {BrowserRouter, Route} from 'react-router-dom'
import Home from './components/Home'
import Page from './components/Page'
import Select from './components/Select'
import Passenger from './components/Passenger'
import Footer from './components/Footer'
import User from './components/User'

import {loadState} from './components/localStorage'
import { connect } from 'react-redux'
import Prices from "./components/Prices";
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
        <Navbar/>
          <Route exact path='/' component={Home} />
          <Route path='/select' component={Select} />
          <Route path='/user/:username' component={User} />
          <Route path='/passenger' component={Passenger} />
          <Route path='/page/:page' component={Page} />
          <Route path='/prices' component={Prices} />
        <Footer/>
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