import React from 'react'
import Loading from './Loading'

export default class Passenger extends React.Component {
    state = {
      isLoaded: false,
      passenger_types: [],
      tablerows2: [{id:0,fname:"",lname:"", type:"", showType:false}]
    }

    componentDidMount(){
        fetch("http://127.0.0.1:8000/passenger-type/")
        .then(res => res.json())
            .then(json => {
                this.setState({
                    isLoaded: true,
                    passenger_types: json,
                })
            });
    }

    addRow = () => {
        console.log(this.state.passenger_types.results[0].name)
        var rows = this.state.tablerows2;
        const nextId = this.state.tablerows2[this.state.tablerows2.length-1].id + 1;
        const newrow = {id: nextId,fname:"",lname:"", type:""};
        rows.push(newrow)
        this.setState({
            tablerows2: rows
        })
    }

    findID(array, id){
        for(var i = 0; i<array.length; i+=1){
            if(array[i]["id"] === id){
                return i;
            }
        }
        return -1;
    }

    removeRow = (i) =>{
        console.log("odstranujem" + i)
        if(this.state.tablerows2.length > 1){
            var rows = this.state.tablerows2
            const index = this.findID(rows, i);
            if (index > -1) {
                rows.splice(index, 1);
            }            
            this.setState({
                tablerows2: rows
            })
        }
        else{
            const row = [{id: 0,fname:"",lname:"", type:""}];
            this.setState({
                tablerows2: row
            })
        }
    }

    toggleShow = (id) => {
        var index = this.findID(this.state.tablerows2, id);
        var rows = this.state.tablerows2;
        rows[index].showType = !rows[index].showType;
        this.setState({
            tablerows2: rows
        })
      };

    addType = (id, type) => {
        console.log(id)
        console.log(type)
        var rows = this.state.tablerows2;
        var index = this.findID(this.state.tablerows2, id);
        rows[index].type = type;
        this.setState({
            tablerows2: rows
        })
        this.toggleShow(id)
    }
    handleChange = (e, id) => {
        console.log("handleChange"+e.target.id)
        console.log("handleChange"+e.target.value)
        console.log(id)
        var rows = this.state.tablerows2;
        var index = this.findID(this.state.tablerows2, id);
        if(e.target.id === "fname"){
            rows[index].fname = e.target.value;
            this.setState({tablerows2: rows})
        }
        else if(e.target.id === "lname"){
            rows[index].lname = e.target.value;
            this.setState({tablerows2: rows})
        }
    }

    render(){
        if (!this.state.isLoaded) {
            return (
            <div className='center bigLoad'>
                <Loading></Loading>
            </div>
            )
        }
        else{
            return (
                <div className='passenger'>
                <h1>ok som na dobrej stranke</h1>
                <table>
                    <thead>
                        <tr>
                            <th>Meno</th>
                            <th>Priezvisko</th>
                            <th>Typ</th>
                            <th>Zmazat?</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.tablerows2.map((r) => (
                            <tr key={r.id}>
                            <td><input id="fname" type="text" value={this.state.tablerows2[this.findID(this.state.tablerows2, r.id)].fname} onChange={(e)=>{this.handleChange(e, r.id)}}></input></td>
                            <td><input id="lname" type="text" value={this.state.tablerows2[this.findID(this.state.tablerows2, r.id)].lname} onChange={(e)=>{this.handleChange(e, r.id)}}></input></td>
                            <td><div><input onClick={() => {this.toggleShow(r.id)}} placeholder='Vyber' value={this.state.tablerows2[this.findID(this.state.tablerows2, r.id)].type} onChange={this.handleChange}></input>
                                    
                                    {(this.state.tablerows2[this.findID(this.state.tablerows2, r.id)].showType)?<SelectType moreOptions={this.state.passenger_types.results} addType={this.addType} id={r.id}></SelectType>:null}
                                    </div></td>
                            <td><button onClick={() => {this.removeRow(r.id)}}>zmaz</button></td>
                            </tr>
                        ))}
                        <tr>
                            <td><button onClick={this.addRow}>pridat dalsieho cestujuceho</button></td>
                        </tr>
                    </tbody>
                </table>
                </div>
            )
        }
    }
  }
/*
  class SelectType extends React.Component {
    state={
        isShow: false,
    }
    render(){
      return (
        <div>
          <p>dalsie typy</p>
        </div>
      )
    }
  }
*/
  function SelectType ({moreOptions, addType,id}) {
    const optionsList = moreOptions.map((option, i) => {
      return(
            <li key={i} onClick={()=>{addType(id, option.name)}}>{option.name}</li>
      )
    })
    return (
      <ul>
        {optionsList}
      </ul>
    );
  }
