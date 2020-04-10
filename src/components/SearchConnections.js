import React from 'react'
import SearchOptions from './SearchOptions'
import './SearchConnection.css'
import {connect} from 'react-redux'
import {NavLink} from 'react-router-dom'


class SearchConnections extends React.Component {
    state = {
        src_items: [],
        dst_items: [],
        dst: "",
        src: "",
        id: "",
        time: "",
        date: "",
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
                fetch('http://127.0.0.1:8000/list-of-stations/?fnd='+e.target.value)
                    .then(res => res.json())
                    .then((data) => {
                        this.setState({ dst_items: data})
                        console.log('items: ', this.state)
                    }) 
            }
            else if(e.target.id === "src"){
                fetch('http://127.0.0.1:8000/list-of-stations/?fnd='+e.target.value)
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

    

    handleClick = () => {
        const url = {src: this.state.src, dst: this.state.dst, time: this.state.time, date: this.state.date}
        //console.log(url)
        //this.sleep(5000)
        this.props.updateUrl(url)
    }

    handleSubmit = (e) => {
        e.preventDefault();
    }


    render(){
        console.log('props')
        console.log(this.props)
        return(
            <div className='sform'>
                <div className='scontainer'>
                    <i className="fas fa-search"></i>
                    <h2> Vyhľadanie spojenia </h2>
                    <form onSubmit={this.handleSubmit}>
                        <div className='inputrow'>
                            <div className='src'>
                            <input autoComplete="off" type="text" id="src" onChange={this.handleChange} placeholder='Odkial' value={this.state.src}></input>
                            <SearchOptions type='src' len={this.state.src.length} addToDst={this.addToSrc} options={this.state.src_items}></SearchOptions>
                            </div>
                            <i className="fas fa-exchange-alt"></i>
                            <div className='dst'>
                            <input autoComplete="off" type="text" id="dst" onChange={this.handleChange} placeholder='Kam' value={this.state.dst}></input>                
                            <SearchOptions type='dst' len={this.state.dst.length} addToDst={this.addToDst} options={this.state.dst_items}></SearchOptions>
                            </div>
                        </div>
                        <div className='inputrow2'>
                            <div className='inputDate'>
                                <div><i className="fas fa-chevron-left"></i></div>
                                <input autoComplete="off" type="text" id="date" onChange={this.handleChangeTD} value={this.state.date}></input>
                                <div><i className="fas fa-chevron-right"></i></div>
                            </div>
                            <div className='inputTime'>
                                <div><i className="fas fa-chevron-left"></i></div>
                                <input autoComplete="off" type="text" id="time" onChange={this.handleChangeTD} value={this.state.time}></input>
                                <div><i className="fas fa-chevron-right"></i></div>
                            </div>

                            <div className='radio'>                                
                                <label htmlFor="male" className="container">Odchod
                                    <input type="radio" id="odchod" name="odchod" value="odchod" defaultChecked="checked"></input>
                                    <span className='checkmark'></span>
                                </label>
                                <label htmlFor="female" className="container">Prichod
                                    <input type="radio" id="prichod" name="prichod" value="prichod"></input>
                                    <span className='checkmark'></span>
                                </label>
                            </div>
                        </div>
                        <div className='inputrow3'>
                            <div>
                                <i className="far fa-caret-square-down"></i>
                                Rozšírené hľadanie
                            </div>
                            <NavLink to="/select"><button className='submitbtn' onClick={this.handleClick}>Vyhľadať spojenie</button></NavLink>
                        </div>
                            
                    </form>
                </div>
                
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        searchInfo: state.searchInfo
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateUrl: (url) => {dispatch({type: 'UPDATE_URL', url: url})}
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchConnections)



                                