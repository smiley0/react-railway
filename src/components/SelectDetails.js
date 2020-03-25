import React from 'react'
class SelectDetails extends React.Component {
    state = {
      opened: false,
    }
    render(){
        console.log("details")
        console.log(this.props.id)
        console.log(this.props.show)
      if(this.props.show){
        return (
            <div>
              <h1>toggle </h1>
            </div>
          )
      }
      else{
          return(
              <div>:(</div>
          )
      }
      
    }
  }
  export default SelectDetails;