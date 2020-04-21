import React from 'react'
import SearchConnections from './SearchConnections'
import './Home.css'
import firstClass from '../firstClass.jpg'
import faster from '../faster.jpg'
import {Link} from 'react-router-dom'

const Home = () => {
    return(
        <div className='home'>
            <div className='bg'>
                <div className='center'>
                    <SearchConnections/>
                    <div className='infobox'>
                        <div className='left sbox'>
                            <h3>Lorem ipsum</h3>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam vehicula tempor dapibus. Donec mollis et magna in tempor. Duis ac tortor ac velit dictum bibendum. Donec aliquet, ligula ac dapibus porta, massa justo porta metus, sed posuere nunc dui a nulla.</p>
                        </div>
                        <div className='left sbox'>
                        <h3>Lorem ipsum</h3>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam vehicula tempor dapibus. Donec mollis et magna in tempor. Duis ac tortor ac velit dictum bibendum. Donec aliquet, ligula ac dapibus porta, massa justo porta metus, sed posuere nunc dui a nulla.</p>
                        </div>
                        <div className='left sbox'>
                        <h3>Lorem ipsum</h3>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam vehicula tempor dapibus. Donec mollis et magna in tempor. Duis ac tortor ac velit dictum bibendum. Donec aliquet, ligula ac dapibus porta, massa justo porta metus, sed posuere nunc dui a nulla.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className='center setTop'>
                <div className='left lbox'>
                    <Link to='#'>
                        <img src={firstClass} alt='firstClass'/>
                        <h4>Lorem ipsum</h4>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam vehicula tempor dapibus.</p>
                        <span className='moreinfo'><i className="fas fa-angle-double-right fa-2x"/>More information</span>
                    </Link>
                </div>
                <div className='right lbox'>
                    <Link to='#'>
                        <img src={faster} alt='faster'/>
                        <h4>Lorem ipsum</h4>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam vehicula tempor dapibus.</p>
                        <span className='moreinfo'><i className="fas fa-angle-double-right"/>More information</span>
                    </Link>
                </div>
            </div>
                
        </div>
    )
}
export default Home