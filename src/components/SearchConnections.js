import React from 'react'
import SearchOptions from './SearchOptions'
import './SearchConnection.css'
import {connect} from 'react-redux'
import {compose} from 'redux'
import { withRouter } from 'react-router-dom';


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
                fetch('http://127.0.0.1:8000/station/?search='+e.target.value)
                    .then(res => res.json())
                    .then((data) => {
                        this.setState({ dst_items: data})
                    })
            }
            else if(e.target.id === "src"){
                fetch('http://127.0.0.1:8000/station/?search='+e.target.value)
                .then(res => res.json())
                .then((data) => {
                    this.setState({ src_items: data})
                })
            }

        }
    }


    addToDst = (id) => {
        const item = this.state.dst_items.results.find(item => item.id === id);
        this.setState({
            dst: item.name,
            dst_items: []
        })

    }

    addToSrc = (id) => {
        const item = this.state.src_items.results.find(item => item.id === id);
        this.setState({
            src: item.name,
            src_items: []
        })
    }

    addTimeDate = () => {
        var date = new Date();
        var m = ((date.getMinutes()<10?'0':'')+date.getMinutes());
        var h = ((date.getHours()<10?'0':'')+date.getHours());
        var d = ((date.getDate()<10?'0':'')+date.getDate());
        var mo = (((date.getMonth()+1)<10?'0':'')+(date.getMonth()+1));
        var y = date.getFullYear();
        this.setState({
            time: h + ":" + m,
            date: d + "." + mo + "." + y
        })
    }

    handleChangeTD = (e) => {
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


    handleSubmit = (e) => {
        e.preventDefault();
        if(!(this.state.src !== "" && this.state.dst !== "")){
            console.log("you must set From and To")
            alert("you must set From and To");
        }
        else{
            const url = {src: this.state.src, dst: this.state.dst, time: this.state.time, date: this.state.date}
            //this.sleep(5000)
            this.props.updateUrl(url)
            this.props.history.push("/select")
        }
    }

    timePP = () => {
        if(this.state.time.substring(3)>= 30){
            this.setState({
                time: (Number(this.state.time.substring(0,2))+1)+ ":00",
            })

        }
        else{
            if(Number(this.state.time.substring(0,2)) !== 24){
                this.setState({
                    time: (this.state.time.substring(0,2))+ ":30",
                })
            }
        }
    }

    timeMM = () => {
        if(Number(this.state.time.substring(3)) === 0){
            this.setState({
                //time: (this.state.time.substring(0,2))+ ":30",
                time: (Number(this.state.time.substring(0,2))-1)+ ":30",
            })

        }
        else if(Number(this.state.time.substring(3)) > 30){
            this.setState({
                time: (this.state.time.substring(0,2))+ ":30",
            })
        }
        else{
            if(Number(this.state.time.substring(0,2)) !== 24){
                this.setState({
                    time: (Number(this.state.time.substring(0,2)))+ ":00",
                })
            }
        }
    }


    render(){
        return(
            <div className='sform'>
                <div className='scontainer'>
                    <i className="fas fa-search"></i>
                    <h2> Vyhľadanie spojenia </h2>
                    <form onSubmit={this.handleSubmit.bind(this)}>
                        <div className='inputrow'>
                            <div className='src'>
                            <input autoComplete="off" type="text" id="src" onChange={this.handleChange} placeholder='Odkiaľ' value={this.state.src}></input>
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
                                <div onClick={this.timeMM}><i className="fas fa-chevron-left"></i></div>
                                <input autoComplete="off" type="text" id="time" onChange={this.handleChangeTD} value={this.state.time}></input>
                                <div onClick={this.timePP}><i className="fas fa-chevron-right"></i></div>
                            </div>

                            <div className='radio'>
                                <label htmlFor="male" className="container">Odchod
                                    <input type="radio" id="odchod" name="odchod" value="odchod" defaultChecked="checked"></input>
                                    <span className='checkmark'></span>
                                </label>
                                <label htmlFor="female" className="container">Príchod
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
                            <button className='submitbtn'>Vyhľadať spojenie</button>
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

export default compose(
    withRouter,
    connect(mapStateToProps, mapDispatchToProps)
 ) (SearchConnections)
