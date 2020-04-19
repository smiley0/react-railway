import React from 'react'
import {connect} from 'react-redux'
import equal from 'fast-deep-equal'
//import {NavLink} from 'react-router-dom'


class User extends React.Component {
    state = {
        response: {},
        haveResponse: false,
        uname: "",
        token: "",
    }
    componentDidUpdate(prevProps) {
        if(!equal(this.props.uname, prevProps.uname)) // Check if it's a new user, you can also use some unique property, like the ID  (this.props.user.id !== prevProps.user.id)
        {
            console.log("JOOOOOOOOOOOOOOOOOOOOOOOOOOOOO")
            console.log(prevProps)
            console.log(this.props)
            this.setState({
              uname: this.props.uname,
              token: this.props.token,
            })
            this.getTickets();
        }
      } 
    getTickets = (post) => {
        var headers = {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Token '+this.props.token,
        }
        
        const requestOptions = {
            method: 'GET',
            headers: headers
        };
        fetch('http://127.0.0.1:8000/ticket/', requestOptions)
            .then(res => res.json())
            .then(json => {this.setState({
                haveResponse: true,
                response: json,
            })});
    }
    render(){
        if(this.state.token !== ""){
            console.log(this.state.token)
            console.log(this.state.response)
            let ticketsList = null;
            if(this.state.haveResponse){
            ticketsList = this.state.response.results.map((ticket, i) => {
                return(
                      <li key={i}>
                        <Ticket ticket={ticket}></Ticket>
                      </li>
                )
              })
            }
            return(
                <div>
                    <h1>Hello {this.state.uname}</h1>
                    <h2>Zakupene listky</h2>
                    <ul>
                        {this.state.haveResponse? ticketsList: null}
                    </ul>
                </div>
            )
        }
        else{
            return(
                <div>
                    <h1>Chyba</h1>                 
                </div>
            )
        }
    }
}

const mapStateToProps = (state) => {
    return {
        uname: state.uname,
        token: state.token,
    }
}

export default connect(mapStateToProps)(User)

class Ticket extends React.Component {
    state = {
        showMore: false,
    }
    showMore = () => {
        this.setState({showMore: !this.state.showMore})
    }
    render(){
        const ticket = this.props.ticket
        console.log()
        return(
            <div onClick={this.showMore}>
                <p>{ticket.segments[0].start.station_name} - 
                {ticket.segments[ticket.segments.length - 1].end.station_name}</p>
                <p>{ticket.valid_on} cena: {ticket.price}</p>
                {ticket.status === 'U'?<a href={ticket.paygate_link}>Zaplatit</a>: null}
                {this.state.showMore? 
                    <div>
                        <Segments passengers={ticket.passengers} reservations={ticket.reservations} segments={ticket.segments}></Segments>
                    </div>
                : null}
            </div>
        )
    }
}

class Segments extends React.Component {
    render(){
        const segments = this.props.segments
        const segment = segments.map((segment, i) => {
            return(
                  <li key={i}>
                    <div>
                        <p>{segment.start.station_name} {segment.start.departure_time}</p>
                        <p>{segment.end.station_name} {segment.end.arrival_time}</p>
                        <ul>
                            <Reservations passengers={this.props.passengers} id={segment.id} reservations={this.props.reservations}></Reservations>
                        </ul>
                    </div>
                  </li>
            )
          })
        return(
            <div>
                <ul>
                    {segment}
                </ul>
            </div>
        )
    }
}

class Reservations extends React.Component {
    render(){
        const reservations = this.props.reservations;
        const id = this.props.id;
        let sReservations = null;
        console.log(reservations)
        console.log(id)
        if(reservations.length > 0){
            let reservationsForSegment = reservations.filter((value) => {
                return value.train_segment === id;
            })
            sReservations = reservationsForSegment.map((reservation, i) => {
                return(
                    <li key={i}>
                        <ReservationInfo passengers={this.props.passengers} seat={reservation.seat_number} carriage={reservation.carriage} passengerID={reservation.passenger}></ReservationInfo>
                    </li>
                )
            })
        }
        return(
            <div>
                <ul>
                    {sReservations}
                </ul>
            </div>
        )
    }
}
 
class ReservationInfo extends React.Component {
    state = {
        seat: "",
        carriage: "",
        passenger: "",
    }
    componentDidMount = () => {
        fetch(this.props.carriage)
        .then(res => res.json())
            .then(json => {
                this.setState({
                    carriage: json.number,
                })
            });
        console.log(this.props.passengers)
        console.log(this.props.passengerID)

        let passenger = this.props.passengers.find(value => {
            return value.id === this.props.passengerID
        })
        console.log(passenger)
        this.setState({
            seat: this.props.seat,
            passenger: passenger.first_name + ' ' + passenger.last_name,
        })
        
    }
    render(){
        return(
            <div>
                <p>sedadlo: {this.state.seat}</p>
                <p>vozen: {this.state.carriage}</p>
                <p>uzivatel: {this.state.passenger}</p>
            </div>
        )
    }
}