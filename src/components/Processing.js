import React from 'react'
import {connect} from 'react-redux'
//import Loading from './Loading'

class Processing extends React.Component {
    state = {
        post: {
            owner: 1,
            valid_on:"",
            price: "",
            status: "U",
            passengers: {},
            segments: {},
            reservations:[
                {
                    carriage: "",
                    seat_number: "",
                    segment_id: "",
                    passenger_id: "",
                }
            ]
        }
    }

    componentDidMount = () => {
        var post = {...this.state.post}
        post.price = this.props.price;
        post.valid_on = this.props.searchInfo.date;
        this.props.passengers.forEach((element, i) => {
            console.log("passenger")
            console.log(element)
            post.passengers[i] = {first_name: element.fname,
                                  last_name: element.lname,
                                  type: element.type_short,}
        });
        console.log(this.props.trains)
        this.props.trains.forEach((element, i) => {
            post.segments[i] = {start: element.fromID, end: element.toID}
        });
        this.setState({post})
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