import React from 'react';
import './SearchOptions.css';
import SelectDetails from './SelectDetails'

export default class SelectOptions extends React.Component {
  state = {
    isShow: false,
    testShow: [],
    dmy: this.props.date.split("."),
  }

  render(){

  return (
    <div>
      {this.props.items.results.map((item, index) => (
            <Item key={index} item={item} dmy={this.state.dmy}></Item>
      ))}
    </div>
  )};
}

class Item extends React.Component {
    state={
        isShow: false,
    }
    toggleShow = () => {
        this.setState(state => ({ isShow: !state.isShow }));
      };
    render(){
        var sum_distance = 0
        var sum_time = 0;
        var previous_time = 0;
        var transfere_time = 0;
        this.props.item.forEach(element => {
            sum_distance += element.distance
            var arrival_time = element.arrival_time.split(":");
            var departure_time = element.departure_time.split(":");
            console.log("dmy")            
            console.log(this.props.id, this.props.dmy)
            console.log(this.props.dmy[2],this.props.dmy[1],this.props.dmy[0], arrival_time[0], arrival_time[1])
            
            var reserve_arr_t = new Date(this.props.dmy[2],this.props.dmy[1],this.props.dmy[0], arrival_time[0], arrival_time[1])
            var reserve_dep_t = new Date(this.props.dmy[2],this.props.dmy[1],this.props.dmy[0], departure_time[0], departure_time[1])
            if(previous_time !== 0){
              transfere_time = reserve_dep_t.getTime()-previous_time
            }
      
            sum_time += transfere_time + reserve_arr_t.getTime() - reserve_dep_t.getTime() 
            previous_time = reserve_arr_t.getTime()
            
            
        });
        return(
            <div onClick={this.toggleShow}>
                <div>
                    {this.props.item.map((itm, i) => {
                        return (
                            <table key={i}>
                            <tbody>
                            <tr> 
                                <th>{itm.departure_time}</th>
                                <td>{itm.src}</td>
                                <td><i className="fas fa-subway"></i></td>
                                <td>{itm.id}</td>
                            </tr>
                            <tr>
                                <th>{itm.arrival_time}</th>
                                <td>{itm.dst}</td>
                                <td>{itm.number}</td>
                            </tr>
                            </tbody>
                            </table>
                        )
                    })}
                </div>
                <p>distance: {sum_distance}</p>
                <p>time: {new Date(sum_time).toISOString().slice(11, 16)}</p>
                {(this.state.isShow)?<SelectDetails></SelectDetails>:null}
                
            </div>
        )
    }
}

