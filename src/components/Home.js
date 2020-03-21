import React from 'react'
import SearchConnections from './SearchConnections'
import './Home.css'

const Home = () => {
    return(
        <div className='home'>
            <div className='bg'>
            <div className='center'>
                <h2>Home</h2>
                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. </p>
                <SearchConnections></SearchConnections>
            </div>
            </div>
        </div>
    )
}
export default Home