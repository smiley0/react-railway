import React from 'react'
import SearchConnections from './SearchConnections'
import './Home.css'

const Home = () => {
    return(
        <div className='home'>
            <div className='bg'>
            <div className='center'>
                <SearchConnections></SearchConnections>
            </div>
            </div>
        </div>
    )
}
export default Home