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