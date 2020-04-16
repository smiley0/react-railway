import React from 'react'
import {connect} from 'react-redux'
//import Loading from './Loading'

class Processing extends React.Component {
    state = {
        trains: {},
        passengers: {},
        price: "",
        searchInfo: {},
    }

    render(){
        console.log("Processing")
        console.log(this.state)
        return(
            <div className="center processing">
                <h1> Processing !!!!!!!!!! </h1>
                <h2> cena: {this.props.price}</h2>
                <p>{this.props.searchInfo.date}</p>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        trains: state.trains,
        passengers: state.passengers,
        price: state.price,
        searchInfo: state.searchInfo,
    }
}

export default connect(mapStateToProps)(Processing)