import React from 'react'
import {connect} from 'react-redux'
//import {NavLink} from 'react-router-dom'
//import Loading from './Loading'

class Processing extends React.Component {
    state = {
        error: false,
        post: {
            valid_on:"",
            passengers: {},
            segments: {},
            reservations:[],
        },
        haveResponse: false,
        response: {},
        post2: {
            valid_on: "2020-04-11",
            segments: {
              additionalProp1: {
                start: 606,
                end: 611
              }
            },
            passengers: {
              additionalProp1: {
                first_name: "test",
                last_name: "test",
                type: "S"
              }
            },
            reservations: []
          }
    }

    componentDidMount = () => {
        if(this.props.passengers.length>0){
        var post = {...this.state.post}
        let dateSlice = this.props.searchInfo.date.split(".");
        post.valid_on = dateSlice[2]+"-"+dateSlice[1]+"-"+dateSlice[0];
        console.log("DATE")
        console.log(post.valid_on)
        this.props.passengers.forEach((element, i) => {
            post.passengers[i] = {first_name: element.fname,
                                  last_name: element.lname,
                                  type: element.type_short,}
        });
        console.log(this.props.trains)
        let reservations = []
        this.props.trains.forEach((train, i) => {
            post.segments[i] = {start: train.fromID, end: train.toID}
            train.users.forEach((user, j) => {
                if(user.reserved){
                    var reservation = {}
                    reservation.segment_id = i
                    reservation.passenger_id = j
                    reservation.carriage = user.carriageID
                    reservation.seat_number = user.seatID
                    reservations.push(reservation)
                }
            })
        });
        post.reservations = reservations
        this.setState({post:post})
        console.log("completeTicket")
        console.log(post)
        this.postTicket(post)

    }
    else{
        this.setState({
            error: true,
        })
    }
    }

    postTicket = (post) => {
        var headers = new Headers();
        headers.append('Authorization', 'Basic ' + btoa('marian:heslo123'));
        headers.append('Content-Type', 'application/json');
        headers.append('accept', 'application/json');
        
        console.log("POST TICKET METHOD")
        const requestOptions = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(post)
        };
        console.log(requestOptions)
        fetch('http://127.0.0.1:8000/ticket/', requestOptions)
            .then(res => res.json())
            .then(json => {this.setState({
                haveResponse: true,
                response: json,
            })});
    }

    render(){
        console.log("Processing")
        console.log(this.state)
        if(this.state.error){
            return(
            <div>
                <h1> Ups. Vyskytla sa chyba</h1>
            </div>
            )
        }
        else{
        if(this.state.haveResponse){
            console.log("RESPONSE")
            console.log(this.state.response)
            const url = this.state.response.paygate_link+'&redir=http://localhost:3000/processing';
            console.log("paygateURL")
            console.log(url)
            window.open(url, '_blank')
            return(
                <div>
                    <h1> we have a response</h1>
                </div>
            )
        }
        else {
            return(
                <div className="center processing">
                    <h1> Processing !!!!!!!!!! </h1>
                    <h2> cena: {this.props.price}</h2>
                    <p>{this.props.searchInfo.date}</p>
                </div>
            )
        }
    }
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