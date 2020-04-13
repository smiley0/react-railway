import React from 'react'
import Loading from './Loading'
import {connect} from 'react-redux'
import './Passenger.css'

class Passenger extends React.Component {
    state = {
      reservation: false,
      isLoaded: false,
      passenger_types: [],
      tablerows2: [{id:0,fname:"",lname:"", type:"", showType:false}]
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
    }

    addRow = () => {
        var rows = this.state.tablerows2;
        const nextId = this.state.tablerows2[this.state.tablerows2.length-1].id + 1;
        const newrow = {id: nextId,fname:"",lname:"", type:""};
        rows.push(newrow)
        this.setState({
            tablerows2: rows
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
        if(this.state.tablerows2.length > 1){
            var rows = this.state.tablerows2
            const index = this.findID(rows, i);
            if (index > -1) {
                rows.splice(index, 1);
            }            
            this.setState({
                tablerows2: rows
            })
        }
        else{
            const row = [{id: 0,fname:"",lname:"", type:""}];
            this.setState({
                tablerows2: row
            })
        }
    }

    toggleShow = (id) => {
        var index = this.findID(this.state.tablerows2, id);
        var rows = this.state.tablerows2;
        rows[index].showType = !rows[index].showType;
        this.setState({
            tablerows2: rows
        })
      };

    addType = (id, type) => {
        var rows = this.state.tablerows2;
        var index = this.findID(this.state.tablerows2, id);
        rows[index].type = type;
        this.setState({
            tablerows2: rows
        })
        this.toggleShow(id)
    }
    handleChange = (e, id) => {
        var rows = this.state.tablerows2;
        var index = this.findID(this.state.tablerows2, id);
        if(e.target.id === "fname"){
            rows[index].fname = e.target.value;
            this.setState({tablerows2: rows})
        }
        else if(e.target.id === "lname"){
            rows[index].lname = e.target.value;
            this.setState({tablerows2: rows})
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
                <h1>Informácie o cestujúcich <span className='gray'>({this.state.tablerows2.length} {/*(this.state.tablerows2.length === 1)?"osoba":"osoby"*/}cestujúci)</span></h1>
                <div className='passengers'>
                        <table>
                            <thead>
                                <tr>
                                    <th>Meno</th>
                                    <th>Priezvisko</th>
                                    <th>Typ</th>
                                    <th>Odstrániť?</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.tablerows2.map((r) => (
                                    <tr key={r.id}>
                                    <td><input id="fname" type="text" value={this.state.tablerows2[this.findID(this.state.tablerows2, r.id)].fname} onChange={(e)=>{this.handleChange(e, r.id)}}></input></td>
                                    <td><input id="lname" type="text" value={this.state.tablerows2[this.findID(this.state.tablerows2, r.id)].lname} onChange={(e)=>{this.handleChange(e, r.id)}}></input></td>
                                    <td><div><input onClick={() => {this.toggleShow(r.id)}} placeholder='Vyber' value={this.state.tablerows2[this.findID(this.state.tablerows2, r.id)].type} onChange={this.handleChange}></input>
                                            
                                            {(this.state.tablerows2[this.findID(this.state.tablerows2, r.id)].showType)?<SelectType moreOptions={this.state.passenger_types.results} addType={this.addType} id={r.id}></SelectType>:null}
                                            </div></td>
                                    <td><button className='remove' onClick={() => {this.removeRow(r.id)}}>zmaz</button></td>
                                    </tr>
                                ))}
                                
                            </tbody>
                                
                                
                        </table>
                <button className='addmore' onClick={this.addRow}>pridat dalsieho cestujuceho</button>
                </div>
                <label className='checkBox' htmlFor="reservation"> 
                Chcem rezervovat miesta                
                <input onChange={this.onReservation} type="checkbox" id="reservation" name="reservation" value="reservation"></input>                
                </label>
                {(this.state.reservation)?
                <div>{this.props.connectionInfo.transfer_history.map((item, index) => (
                    <TrainSegment key={index} item={item} date={this.props.searchInfo.date}></TrainSegment>
                ))}</div>
                :null}
                </div>
                <div className="passengerTotal">
                    <div className='context'>
                        <h1>Prehlad</h1>
                    </div>
                </div>
                </div>
            )
        }
    }
  }
  const mapStateToProps = (state) => {
    return {
        connectionInfo: state.connectionInfo,
        searchInfo: state.searchInfo

    }
}

export default connect(mapStateToProps)(Passenger)
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
                            <p>VYBRAT MIESTO</p>
                        </div>
                    </div>
                </div>
                {(this.state.isShow)?<SelectSeats hide={this.hideTrain} item={this.props.item} date={this.props.date}></SelectSeats>:null}
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
                        <h2>Vyber si vozen</h2>
                        <i onClick={this.props.hide} className="remove-x far fa-times-circle fa-2x"></i>
                    </div>
                  <Train info={this.state.trainInfo} to={this.props.item.stop_to.station_name} from={this.props.item.stop_from.station_name} date={this.props.date}></Train>
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
            fetch("http://127.0.0.1:8000/carriage-assignment/"+id+"/reservations/?from="+fromID+"&to="+toID+"&date="+dateformat)
            .then(res => res.json())
                .then(json => {
                    var reservations = this.state.reservations
                    reservations.push({id: id,result:json})
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
        /*
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
        }
        */
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
                        <span>cislo vozna: {carriage.number}</span>
                        <span>trieda: {carriage.type}</span>
                        <span>volnych miest:{free}/{carriage.seats}</span>
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
        {(!isNaN(this.state.displayCarriage))?<Carriage hide={this.hideCarriage} id={this.state.displayCarriage} info={this.state.carriage} ></Carriage>:null}
        </div>
        );
        }
    }
  }

class Carriage extends React.Component {
    state = {
        id: NaN,
        className: [],
    }

    componentDidMount = () => {
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
        if(JSON.stringify(result)!==JSON.stringify(this.state.className)){
            this.setState({
                className: result,
            })
        }
    }
    
    
  render(){
        if(this.props.info.seats === 60){
            /*
            const optionsList = moreOptions.map((option, i) => {
                return(
                      <li key={i} onClick={()=>{addType(id, option.name)}}>{option.name}</li>
                )
              })
            */
            
            let result = this.state.className.map((classes, i) => {
                return (
                    <div key={classes.i} className='width'>
                        <div className={'seat ' + classes.state +' '+ classes.position}>
                            {classes.i}
                        </div>
                    </div>
                )
            })
            return (
                <div>
                    <div className="intro">
                        <h2>Vyber si miesto</h2>
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
