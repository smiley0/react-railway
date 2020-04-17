import React from 'react';
import './SearchOptions.css';

function SearchOptions({type, len, options, addToDst}) {
  if(options.results === undefined){
    return(
      <ul className={type}>
    </ul>
    );
  }
  else{
  const optionsList = options.results.map(option => {
    return(
          <li onClick={() => {addToDst(option.id)}} key={option.id}><b>{option.name.substring(0,len)}</b>{option.name.substring(len)}</li>
    )
  })
  return (
    <ul className={type}>
      {optionsList}
    </ul>
  );
}
}

export default SearchOptions;