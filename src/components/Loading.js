import React from 'react';

export default class Loading extends React.Component {
    state = {
        output: ['Nacitavam', 'Nacitavam.','Nacitavam..','Nacitavam...'],
        counter: 1,
        text: 'Nacitavam',
    }
    componentDidMount() {
        this.interval = setInterval(this.change, 500);
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }
    change = () => {
        this.setState({text: this.state.output[this.state.counter]})
        this.setState({counter: this.state.counter + 1})
        if(this.state.counter >= this.state.output.length){
            this.setState({
                counter: 0,
            })
        }
    }
    render(){
        return (
            <p>{this.state.text}</p>            
        )
    }
}