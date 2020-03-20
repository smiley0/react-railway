import React from 'react'
import {connect} from 'react-redux'

class Select extends React.Component {
    state = {
        url: "",
    }

    componentDidMount(){
        this.setState(
            {
                url: "?src="+this.props.searchInfo.src + "&dst=" + this.props.searchInfo.dst + "&time=" + this.props.searchInfo.time,
            }
        )
    }

    render(){
        console.log(this.props)
        console.log(this.props.searchInfo)
        console.log(this.props.searchInfo.src)
        //?time=8:00&src=Krivan&dst=Bratislava

        return(
            <div>
                <h1> Select </h1>
                <p>{this.state.url}</p>
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