import React from 'react';
import './SearchOptions.css';

function SearchOptions({type, options, addToDst}) {
  const optionsList = options.map(option => {
    return(
          <li onClick={() => {addToDst(option.id)}} key={option.id}>{option.name}</li>
    )
  })
  return (
    <ul className={type}>
      {optionsList}
    </ul>
  );
}

export default SearchOptions;