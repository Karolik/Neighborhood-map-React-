import React from 'react';
import 'whatwg-fetch';

const Search = (props) => {
  return (
    <input className="search" role="search" type='text'
      aria-label="Search and filter venues by name"
      value={props.query}
      onChange={(event) => props.searchVenues(event.target.value)}
      />
  )
}

export default Search;