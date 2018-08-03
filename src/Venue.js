import React, { Component } from 'react';
import 'whatwg-fetch';

export class Venue extends Component {
  
  render() {
    return (
      <li>{this.props.name} 
      </li>
    )
  }
}
