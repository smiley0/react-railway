import React from 'react'
import {connect} from 'react-redux'
//import {NavLink} from 'react-router-dom'


class User extends React.Component {
    
    render(){
        if(this.props.uname !== ""){
            return(
                <div>
                    <h1>Hello {this.props.uname}</h1>
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
    }
}

export default connect(mapStateToProps)(User)



                                