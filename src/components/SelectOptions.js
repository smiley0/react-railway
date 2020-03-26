import React from 'react';
import './SearchOptions.css';
import SelectDetails from './SelectDetails'
import './Select.css'

export default class SelectOptions extends React.Component {
  state = {
    isShow: false,
    trains: this.props,
    newTrains: [],
    dmy: this.props.date.split("."),
    isLoaded: false,
  }
  /*
  componentDidMount(){
    this.setState({
      trains: this.props
    })
  }*/
  loadNext = () => {
    if(this.state.trains.items.next === null){
      return
    }

    this.setState({
      isLoaded: true,
    }) 
    this.forceUpdate()

    fetch(this.state.trains.items.next)
            .then(res => res.json())
            .then(json => {
              //this.state.trains.items.next = json.next
              //this.state.trains.items.results.push(...json.results)
              
              this.setState({
                    //...trains,
                    trains:{
                      items:{
                        next: json.next,
                        results: [...this.state.trains.items.results, ...json.results],
                        
                      }
                    },
                    isLoaded: false
                })
            });
    console.log("spracovanie dalsich poziadaviek")
  }

  render(){
  return (
    <div className="selectOptions">
      {this.state.trains.items.results.map((item, index) => (
            <Item key={index} item={item} dmy={this.state.dmy}></Item>
      ))}
      <button onClick={this.loadNext}>Pozdejsie spoje <i className="fas fa-chevron-down"></i></button>
      <p>{(this.state.isLoaded) ? "nacitavam" : null}</p>
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
            //this.state.train.push({number: element.number ,name: element.name})
            sum_distance += element.distance
            var arrival_time = element.arrival_time.split(":");
            var departure_time = element.departure_time.split(":");
            
            var reserve_arr_t = new Date(this.props.dmy[2],this.props.dmy[1],this.props.dmy[0], arrival_time[0], arrival_time[1])
            var reserve_dep_t = new Date(this.props.dmy[2],this.props.dmy[1],this.props.dmy[0], departure_time[0], departure_time[1])
            if(previous_time !== 0){
              transfere_time = reserve_dep_t.getTime()-previous_time
            }
      
            sum_time += transfere_time + reserve_arr_t.getTime() - reserve_dep_t.getTime() 
            previous_time = reserve_arr_t.getTime()
            
            
        });
        var timespand = new Date(sum_time).toISOString().slice(11, 16);
        var timesplit = timespand.split(":");
        return(
            <div onClick={this.toggleShow}>
              <div className="itembox">
                  <div className="left lsbox">
                    {this.props.item.map((itm, i) => {
                        return (
                            <table key={i}>
                            <tbody>
                            <tr> 
                                <th>{itm.departure_time}</th>
                                <td>{itm.src}</td>
                                <td><i className="fas fa-subway"></i></td>
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
                    <div className="detailInfo">                
                      <p className="left">Čas cesty: {timesplit[0]} hod. {timesplit[1]} min.</p>
                      <p className="left">Vzdialenosť: {sum_distance} km</p>
                    </div> 
                  </div>
                  <div className="left rsbox">
                      <i className="fas fa-shopping-cart"></i>
                  </div>
              </div>
              {(this.state.isShow)?<SelectDetails trains={this.props.item}></SelectDetails>:null}
                
            </div>
        )
    }
}

