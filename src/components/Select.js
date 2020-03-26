import React from 'react'
import {connect} from 'react-redux'
import SelectOptions from './SelectOptions'
import './Select.css'
import Loading from './Loading'

class Select extends React.Component {
    state = {
        url: "",
        items: [],
        isLoaded: false,
    }

    componentDidMount(){
        this.setState(
            {
                url: "http://127.0.0.1:8000/results/?src="+this.props.searchInfo.src + "&dst=" + this.props.searchInfo.dst + "&time=" + this.props.searchInfo.time + "&limit=5",
            }
        )
        console.log(">>>>"+this.state.url)
        fetch("http://127.0.0.1:8000/results/?src="+this.props.searchInfo.src + "&dst=" + this.props.searchInfo.dst + "&time=" + this.props.searchInfo.time + "&limit=5")
            .then(res => res.json())
            .then(json => {
                this.setState({
                    isLoaded: true,
                    items: json,
                })
            });
    }

    render(){
        console.log('props')
        console.log(this.props)
        //?time=8:00&src=Krivan&dst=Bratislava
        
        var { isLoaded, items} = this.state;

        if (!isLoaded) {
            return (
            <div className='center bigLoad'>
                <Loading></Loading>
            </div>
            )
        }
        else {
            return(
                <div className="center select">
                    <h1> Nájdené spojenia </h1>
                    <SelectOptions items={items} date={this.props.searchInfo.date}></SelectOptions>
                </div>
            )
        }
    }
}

const mapStateToProps = (state) => {
    return {
        searchInfo: state.searchInfo
    }
}

export default connect(mapStateToProps)(Select)