import React from 'react'
import {connect} from 'react-redux'
import equal from 'fast-deep-equal'
import './Users.css'
import carriage from './carriage.png'
import seat from './seat.jpg'
//import {NavLink} from 'react-router-dom'


class User extends React.Component {
    state = {
        response: {},
        haveResponse: false,
        uname: "",
        token: "",
    }
    componentDidMount = () => {
        this.setState({
            uname: this.props.uname,
            token: this.props.token,
          })
        if(this.props.token !== ''){
            this.getTickets();
        }
    }
    componentDidUpdate(prevProps) {
        if(!equal(this.props.uname, prevProps.uname)) // Check if it's a new user, you can also use some unique property, like the ID  (this.props.user.id !== prevProps.user.id)
        {
            this.setState({
              uname: this.props.uname,
              token: this.props.token,
            })
            this.getTickets();
        }
      }
    getTickets = () => {
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
                response: json,
                haveResponse: true,
            })});
    }
    render(){
        if(this.state.token !== ""){
            let ticketsList = null;
            if(this.state.haveResponse){
            ticketsList = this.state.response.results.map((ticket, i) => {
                return(
                      <li key={i}>
                        <Ticket update={this.pudate} token={this.state.token} uname={this.state.uname} ticket={ticket}></Ticket>
                      </li>
                )
              })
            }
            return(
                <div className='center'>
                    <h1>Vitajte {this.state.uname}</h1>
                    <h2>Zakúpené lístky</h2>
                    <ul className='ticketList'>
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
        status: "",
        ticket: {},
    }
    componentDidMount = () => {
        this.setState({
            ticket: this.props.ticket,
        })
        if(this.props.ticket.status === 'P'){
            this.setState({
                status: "Zaplatený"
            })
        }
        else if(this.props.ticket.status === 'R'){
            this.setState({
                status: "Vrátený"
            })
        }
        else if(this.props.ticket.status === 'U'){
            this.setState({
                status: "Nezaplatený"
            })
        }
    }
    showMore = (e) => {
        if(e.target.nodeName !== 'BUTTON'){
            this.setState({showMore: !this.state.showMore})
        }
    }
    pay =(url) => {
        window.location.href = url+'&redir=http://localhost:3000/user/'+this.props.uname;
    }
    returnTicket = (id) => {
        if (!window.confirm("Chcete vrátiť lístok č." + id + "?")) {
            return;
        }

        var headers = {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Token '+this.props.token,
        }

        const requestOptions = {
            method: 'DELETE',
            headers: headers
        };
        fetch('http://127.0.0.1:8000/ticket/'+id+'/', requestOptions)
        .then(this._checkStatus).then(() => {
            let ticket = this.state.ticket;
            ticket.status = 'R';
            ticket.can_be_returned = false;
            this.setState({
            status: "Vrátený",
            ticket: ticket,
        })})
    }
    render(){
        let ticket = this.props.ticket
        
        return(
            <div className='ticket' onClick={this.showMore}>
                <div className='content-ticket'>
                <div className='l-content-ticket'>
                    <h2>Cestovný lístok <small>#{ticket.id}</small> <small className="right">{this.state.status}</small></h2>
                    <p className="routeInfo">{ticket.segments[0].start.station_name}&nbsp;-&nbsp;
                    {ticket.segments[ticket.segments.length - 1].end.station_name}</p>
                    <p><strong>Platí od:</strong> {ticket.valid_on}</p>

                    {ticket.status === 'U'?<button onClick={() => {this.pay(ticket.paygate_link)}}>Zaplatiť</button>: null}
                    {this.state.ticket.can_be_returned?<button onClick={() => {this.returnTicket(this.state.ticket.id)}}>Vrátiť lístok</button>:null}

                    {this.state.showMore?
                            <Segments passengers={ticket.passengers} reservations={ticket.reservations} segments={ticket.segments}/>
                    : null}
                </div>
                <div className='r-content-ticket'>   
                    <Passengers ticket={this.state.ticket} passengers={ticket.passengers}/>
                    <p>cena: {ticket.price} €</p>
                </div>
                </div>
            </div>
        )
    }
}
class Passengers extends React.Component {
    state = {
        passenger_types: {},
        isLoaded: false,
        ticket: {},
    }
    componentDidMount = () => {
        this.setState({ticket: this.props.ticket})
        fetch("http://127.0.0.1:8000/passenger-type/")
        .then(res => res.json())
            .then(json => {
                this.setState({
                    isLoaded: true,
                    passenger_types: json,
                })
            });
    }
    componentDidUpdate = () => {
        if(!equal(this.props.ticket, this.state.ticket)){
            this.setState({
                ticket: this.props.ticket,
            })
        }
    }
    returnTypeName = (type) => {
        let pass_type = this.state.passenger_types.results.find((val) => {
            return val.short === type;
          });
        return pass_type.name
    }

    render(){
        const passengers = this.props.passengers.map((value, i) => {
            return(
                <li key={i}>
                    {value.first_name} {value.last_name} - {this.state.isLoaded? this.returnTypeName(value.type):null}
                </li>
            )
        })
        return(
            <div>
                <h3>Cestujúci</h3>
                <ul>
                    {passengers}
                </ul>
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
                        <table className='segment'>
                            <tbody>
                                <tr>
                                    <td><i className="fas fa-subway"/> {segment.train.category_short} {segment.train.number} {segment.train.name}</td>
                                    <td>{segment.start.station_name}</td>
                                    <td>{segment.start.departure_time}</td>
                                </tr>
                                <tr>
                                    <td/>
                                    <td>{segment.end.station_name}</td>
                                    <td>{segment.end.arrival_time}</td>
                                </tr>
                            </tbody>
                        </table>
                        <ul>
                            <Reservations passengers={this.props.passengers} id={segment.id} reservations={this.props.reservations}/>
                        </ul>
                    </div>
                  </li>
            )
          })
        return(
            <div className='advancedInfo'>
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
        if(reservations.length > 0){
            let reservationsForSegment = reservations.filter((value) => {
                return value.train_segment === id;
            })
            sReservations = reservationsForSegment.map((reservation, i) => {
                return(
                    <li key={i}>
                        <ReservationInfo passengers={this.props.passengers} seat={reservation.seat_number} carriage={reservation.carriage} passengerID={reservation.passenger}/>
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

        let passenger = this.props.passengers.find(value => {
            return value.id === this.props.passengerID
        })
        this.setState({
            seat: this.props.seat,
            passenger: passenger.first_name + ' ' + passenger.last_name,
        })

    }
    render(){
        return(
            <div className="seatsReservations">
                <img src={carriage} alt="carriage" height="25"/>
                <span> {this.state.carriage}  </span>
                <img src={seat} alt="seat" height="25"/>
                <span> {this.state.seat}  </span>
                <i className="fas fa-user"/>
                <span> {this.state.passenger}  </span>
            </div>
        )
    }
}
