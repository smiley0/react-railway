import React from 'react'
import Loading from './Loading'
import {connect} from 'react-redux'

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
        console.log(this.state.passenger_types.results[0].name)
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
        console.log("odstranujem" + i)
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
        console.log(id)
        console.log(type)
        var rows = this.state.tablerows2;
        var index = this.findID(this.state.tablerows2, id);
        rows[index].type = type;
        this.setState({
            tablerows2: rows
        })
        this.toggleShow(id)
    }
    handleChange = (e, id) => {
        console.log("handleChange"+e.target.id)
        console.log("handleChange"+e.target.value)
        console.log(id)
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
        console.log(e.target.name)
        console.log(e.target.checked)
        this.setState({reservation: e.target.checked})
    }

    render(){
        console.log(">>>>>>>>>>>>>>>>")
        console.log(this.props.connectionInfo)
        if (!this.state.isLoaded) {
            return (
            <div className='center bigLoad'>
                <Loading></Loading>
            </div>
            )
        }
        else{
            return (
                <div className='passenger'>
                <h2>Informácie o cestujúcich ({this.state.tablerows2.length} osoba)</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Meno</th>
                            <th>Priezvisko</th>
                            <th>Typ</th>
                            <th>Zmazat?</th>
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
                            <td><button onClick={() => {this.removeRow(r.id)}}>zmaz</button></td>
                            </tr>
                        ))}
                        <tr>
                            <td><button onClick={this.addRow}>pridat dalsieho cestujuceho</button></td>
                        </tr>
                    </tbody>
                </table>
                <form action="/action_page.php">
                    <label htmlFor="reservation"> Chcem rezervovat miesta</label>
                    <input onChange={this.onReservation} type="checkbox" id="reservation" name="reservation" value="reservation"></input>
                </form>
                {(this.state.reservation)?
                <div>{this.props.connectionInfo.transfer_history.map((item, index) => (
                    <TrainSegment key={index} item={item} date={this.props.searchInfo.date}></TrainSegment>
                ))}</div>
                :null}
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
/*
  class SelectType extends React.Component {
    state={
        isShow: false,
    }
    render(){
      return (
        <div>
          <p>dalsie typy</p>
        </div>
      )
    }
  }
*/
  function SelectType ({moreOptions, addType,id}) {
    const optionsList = moreOptions.map((option, i) => {
      return(
            <li key={i} onClick={()=>{addType(id, option.name)}}>{option.name}</li>
      )
    })
    return (
      <ul>
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
    render(){
        //{this.props.item.train.number}
        console.log(this.props.item.distance)
        console.log(this.props.date)
        var dmy = this.props.date.split(".");
        var arrival_time = this.props.item.stop_to.arrival_time.split(":");
        var departure_time = this.props.item.stop_from.departure_time.split(":");
        var reserve_arr_t = new Date(dmy[2],dmy[1],dmy[0], arrival_time[0], arrival_time[1])
        var reserve_dep_t = new Date(dmy[2],dmy[1],dmy[0], departure_time[0], departure_time[1])
        //console.log(reserve_arr_t.getTime()-reserve_dep_t.getTime())
        var sum_time_string = new Date(reserve_arr_t.getTime()-reserve_dep_t.getTime()).toISOString().slice(11, 16)
        console.log(sum_time_string)
        return(
            <div>
                <div onClick={this.toggleShow}>
                    <div>
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
                            <p>Čas cesty: {sum_time_string.substring(0,2)} hod. {sum_time_string.substring(3)} min.</p>
                            <p>Vzdialenosť: {this.props.item.stop_to.distance-this.props.item.stop_from.distance} km</p>
                        </div> 
                    </div>
                    <div>
                        <p>VYBRAT MIESTO</p>
                    </div>
                </div>
                {(this.state.isShow)?<SelectSeats item={this.props.item} date={this.props.date}></SelectSeats>:null}
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
        console.log("TRAIN")
      console.log(this.props.item)
        if (!this.state.isLoaded) {
            return (
            <div className='center bigLoad'>
                <Loading></Loading>
            </div>
            )
        }
        else{

            console.log(this.state.trainInfo)
            return (
                <div>
                  <h2>Zvol si vozen</h2>
                  <Train info={this.state.trainInfo} to={this.props.item.stop_to.station_name} from={this.props.item.stop_from.station_name} date={this.props.date}></Train>
                </div>
              )
        }
      
      
    }
  }

  class Train extends React.Component {
      state = {
          displayCarriage: NaN,
      }
    
    showCarriage = (e, id) => {
        if(isNaN(this.state.displayCarriage)){
            this.setState({
                displayCarriage: id,
            })
        }
        else if(this.state.displayCarriage === id){
            this.setState({
                displayCarriage: NaN,
            })
        }
        else{
            this.setState({
                displayCarriage: id,
            })
        }
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
        const optionsList = this.props.info.carriages.map((carriage, i) => {
        return(
                <li key={i} onClick={(e)=>{this.showCarriage(e, carriage.id)}}>
                    <div>
                        <p>{carriage.number}</p>
                        <p>{carriage.seats}</p>
                    </div>
                </li>
        )
        })
        console.log(this.props.from)
        console.log(this.props.to)
        console.log(this.props.info.stops)
        console.log(this.findStationID(this.props.info.stops, this.props.from))
        console.log(this.findStationID(this.props.info.stops, this.props.to))
        var fromID = this.findStationID(this.props.info.stops, this.props.from);
        var toID = this.findStationID(this.props.info.stops, this.props.to);
        return (
        <div>
        <ul>
            <li key="9999">
                <div>
                    <p>{this.props.info.category_short} {this.props.info.number}</p>
                    <p>{this.props.info.name}</p>
                </div>
            </li>
            {optionsList}
        </ul>
        {(!isNaN(this.state.displayCarriage))?<Carriage date={this.props.date} from={fromID} to={toID} number={this.state.displayCarriage}></Carriage>:null}
        </div>
        );
    }
  }

class Carriage extends React.Component {
    
  
  render(){
      return (
      <div>
            <p>{this.props.number}</p>
            <p>{this.props.from}</p>
            <p>{this.props.to}</p>
            <p>{this.props.date}</p>
      </div>
      );
  }
}
