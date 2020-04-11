import React from 'react'

export default class Passenger extends React.Component {
    state = {
      tablerows: [0,],
      tablerows2: [{id:0,fname:"",lname:"", type:""}]
    }

    addRow = () => {
        console.log("pridavam")
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

    render(){
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
                      <td><input type="text"></input></td>
                      <td><input type="text"></input></td>
                      <td><span>typ</span></td>
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
/*
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
*/