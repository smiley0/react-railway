import React from 'react';
import Navbar from './components/Navbar'
import {BrowserRouter, Route} from 'react-router-dom'
import Home from './components/Home'
import About from './components/About'
import Select from './components/Select'
import Passenger from './components/Passenger'
import Processing from './components/Processing'
import Footer from './components/Footer'
import Login from './components/Login'


const App = () => {
  return (
    <BrowserRouter>
      <div className="App">
        <Navbar></Navbar>
        <Route exact path='/' component={Home} />
        <Route path='/login' component={Login} />
        <Route path='/about' component={About} />
        <Route path='/select' component={Select} />
        <Route path='/passenger' component={Passenger} />
        <Route path='/processing' component={Processing} />
        <Footer></Footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
