import React from 'react'
import Loading from './Loading'
import {connect} from 'react-redux'
//import {NavLink} from 'react-router-dom'
import './Passenger.css'
import {compose} from 'redux'
import { withRouter } from 'react-router-dom';
import equal from 'fast-deep-equal'

class Passenger extends React.Component {
    state = {
      reservation: true,
      isLoaded: false,
      passenger_types: [],
      passengers: [{id:0,fname:"",lname:"", type:"", type_short:"", showType:false}],
      trains: [],
      response: {},
      haveResponse: false,
    }

    componentDidMount(){
        fetch("http://127.0.0.1:8000/passenger-type/")
        .then(res => res.json())
            .then(json => {
                this.setState({
                    isLoaded: true,
                    passenger_types: json,
                })
            });

       this.setState({
           trains: this.addTrains(),
       })
    }

    componentDidUpdate = () => {
        if(this.state.haveResponse){
            const url = this.state.response.paygate_link+'&redir=http://localhost:3000/user/'+this.props.uname;
            window.location.href = url;
        }
    }

    addTrains = () => {
        let T = []
        let trains = this.props.connectionInfo.transfer_history
        for(let i =0;i<trains.length;i+=1){
            T.push({train: trains[i].train.number, tDistance: trains[i].stop_to.distance - trains[i].stop_from.distance,
                from: trains[i].stop_from.station_name, fromID: trains[i].stop_from.id, to: trains[i].stop_to.station_name, toID: trains[i].stop_to.id,
                category: trains[i].train.category_short, users: [{id: 0, reserved: false, carriageID:null, seatID:null,}]})
        }
        return T;
    }

    setTrains = (trainsRes) =>{
        this.setState({
            trains: trainsRes
        })
    }

    addRow = () => {
        var rows = this.state.passengers;
        const nextId = this.state.passengers[this.state.passengers.length-1].id + 1;
        const newrow = {id: nextId,fname:"",lname:"", type:"", type_short:""};
        //newrow.trains = this.addTrains()
        rows.push(newrow)
        this.setState({
            passengers: rows
        })

        var trains = this.state.trains
        for(let i =0;i<trains.length;i+=1){
            trains[i].users.push({id: nextId, reserved: false, carriageID:null, seatID:null,})
        }
        this.setState({
            trains: trains,
        })
    }

    findID(array, id){
        for(var i = 0; i<array.length; i+=1){
            if(array[i]["id"] === id){
                return i;
            }
        }
        return -1;
    }

    removeRow = (i) =>{
        if(this.state.passengers.length > 1){
            var rows = this.state.passengers
            const index = this.findID(rows, i);
            if (index > -1) {
                rows.splice(index, 1);
            }
            this.setState({
                passengers: rows
            })

            var trains = this.state.trains
            for(let k =0;k<trains.length;k+=1){
                for(let j=0; j< trains[k].users.length; j+=1){
                    if(trains[k].users[j].id === i){
                        trains[k].users.splice(j, 1);
                    }
                }
            }
            this.setState({
                trains: trains,
            })
        }
        /*
        else{
            const row = [{id: 0,fname:"",lname:"", type:"", type_short:""}];
            this.setState({
                passengers: row,
                trains: this.addTrains(),
            })
        }
        */
    }

    toggleShow = (id) => {
        var index = this.findID(this.state.passengers, id);
        var rows = this.state.passengers;
        rows[index].showType = !rows[index].showType;
        this.setState({
            passengers: rows
        })
      };

    addType = (id, type) => {
        var rows = this.state.passengers;
        var index = this.findID(this.state.passengers, id);
        rows[index].type = type;
        let pass_type = this.state.passenger_types.results.find((val) => {
            return val.name === type;
          });

        rows[index].type_short = pass_type.short;
        //rows[index].typeID =
        this.setState({
            passengers: rows
        })
        this.toggleShow(id)
    }
    handleChange = (e, id) => {
        var rows = this.state.passengers;
        var index = this.findID(this.state.passengers, id);
        if(e.target.id === "fname"){
            rows[index].fname = e.target.value;
            this.setState({passengers: rows})
        }
        else if(e.target.id === "lname"){
            rows[index].lname = e.target.value;
            this.setState({passengers: rows})
        }


    }
    postTicket = (post) => {
        var headers = {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Token '+this.props.token,
        }

        const requestOptions = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(post)
        };
        fetch('http://127.0.0.1:8000/ticket/', requestOptions)
            .then(res => res.json())
            .then(json => {this.setState({
                haveResponse: true,
                response: json,
            })});
    }
    handleUpdate = () => {
        let valid = true;
        let message = "";
        for(let i = 0; i < this.state.passengers.length; i += 1){
            for (const property in this.state.passengers[i]) {
                if(this.state.passengers[i][property] === ""){
                    valid = false;
                    if(property === "fname"){
                        message = "Meno";
                    }
                    else if (property === "lname"){
                        message = "Prizvisko";
                    }
                    else{
                        message = "Typ";
                    }
                    break;
                }
            }
        }
        if(valid){
            //this.props.updateReducer(this.state.trains, this.state.passengers)
            //this.props.history.push("/processing");
            var post = {
                valid_on:"",
                passengers: {},
                segments: {},
                reservations:[],
            };
            let dateSlice = this.props.searchInfo.date.split(".");
            post.valid_on = dateSlice[2]+"-"+dateSlice[1]+"-"+dateSlice[0];
            this.state.passengers.forEach((element, i) => {
                post.passengers[i] = {first_name: element.fname,
                                    last_name: element.lname,
                                    type: element.type_short,}
            });
            let reservations = []
            this.state.trains.forEach((train, i) => {
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
            this.postTicket(post)
        }
        else {
            window.alert('Nie je vyplnene '+message+' cestujuceho')
        }
    }

    onReservation = (e) => {
        this.setState({reservation: e.target.checked})
    }

    render(){
        if (!this.state.isLoaded) {
            return (
            <div className='center bigLoad'>
                <Loading></Loading>
            </div>
            )
        }
        else{
            return (
                <div className='passenger center'>
                <div className='passengerMain'>
                <h1>Informácie o cestujúcich <span className='gray'>({this.state.passengers.length} {/*(this.state.passengers.length === 1)?"osoba":"osoby"*/}cestujúci)</span></h1>
                <div className='passengers'>
                        <table>
                            <thead>
                                <tr>
                                    <th>Meno</th>
                                    <th>Priezvisko</th>
                                    <th>Typ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.passengers.map((r) => (
                                    <tr key={r.id}>
                                    <td><input id="fname" type="text" placeholder='Zadajte meno' value={this.state.passengers[this.findID(this.state.passengers, r.id)].fname} onChange={(e)=>{this.handleChange(e, r.id)}}></input></td>
                                    <td><input id="lname" type="text" placeholder='Zadajte priezvisko' value={this.state.passengers[this.findID(this.state.passengers, r.id)].lname} onChange={(e)=>{this.handleChange(e, r.id)}}></input></td>
                                    <td><div><input onClick={() => {this.toggleShow(r.id)}} placeholder='Vyberte typ' value={this.state.passengers[this.findID(this.state.passengers, r.id)].type} onChange={this.handleChange}></input>

                                            {(this.state.passengers[this.findID(this.state.passengers, r.id)].showType)?<SelectType moreOptions={this.state.passenger_types.results} addType={this.addType} id={r.id}></SelectType>:null}
                                            </div></td>
                                    </tr>
                                ))}

                            </tbody>


                        </table>
                <button className='addmore' onClick={this.addRow}>pridať ďalšieho cestujúceho</button>
                </div>
                {/*
                <label className='checkBox' htmlFor="reservation">
                Chcem rezervovat miesta
                <input onChange={this.onReservation} type="checkbox" id="reservation" name="reservation" value="reservation"></input>
                </label>
                */}
                {(this.state.reservation)?
                <div>{this.props.connectionInfo.transfer_history.map((item, index) => (
                    <TrainSegment setTrains={this.setTrains} trains={this.state.trains} passengers={this.state.passengers} key={index} item={item} date={this.props.searchInfo.date}></TrainSegment>
                ))}</div>
                :null}
                </div>
                <div className="passengerTotal">
                    <Summary handleUpdate={this.handleUpdate} passengers={this.state.passengers} reservations={this.state.trains} distance = {this.props.connectionInfo.distance}></Summary>
                </div>
                </div>
            )
        }
    }
  }
  const mapStateToProps = (state) => {
    return {
        connectionInfo: state.connectionInfo,
        searchInfo: state.searchInfo,
        token: state.token,
        uname: state.uname,

    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateReducer: (trains, passengers) => {dispatch({type: 'UPDATE_PASS', trains: trains, passengers: passengers})}
    }
}


export default compose(
    withRouter,
    connect(mapStateToProps, mapDispatchToProps)
  ) (Passenger)

  function SelectType ({moreOptions, addType,id}) {
    const optionsList = moreOptions.map((option, i) => {
      return(
            <li key={i} onClick={()=>{addType(id, option.name)}}>{option.name}</li>
      )
    })
    return (
      <ul className='selectType'>
        {optionsList}
      </ul>
    );
  }


class Summary extends React.Component {
    state = {
        passengerType: "",
        wholeAmount: [],
    }

    addToWholeAmount = (price, pos) => {
        let sum = this.state.wholeAmount;
        sum[pos] = Number(price)
        this.setState({sum: sum})
        //sum+=Number(price);
        //this.setState({
        //    sum: sum,
        //})
    }

    componentDidMount = () =>{
        this.setState({
            passengerType: this.props.passengers.type_short,
        })
    }
    render(){
        const passengersList = this.props.passengers.map((passenger, i) => {

            this.props.reservations.forEach(val => {
                val.users.forEach(user => {
                    if(user.id === passenger.id){
                    }
                })
            })
            return(
                <div key={i}>
                    <PassengerRes order={i} addToWholeAmount={this.addToWholeAmount} reservations={this.props.reservations} passenger={passenger} distance={this.props.distance}></PassengerRes>
                </div>
            )
            })

        return (
            <div className='context'>
                <h1>Prehľad</h1>
                {passengersList}
                {/*<NavLink to='/processing'><button onClick={this.props.handleUpdate}>Zakupit - {this.state.wholeAmount.length > 0?this.state.wholeAmount.reduce((total, value) => {return total+value;}) + '€':''}</button></NavLink>*/}
                <button onClick={this.props.handleUpdate.bind(this)}>Zakúpiť - {this.state.wholeAmount.length > 0?this.state.wholeAmount.reduce((total, value) => {return total+value;}) + '€':''}</button>
            </div>
        )
    }
}

class PassengerRes extends React.Component {
    state = {
        passengerType: "",
        priceLoaded: false,
        price: "",
        sum: [],
    }
    addToPrice = (price, pos) => {
        let sum = this.state.sum;
        sum[pos] = Number(price)
        this.setState({sum: sum})
        //sum+=Number(price);
        //this.setState({
        //    sum: sum,
        //})
        if(this.state.sum.length>0){
            this.props.addToWholeAmount(this.state.sum.reduce((total, value) => {return total+value;}),this.props.order)
        }
    }
    componentDidMount = () =>{
        this.setState({
            passengerType: this.props.passenger.type_short,
        })
    }
    componentDidUpdate = (props) => {
        if(props.passenger.type_short !== this.state.passengerType){
            this.setState({
                passengerType: props.passenger.type_short,
            })
            if(props.passenger.type_short !== ""){
            fetch("http://127.0.0.1:8000/passenger-type/"+props.passenger.type_short+"/calculate_price/?distance="+props.distance)
            .then(res => res.json())
                .then(json => {
                    this.setState({
                        priceLoaded: true,
                        price: "",
                    })
                });
            }
            else{
                this.setState({
                    priceLoaded: false,
                    price: "",
                })
            }
        }
    }

    render(){
        const trainsList = this.props.reservations.map((train, i) => {

            return(
                <div className='dashed' key={i}>
                    <TrainRes order={i} addToPrice={this.addToPrice} train={train} distance={this.props.distance} passengerID = {this.props.passenger.id} passengerType = {this.props.passenger.type_short}></TrainRes>
                </div>
            )
            })
        return(
            <div className='singlePerson'>

                <h3>{this.props.passenger.fname + ' ' + this.props.passenger.lname} <span className="smallerGray"> {this.props.passenger.type!==""?"("+this.props.passenger.type+")":null}</span></h3>
                {/*(this.state.priceLoaded)?<p>zakladna cena: {this.state.price.second_class_price}</p>: <p>zakladna cena: -</p>*/}
                {trainsList}
                <p>spolu: <span className="darkRed">{this.state.sum.length > 0?this.state.sum.reduce((total, value) => {return total+value;})+'€':''}</span> </p>
            </div>
        )
    }

}

class TrainRes extends React.Component {
    state = {
        reservation: {},
        reserved: false,
        passengerType: "",
        priceLoaded: false,
        price: "",
        updateReserved: false,
        train: {},
    }
    componentDidMount = () => {
        let res = this.props.train.users.find((val)=>{
            return val.id === this.props.passengerID
        })
        this.setState({
            reservation: res,
            train: this.props.train,
        })
    }

    componentDidUpdate = (props) => {
        if(!equal(this.props.train, this.state.train)){
            console.log("menim>>>>>>>>")
            let res = this.props.train.users.find((val)=>{
                return val.id === this.props.passengerID
            })
            this.setState({
                reservation: res,
            })
        }

        if(props.passengerType !== this.state.passengerType){
            this.setState({
                passengerType: props.passengerType
            })
            if(props.passengerType !== ""){
            fetch("http://127.0.0.1:8000/passenger-type/"+props.passengerType+"/calculate_price/?distance="+this.props.train.tDistance+"&reservation="+this.state.reservation.reserved)
            .then(res => res.json())
                .then(json => {
                    this.setState({
                        priceLoaded: true,
                        price: json,
                    })
                    if(this.state.reservation.reserved === false){
                        this.props.addToPrice(json.second_class_price, this.props.order)
                    }
                    else{
                        if(this.state.reservation.carriageClass === "1"){
                            this.props.addToPrice(json.first_class_price, this.props.order)
                        }
                        else{
                            this.props.addToPrice(json.second_class_price, this.props.order)
                        }
                    }
                });
            }
            else{
                this.setState({
                    priceLoaded: false,
                    price: "",
                })
            }

        }
    }

    render() {
        return(
            <div className="trainRes">
                <table>
                    <tbody className="tBody1">
                        <tr>
                            <td><i className="fas fa-subway"></i></td>
                        </tr>
                        <tr>
                            <td>{this.props.train.category} {this.props.train.train}</td>
                        </tr>
                    </tbody>
                    <tbody className="tBody2">
                        <tr>
                            <td>{this.props.train.from}</td>
                        </tr>
                        <tr>
                            <td>&#8942;</td>
                        </tr>
                        <tr>
                            <td>{this.props.train.to}</td>
                        </tr>
                    </tbody>
                </table>
                {(this.state.reservation.reserved)?
                    <div className="withReservation">
                        <p>vozeň: <span className="bold">{this.state.reservation.carriageNumber}</span> ({this.state.reservation.carriageClass}. trieda) miesto: <span className="bold">{this.state.reservation.seatID}</span></p>
                        {(this.state.reservation.carriageClass === "1")?<p>cena: <span className="darkRed">{this.state.price.first_class_price} €</span></p>: <p>cena: <span className="darkRed">{this.state.price.second_class_price} €</span></p>}
                    </div>:
                    <div className="withoutReservation">
                        <p>bez rezervácie</p>
                        <p>cena: <span className="darkRed">{this.state.price.second_class_price} €</span></p>
                    </div>}

            </div>
        )
    }
}

/* ------------------------------------ */



  class TrainSegment extends React.Component {
    state = {
        isShow: false,
    }
    toggleShow = () => {
        this.setState(state => ({ isShow: !state.isShow }));
      };
    hideTrain = () => {
        this.setState({
            isShow: false,
        })
    }
    render(){
        var dmy = this.props.date.split(".");
        var arrival_time = this.props.item.stop_to.arrival_time.split(":");
        var departure_time = this.props.item.stop_from.departure_time.split(":");
        var reserve_arr_t = new Date(dmy[2],dmy[1],dmy[0], arrival_time[0], arrival_time[1])
        var reserve_dep_t = new Date(dmy[2],dmy[1],dmy[0], departure_time[0], departure_time[1])
        var sum_time_string = new Date(reserve_arr_t.getTime()-reserve_dep_t.getTime()).toISOString().slice(11, 16)
        return(
            <div className='connection'>
                <div className='itembox' onClick={this.toggleShow}>
                    <div className='left lsbox'>
                        <table>
                            <tbody>
                                <tr>
                                    <td><i className="fas fa-subway"></i></td>
                                    <td>{this.props.item.stop_from.departure_time.substring(0,5)}</td>
                                    <td>{this.props.item.stop_from.station_name}</td>
                                </tr>
                                <tr>
                                    <td>{this.props.item.train.number}</td>
                                    <td>{this.props.item.stop_to.arrival_time.substring(0,5)}</td>
                                    <td>{this.props.item.stop_to.station_name}</td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="detailInfo">
                            <p className='left'>Čas cesty: {sum_time_string.substring(0,2)} hod. {sum_time_string.substring(3)} min.</p>
                            <p className='left'>Vzdialenosť: {this.props.item.stop_to.distance-this.props.item.stop_from.distance} km</p>
                        </div>
                    </div>
                    <div className='left rsbox'>
                        <div className='buy'>
                            <p>VYBRAŤ MIESTO</p>
                        </div>
                    </div>
                </div>
                {(this.state.isShow)?<SelectSeats setTrains={this.props.setTrains} trains={this.props.trains} passengers={this.props.passengers} hide={this.hideTrain} item={this.props.item} date={this.props.date}></SelectSeats>:null}
            </div>
        )
    }
}

class SelectSeats extends React.Component {
    state = {
      isLoaded: false,
      trainInfo: {},
    }
    componentDidMount(){
        fetch("http://127.0.0.1:8000/train/"+this.props.item.train.number+"/")
        .then(res => res.json())
            .then(json => {
                this.setState({
                    isLoaded: true,
                    trainInfo: json,
                })
            });
    }

    render(){
        if (!this.state.isLoaded) {
            return (
            <div className='center bigLoad'>
                <Loading></Loading>
            </div>
            )
        }
        else{
            return (
                <div>
                    <div className="intro">
                        <h2>Vyberte si vozeň</h2>
                        <i onClick={this.props.hide} className="remove-x far fa-times-circle fa-2x"></i>
                    </div>
                  <Train setTrains={this.props.setTrains} trains={this.props.trains} passengers={this.props.passengers} info={this.state.trainInfo} to={this.props.item.stop_to.station_name} from={this.props.item.stop_from.station_name} date={this.props.date}></Train>
                </div>
              )
        }


    }
  }

  class Train extends React.Component {
      state = {
          actualCarriage: NaN,
          displayCarriage: NaN,
          carriage: {},
          reservations: [],
          isLoaded: false,
          loading: []
      }

      componentDidMount(){
        var date = this.props.date.split(".");
        var dateformat = date[2]+'-'+date[1]+'-'+date[0];
        let fromID = this.findStationID(this.props.info.stops, this.props.from);
        let toID = this.findStationID(this.props.info.stops, this.props.to);
          if(this.props.info.carriages.length !== 0) {
            /*
            const loading = []
            for(var i = 0; i<this.props.info.carriages.length; i+=1){
                loading.push(false)
            }
            this.setState({loading: loading})
            */
          for(var i = 0; i<this.props.info.carriages.length; i+=1){
            let id = this.props.info.carriages[i].id
            let number = this.props.info.carriages[i].number
            fetch("http://127.0.0.1:8000/carriage-assignment/"+id+"/reservations/?from="+fromID+"&to="+toID+"&date="+dateformat)
            .then(res => res.json())
                .then(json => {
                    var reservations = this.state.reservations
                    reservations.push({id: id,result:json, number: number})
                    this.setState({
                        reservations: reservations,
                        //isLoaded: true,
                    })
                });
          }
          this.setState({isLoaded: true,})
        }
        else{
            this.setState({isLoaded: true,})
        }
        //this.props.
      }

    showCarriage = (e, id, carriage) => {
        let carriageInfo = {};
        if(isNaN(this.state.displayCarriage)){
            for(let i = 0; i<this.state.reservations.length; i+=1){
                if(this.state.reservations[i].id === id){
                    carriageInfo = this.state.reservations[i]
                }
            }
            this.setState({
                displayCarriage: id,
                carriage: carriageInfo,
            })
        }
        else if(this.state.displayCarriage === id){
            this.setState({
                displayCarriage: NaN,
                carriage: carriageInfo,
            })
        }
        else{
            for(let i = 0; i<this.state.reservations.length; i+=1){
                if(this.state.reservations[i].id === id){
                    carriageInfo = this.state.reservations[i]
                }
            }
            this.setState({
                displayCarriage: id,
                carriage: carriageInfo,
            })
            this.forceUpdate();
        }
    }

    hideCarriage = () =>{
        this.setState({
            displayCarriage: NaN,
            carriage: {},
        })
    }

    findStationID(stations, name){
        for(var i = 0; i<stations.length; i+=1){
            if(stations[i]["station_name"] === name){
                return stations[i].id;
            }
        }
        return -1;
    }



    render(){
        if (!this.state.isLoaded) {
            return (
            <div className='center bigLoad'>
                <Loading></Loading>
            </div>
            )
        }
        else{
        const optionsList = this.props.info.carriages.map((carriage, i) => {
            let free = carriage.seats
            for(let i = 0; i<this.state.reservations.length; i+=1){
                if(this.state.reservations[i].id === carriage.id){
                    free = free - this.state.reservations[i].result.length
                    var obj = this.state.reservations
                    obj[i].seats = carriage.seats;
                    obj[i].type = carriage.type;
                    //this.setState({reservation: obj})

                }
            }
        return(
                <li key={i} onClick={(e)=>{this.showCarriage(e, carriage.id, carriage)}}>
                    <div className={'class'+carriage.type+ ' wagon'}>
                        <span>číslo vozňa: {carriage.number}</span>
                        <span>trieda: {carriage.carriage_class}</span>
                        <span>volných miest:{free}/{carriage.seats}</span>
                    </div>
                </li>
        )
        })
        return (
        <div className='train'>
        <ul>
            <li key="9999">
                <div className='engine'>
                    <span>{this.props.info.category_short} {this.props.info.number}</span>
                    <span>{this.props.info.name}</span>
                    <span>&#8203;</span>
                </div>
            </li>
            {optionsList}
        </ul>
        {(!isNaN(this.state.displayCarriage))?<Carriage setTrains={this.props.setTrains} trains={this.props.trains} passengers={this.props.passengers} hide={this.hideCarriage} id={this.state.displayCarriage} info={this.state.carriage} trainID={this.props.info.number} carriageID={this.state.displayCarriage} ></Carriage>:null}
        </div>
        );
        }
    }
  }

class Carriage extends React.Component {
    state = {
        id: NaN,
        className: [],
        selected: false,
        uid: [],
        uidd: [],
    }

    componentDidMount = () => {
        this.test()
    }

    test =()=>{ //TODO find better name
        let result = [];
        for(let i=1; i <= this.props.info.seats; i+=1){
            let element = {}
            element.i = i;
            element.state = "free"
            for(let x of this.props.info.result){
                if(i === x.seat_number){
                    element.state = "reserved"
                }
            }
            if(i%2===1){
                element.position = "s-left";
            }
            else{
                element.position = "s-right";
            }
            //this.state.className.push(element)
            result.push(element)
        }
        /*
        if(JSON.stringify(result)!==JSON.stringify(this.state.className)){
            this.setState({
                className: result,
            })
        }
        */
       this.setState({
            className: result,
        })
    }

    componentDidUpdate = (prevProps, prevState) => {
        if(prevProps.id !== this.props.id){
            this.test();
        }
    }

    makeReservation = (uid, sid) => {
        let trains = this.props.trains
        for(let i=0; i< trains.length; i+=1){
            if(trains[i].train === this.props.trainID){
                trains[i].users[uid].reserved = true;
                trains[i].users[uid].carriageID = this.props.carriageID;
                trains[i].users[uid].carriageNumber = this.props.info.number;
                trains[i].users[uid].carriageClass = this.props.info.type;
                trains[i].users[uid].seatID = sid;
            }
        }
        this.props.setTrains(trains)
        this.state.uid.push(uid);

        let suid = this.state.uidd;
        suid.push(uid);
        this.setState({
            uidd: suid,
        })
    }


  render(){
      let cOrder;
    for(let i=0; i< this.props.trains.length; i+=1){
        if(this.props.trains[i].train === this.props.trainID){
            cOrder = i;
            break;
        }
    }
    let reserved = [];
    for(let j =0;j < this.props.trains[cOrder].users.length; j+=1){
        reserved.push({seatID:this.props.trains[cOrder].users[j].seatID,
                       carriageID: this.props.trains[cOrder].users[j].carriageID})
    }

    let className = this.state.className
    className.forEach((value, i) => {
        for(let j=0; j<reserved.length; j+=1){
            if(reserved[j].seatID === value.i & reserved[j].carriageID===this.props.carriageID){
                value.state = 'maybe';
            }
        }
    })
        if(this.props.info.seats === 60){

            let listOfPassengers = [];
            for(let i=0; i<this.props.passengers.length; i+=1){
                if(this.props.passengers[i].type !== ""){
                    listOfPassengers.push({fullname: this.props.passengers[i].fname + ' ' + this.props.passengers[i].lname, type: true})
                }
                else{
                    listOfPassengers.push({fullname: this.props.passengers[i].fname + ' ' + this.props.passengers[i].lname, type: false})
                }
                /*
                let test = this.state.uidd.some((val) => {
                    return val === i;
                  });
                if(!test){
                    listOfPassengers.push(this.props.passengers[i].fname + ' ' + this.props.passengers[i].lname)
                }
                */
            }


            let result = this.state.className.map((classes, i) => {

                return (
                    <Seat key={classes.i} train={this.props.trains[cOrder]} makeReservation={this.makeReservation} passengers={listOfPassengers} classes={classes}></Seat>
                )


            })
            return (
                <div>
                    <div className="intro">
                        <h2>Vyberať miesta</h2>
                        <i onClick={this.props.hide} className="remove-x far fa-times-circle fa-2x"></i>
                    </div>
                    <div className="seats-60">
                        {result}
                    </div>
                </div>
            );
        }
        else if(this.props.info.seats === 48){
            return (
                <div>
                      <p>{this.props.info.seats}</p>
                </div>
                );
        }
        else{
            return (
                <div>
                      <p>info</p>
                </div>
                );
        }

    }

}

class Seat extends React.Component {
    state = {
        selected: false,
        reservation: "",
    }

    selectSeat = () => {
        let reserved = this.props.train.users.every((val)=>{
            return val.reserved === true;
        })
        if(reserved === false){
            if(!this.state.selected & this.props.classes.state === 'free'){
                this.setState({
                    reservation: "maybe",
                })
            }
            else{
                this.setState({
                    reservation: this.props.classes.state,
                })
            }
            this.setState({
                selected: !this.state.selected,
            })
        }
    }

    componentDidMount = () => {
        this.setState({
            reservation: this.props.classes.state,
        })
    }

    componentDidUpdate = (prevProps) => {
        if(this.state.reservation !== this.props.classes.state){
            this.setState({
                reservation: this.props.classes.state,
            })
        }
    }

    bookSeat = (i) => {
        this.setState({
            selected: false,
        })
        this.props.makeReservation(i, this.props.classes.i)
    }

    render(){
        let reservation = this.state.reservation
        return(
            <div className='width'>
                <div onClick={this.selectSeat} className={'seat ' + reservation +' '+ this.props.classes.position}>
                    {this.props.classes.i}
                </div>
                {(this.state.selected & this.props.classes.state === 'free')?<PassengerOptions train={this.props.train} bookSeat={this.bookSeat} passengers={this.props.passengers}></PassengerOptions>:null}
            </div>
        )
    }
}

function PassengerOptions({passengers, bookSeat, train}) {
    const passengersList = passengers.map((option, i) => {
       if(train.users[i].reserved === true){
        return(
            <li onClick={() => {bookSeat(i)}} className="li-hide" key={i}>{option.fullname}</li>
        )
       }
       else {
           if(option.type){
                return(
                    <li onClick={() => {bookSeat(i)}} key={i}>{option.fullname}</li>
                )
           }
           else{
                return(
                    <li onClick={() => {bookSeat(i)}} className="li-hide" key={i}>{option.fullname}</li>
                )
           }

    }
    })
    return (
      <ul className='passengersList'>
        {passengersList}
      </ul>
    );
  }
