import React from 'react';
import Navbar from './components/Navbar'
import {BrowserRouter, Route} from 'react-router-dom'
import Home from './components/Home'
import About from './components/About'
import Select from './components/Select'
import Passenger from './components/Passenger'
import Footer from './components/Footer'


function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Navbar></Navbar>
        <Route exact path='/' component={Home} />
        <Route path='/about' component={About} />
        <Route path='/select' component={Select} />
        <Route path='/passenger' component={Passenger} />
        <Footer></Footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
