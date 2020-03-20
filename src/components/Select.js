import React from 'react'
import {connect} from 'react-redux'

class Select extends React.Component {
    render(){
        console.log(this.props)
        return(
            <div>
                <h1> Select </h1>
                <p>Tu sa vyberie z ponuky vlakov</p>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        searchInfo: state.searchInfo
    }
}

export default connect(mapStateToProps)(Select)