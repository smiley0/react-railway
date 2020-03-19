import React from 'react'
import SearchOptions from './SearchOptions'

class SearchConnections extends React.Component {
    state = {
        items: [],
        dst: "",
        isLoaded: false,
        id: ""
    }

    handleChange = (e) => {
        //console.log(e.target.id)
        console.log(e.target.value)
        this.setState({dst: e.target.value})
        if(e.target.value.length === 0){
            this.setState({items: [], isLoaded: false, dst: e.target.value})
        }
        else{
            fetch('http://127.0.0.1:8000/stations2/?fnd='+e.target.value)
                .then(res => res.json())
                .then((data) => {
                    this.setState({ items: data, isLoaded: true})
                    console.log('items: ', this.state)
                })
        }
    }


    addToForm = (id) => {
        console.log(id)
        const item = this.state.items.find(item => item.id === id);
        console.log(item)
        this.setState({
            dst: item.name,
            items: []
        })
    }


    render(){
        return(
            <div>
                <h1> {this.state.isLoaded ? 'som tam' : 'NIE'}</h1>
                <p>Tu bude form na hladanie</p>
                <form>
                    <label htmlFor="odkial">Odkial:</label>
                    <input autoComplete="off" list="browsers1" type="text" id="odkial" onChange={this.handleChange}></input>
                    <datalist id="browsers1">
                        <option value="Internet Explorer"></option>
                        <option value="Firefox"></option>
                        <option value="Chrome"></option>
                        <option value="Opera"></option>
                        <option value="Safari"></option>
                    </datalist>
                    <label htmlFor="kam">Kam:</label>
                    <input autoComplete="off" type="text" id="kam" onChange={this.handleChange} value={this.state.dst}></input>
                
                    <SearchOptions addToForm={this.addToForm} options={this.state.items}></SearchOptions>
                    <button>Submit</button>
                </form>
            </div>
        )
    }
}
export default SearchConnections