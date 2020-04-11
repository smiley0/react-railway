import React from 'react';
import './SearchOptions.css';
import SelectDetails from './SelectDetails'
import './Select.css'
import Loading from './Loading'

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
    console.log("results")
    console.log(this.state.trains.items)
  return (
    <div className="selectOptions">
      {this.state.trains.items.result.map((item, index) => (
            <Item key={index} item={item} dmy={this.state.dmy}></Item>
      ))}
      <div className='loadMore'>
        <button onClick={this.loadNext}>Pozdejsie spoje <i className="fas fa-chevron-down"></i></button>
        <div className="center smallLoad">{(this.state.isLoaded) ? <Loading></Loading> : null}</div>
      </div>
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
        console.log("Item")
        console.log(this.props.item)
        var hour = String(this.props.item.duration / 3600).split(".");
        var min = (this.props.item.duration % 3600)/60;
        return(
            <div>
              <div onClick={this.toggleShow} className="itembox">
                  <div className="left lsbox">
                    {this.props.item.transfer_history.map((itm, i) => {
                        return (
                            
                            <table key={i}>
                            <tbody>
                            <tr> 
                                <th>{itm.stop_from.departure_time.substring(0,5)}</th>
                                <td>{itm.stop_from.station_name}</td>
                                <td><i className="fas fa-subway"></i></td>
                            </tr>
                            <tr>
                                <th>{itm.stop_to.arrival_time.substring(0,5)}</th>
                                <td>{itm.stop_to.station_name}</td>
                                <td>{itm.train.number}</td>
                            </tr>
                            </tbody>
                            </table>
                            
                        )
                    })}   
                    <div className="detailInfo">                
                      <p className="left">Čas cesty: {hour[0]} hod. {min} min.</p>
                      <p className="left">Vzdialenosť: {this.props.item.distance} km</p>
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

