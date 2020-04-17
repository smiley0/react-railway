import React from 'react'
import './Select.css'
import {connect} from 'react-redux'
import {NavLink} from 'react-router-dom'
class SelectDetails extends React.Component {
    state = {
      opened: false,
    }
    handleClick = () => {
      this.props.setConnection(this.props.trains)
  }
    render(){
      return (
        <div className='itemsDetail'>
          {this.props.trains.transfer_history.map((item, index) => (
                <MoreDetail key={index} item={item}></MoreDetail>
          ))}

          <NavLink to='/passenger'><button onClick={this.handleClick}>Kupit listok</button></NavLink>
        </div>
      )
      
    }
  }

  const mapStateToProps = (state) => {
    return {
        connectionInfo: state.connectionInfo
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setConnection: (connection) => {dispatch({type: 'SET_CONNECTION', connection: connection})}
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectDetails)

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