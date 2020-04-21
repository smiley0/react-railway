import React from 'react'
import './Select.css'
import {connect} from 'react-redux'
import {compose} from 'redux'
import { withRouter } from 'react-router-dom';

class SelectDetails extends React.Component {
    state = {
      opened: false,
    }
    handleClick = () => {
      if(this.props.uname !== ""){
          this.props.setConnection(this.props.trains);
          this.props.history.push("/passenger");
      }
      else{
          window.alert('Musis sa prihlasit')
      }

  }
    render(){
      return (
        <div className='itemsDetail'>
          <ul>
            {this.props.trains.transfer_history.map((item, index) => (
                  <li key={index}>{item.train.category_short} {item.train.number} {item.train.name}</li>
            ))}
          </ul>
          {this.props.trains.transfer_history.map((item, index) => (
                <MoreDetail key={index} item={item}></MoreDetail>
          ))}

          <button onClick={this.handleClick.bind(this)}>Kupit listok</button>
        </div>
      )
      
    }
  }

  const mapStateToProps = (state) => {
    return {
        connectionInfo: state.connectionInfo,
        uname: state.uname,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setConnection: (connection) => {dispatch({type: 'SET_CONNECTION', connection: connection})}
    }
}

export default compose(
  withRouter, 
  connect(mapStateToProps, mapDispatchToProps)
) (SelectDetails)

  class MoreDetail extends React.Component {
    state={
        response: {},
        haveResponse: false,
        displayLong: false,
        showBefore: false,
        showAfter: false,
    }
    componentDidMount = () => {
      fetch('http://127.0.0.1:8000/train/'+this.props.item.train.number+'/')
        .then(res => res.json())
        .then((data) => {
            this.setState({ response: data, haveResponse: true})
        }) 
    }
    displayLong = () => {
        this.setState({
          displayLong: true,
        })
    }
    toggleBefore = () => {
      this.setState({
        showBefore: !this.state.showBefore,
      })
    }
    toggleAfter = () => {
      this.setState({
        showAfter: !this.state.showAfter,
      })
    }
    render(){
      if(this.state.haveResponse){
        console.log("RESPONSE")

        console.log(this.props.item)
        console.log(this.state.response)
        var before = [];
        var journey = [];
        var after = [];
        var haveStart = false;
        var haveEnd = false;
        this.state.response.stops.forEach(stop => {
          if(!haveStart){
            if(stop.station_name === this.props.item.stop_from.station_name){
              haveStart = true;
              journey.push({name: stop.station_name, time: stop.departure_time})
            }
            else{
              before.push({name: stop.station_name, time: stop.departure_time})
            }
          }
          else if(haveStart && !haveEnd){
            if(stop.station_name === this.props.item.stop_to.station_name){
              journey.push({name: stop.station_name, time: stop.departure_time})
              haveEnd = true;
            }
            else{
              journey.push({name: stop.station_name, time: stop.departure_time})
            }
          }
          else{
            after.push({name: stop.station_name, time: stop.departure_time})
          }
        })

        console.log("PARTS")
        console.log(before)
        console.log(journey)
        console.log(after)

        let journeyList = journey.map((stop, i) => {
          return(
                <li key={i}>
                  {stop.time.slice(0,5)} - {stop.name}
                </li>
          )        
        })
        let beforeList = before.map((stop, i) => {
          return(
                <li key={i}>
                  {stop.time.slice(0,5)} - {stop.name}
                </li>
          )        
        })
        let afterList = after.map((stop, i) => {
          return(
                <li key={i}>
                  {stop.time.slice(0,5)} - {stop.name}
                </li>
          )        
        })
        //let JourneyListShort = 

        return(
          <div>
            <h3>{this.props.item.train.category_short + " " +
              this.props.item.train.number + " " +
              this.props.item.train.name }
            </h3> 
            {before.length>0?
              this.state.showBefore?<button onClick={this.toggleBefore}>Skryt predchadzajuce</button>:<button onClick={this.toggleBefore}>Zobrazit predchadzajuce</button>
              :null
            } 
            {this.state.showBefore? <ul>{beforeList}</ul>: null}          
            {this.state.displayLong?
            <ul>
              {journeyList}
            </ul>:
            <ShortList displayLong={this.displayLong} journey={journey}></ShortList>}
            {this.state.showAfter? <ul>{afterList}</ul>: null} 
            {after.length>0?
              this.state.showAfter?<button onClick={this.toggleAfter}>Skryt nasledujuce</button>:<button onClick={this.toggleAfter}>Zobrazit nasledujuce</button>
              :null
            } 
          </div>
        )
      }
      else{
        return (
          <div>
            <h3>{this.props.item.train.category_short + " " +
              this.props.item.train.number + " " +
              this.props.item.train.name }
            </h3>
            <p>Nacitavam informacie o vlaku</p>
          </div>
        )
      }
    }
  }


  class ShortList extends React.Component {
    state={
        response: {},
    }
    render(){
        return (
          <ul>
            <li>{this.props.journey[0].time.slice(0,5)} - {this.props.journey[0].name}</li>
            <li onClick={this.props.displayLong}>zobrazit vsetky medzistanice ({this.props.journey.length - 2})</li>
            <li>{this.props.journey[this.props.journey.length - 1].time.slice(0,5)} - {this.props.journey[this.props.journey.length - 1].name}</li>
          </ul>
        )
      }
    
  }