import React from 'react'
import './Select.css'
import {NavLink} from 'react-router-dom'
export default class SelectDetails extends React.Component {
    state = {
      opened: false,
    }
    render(){
      console.log("trains")
      console.log(this.props.trains)
      return (
        <div className='itemsDetail'>
          {this.props.trains.transfer_history.map((item, index) => (
                <MoreDetail key={index} item={item}></MoreDetail>
          ))}

          <NavLink to='/passenger'><button>Kupit listok</button></NavLink>
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
          <h3>{this.props.item.train.category_short + " " +
            this.props.item.train.number + " " +
            this.props.item.train.name }
          </h3>
          <p>Budu dalsie informacie o vlaku</p>
        </div>
      )
    }
  }