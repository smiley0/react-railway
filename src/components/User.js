import React from 'react'
import {connect} from 'react-redux'
import equal from 'fast-deep-equal'
//import {NavLink} from 'react-router-dom'


class User extends React.Component {
    state = {
        response: {},
        haveResponse: false,
        uname: "",
        token: "",
    }
    componentDidUpdate(prevProps) {
        if(!equal(this.props.uname, prevProps.uname)) // Check if it's a new user, you can also use some unique property, like the ID  (this.props.user.id !== prevProps.user.id)
        {
            console.log("JOOOOOOOOOOOOOOOOOOOOOOOOOOOOO")
            console.log(prevProps)
            console.log(this.props)
            this.setState({
              uname: this.props.uname,
              token: this.props.token,
            })
            this.getTickets();
        }
      } 
    getTickets = (post) => {
        var headers = {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Token '+this.props.token,
        }
        
        const requestOptions = {
            method: 'GET',
            headers: headers
        };
        fetch('http://127.0.0.1:8000/ticket/', requestOptions)
            .then(res => res.json())
            .then(json => {this.setState({
                haveResponse: true,
                response: json,
            })});
    }
    render(){
        if(this.state.token !== ""){
            console.log(this.state.token)
            console.log(this.state.response)
            return(
                <div>
                    <h1>Hello {this.state.uname}</h1>
                </div>
            )
        }
        else{
            return(
                <div>
                    <h1>Chyba</h1>                 
                </div>
            )
        }
    }
}

const mapStateToProps = (state) => {
    return {
        uname: state.uname,
        token: state.token,
    }
}

export default connect(mapStateToProps)(User)



                                