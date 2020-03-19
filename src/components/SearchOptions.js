import React from 'react';

function SearchOptions({options, addToForm}) {
  const optionsList = options.map(option => {
    return(
          <li onClick={() => {addToForm(option.id)}} key={option.id}>{option.name}</li>
    )
  })
  return (
    <ul>
      {optionsList}
    </ul>
  );
}

export default SearchOptions;