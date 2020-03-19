import React from 'react';
import Navbar from './components/Navbar'
import {BrowserRouter, Route} from 'react-router-dom'
import Home from './components/Home'
import About from './components/About'

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Navbar></Navbar>
        <Route exact path='/' component={Home} />
        <Route path='/about' component={About} />
      </div>
    </BrowserRouter>
  );
}

export default App;
