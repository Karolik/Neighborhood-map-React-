import React from 'react';
import { GoogleApiWrapper } from 'google-maps-react'
import './App.css'
import Map from './Map'

function MapsApp(props) {
    return (
      <div className="app">
        <h1 className="title"> Map of Notre Dame, Versailles </h1>
        <Map google={props.google} />
      </div>
    )
  }

export default GoogleApiWrapper({
  apiKey: 'AIzaSyDs0VIWSmdG3BZnOiBxOWz4SVqQF0t7QmQ'
})(MapsApp)


//export default App;
