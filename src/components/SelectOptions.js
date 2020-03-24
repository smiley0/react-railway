import React from 'react';
import './SearchOptions.css';

function SelectOptions({items, date}) {

    console.log("date")
    var dmy = date.split(".");
    console.log(dmy)

    const itemsList = items.results.map((item, i) => {
    console.log(item)
    var sum_distance = 0;
    var sum_time = 0;
    var previous_time = 0;
    var transfere_time = 0;
    item.forEach(element => {
      sum_distance += element.distance
      console.log(">> "+element.distance)
      var arrival_time = element.arrival_time.split(":");
      var departure_time = element.departure_time.split(":");
      var reserve_arr_t = new Date(dmy[2],dmy[1],dmy[0], arrival_time[0], arrival_time[1])
      var reserve_dep_t = new Date(dmy[2],dmy[1],dmy[0], departure_time[0], departure_time[1])
      console.log(dmy[2],dmy[1],dmy[0], arrival_time[0], arrival_time[1])
      console.log(reserve_arr_t.getTime()-reserve_dep_t.getTime())
      
      if(previous_time !== 0){
        transfere_time = reserve_dep_t.getTime()-previous_time
      }

      sum_time += transfere_time + reserve_arr_t.getTime() - reserve_dep_t.getTime() 
      previous_time = reserve_arr_t.getTime()
    });
    var sum_time_string = new Date(sum_time).toISOString().slice(11, 16)
  
    return(
          <div key={i}>{item.map((itm, i) => {
            //hms = itm.departure_time.split(":");
            //console.log(hms)
            return (
                <table key={i}>
                  <tbody>
                  <tr> 
                    <th>{itm.departure_time}</th>
                    <td>{itm.src}</td>
                    <td><i className="fas fa-subway"></i></td>
                    <td>{itm.id}</td>
                  </tr>
                  <tr>
                    <th>{itm.arrival_time}</th>
                    <td>{itm.dst}</td>
                    <td>{itm.number}</td>
                  </tr>
                  </tbody>
                </table>
            )
          })}
          <div>
            <p>{sum_time_string}</p>
            <p>{sum_distance}</p>
          </div>
          </div>
    )
  })
  console.log(items)
  return (
    <div>
      {itemsList}
    </div>
    /*
   <div>
       <p>OK</p>
   </div>
   */
  );
}

export default SelectOptions;