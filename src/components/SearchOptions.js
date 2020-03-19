import React from 'react';

function SearchOptions({options, addToDst}) {
  const optionsList = options.map(option => {
    return(
          <li onClick={() => {addToDst(option.id)}} key={option.id}>{option.name}</li>
    )
  })
  return (
    <ul>
      {optionsList}
    </ul>
  );
}

export default SearchOptions;