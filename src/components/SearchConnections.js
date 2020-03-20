import React from 'react'
import SearchOptions from './SearchOptions'

class SearchConnections extends React.Component {
    state = {
        src_items: [],
        dst_items: [],
        dst: "",
        src: "",
        id: "",
        time: "",
        date: "",
        test: "FUNGUJE"
    }

    handleChange = (e) => {
        console.log("handleChange"+e.target.id)
        console.log("handleChange"+e.target.value)
        if(e.target.id === "dst"){
            this.setState({dst: e.target.value})
        }
        else if(e.target.id === "src"){
            this.setState({src: e.target.value})
        }
        
        if(e.target.value.length === 0 && e.target.id === "dst"){
            this.setState({dst_items: [], dst: e.target.value})
        }
        else if(e.target.value.length === 0 && e.target.id === "src"){
            this.setState({src_items: [], src: e.target.value})
        }
        else{
            if(e.target.id === "dst"){
                fetch('http://127.0.0.1:8000/stations2/?fnd='+e.target.value)
                    .then(res => res.json())
                    .then((data) => {
                        this.setState({ dst_items: data})
                        console.log('items: ', this.state)
                    }) 
            }
            else if(e.target.id === "src"){
                fetch('http://127.0.0.1:8000/stations2/?fnd='+e.target.value)
                .then(res => res.json())
                .then((data) => {
                    this.setState({ src_items: data})
                    console.log('items: ', this.state)
                })
            }
            
        }
    }


    addToDst = (id) => {
        const item = this.state.dst_items.find(item => item.id === id);
        console.log(item)
        this.setState({
            dst: item.name,
            dst_items: []
        })
        
    }

    addToSrc = (id) => {
        const item = this.state.src_items.find(item => item.id === id);
        console.log(item)
        this.setState({
            src: item.name,
            src_items: []
        })
    }

    addTimeDate = () => {
        console.log("Add time was called!!!!!")
        var date = new Date();
        var m = date.getMinutes();
        var h = date.getHours();
        var d = date.getDate();
        var mo = date.getMonth();
        var y = date.getFullYear();
        this.setState({
            time: h + ":" + m,
            date: d + "." + mo + "." + y 
        })
    }

    handleChangeTD = (e) => {
        console.log("eTD"+e.target.id)
        console.log("eTD"+e.target.value)
        if(e.target.id === "time"){
            this.setState({time: e.target.value})
        }
        else if(e.target.id === "date"){
            this.setState({date: e.target.value})
        }
    }

    componentDidMount(){
        this.addTimeDate();
    }


    render(){
        return(
            <div>
                <h1> Form </h1>
                <p>Tu bude form na hladanie</p>
                <form>
                    <label htmlFor="src">Odkial:</label>
                    <input autoComplete="off" type="text" id="src" onChange={this.handleChange} value={this.state.src}></input>
                    <SearchOptions addToDst={this.addToSrc} options={this.state.src_items}></SearchOptions>
                    <label htmlFor="dst">Kam:</label>
                    <input autoComplete="off" type="text" id="dst" onChange={this.handleChange} value={this.state.dst}></input>                
                    <SearchOptions addToDst={this.addToDst} options={this.state.dst_items}></SearchOptions>
                    <label htmlFor="date">Datum:</label>
                    <input autoComplete="off" type="text" id="date" onChange={this.handleChangeTD} value={this.state.date}></input>
                    <label htmlFor="time">Cas:</label>
                    <input autoComplete="off" type="text" id="time" onChange={this.handleChangeTD} value={this.state.time}></input>
                    <button><a href='/select'>Submit</a></button>
                </form>
            </div>
        )
    }
}
export default SearchConnections