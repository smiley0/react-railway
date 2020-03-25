import React from 'react'
export default class SelectDetails extends React.Component {
    state = {
      opened: false,
    }
    render(){
      console.log("trains")
      console.log(this.props.trains)
      return (
        <div>
          {this.props.trains.map((item, index) => (
                <MoreDetail key={index} item={item}></MoreDetail>
          ))}

          <button>Kupit listok</button>
        </div>
      )
      
    }
  }

  class MoreDetail extends React.Component {
    state={
        isShow: false,
    }
    render(){
      return (
        <div>
          <h3>{this.props.item.name}</h3>
          <p>Budu dalsie informacie o vlaku</p>
        </div>
      )
    }
  }