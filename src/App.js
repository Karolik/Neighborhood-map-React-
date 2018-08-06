import React from 'react';
//import { GoogleApiWrapper } from 'google-maps-react'
import './App.css'
import MapContainer from './MapContainer'

function MapsApp(props) {
  return (
    <div className="app">
      <header className="App-header">
        <a id="menu" className="header_menu">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M2 6h20v3H2zm0 5h20v3H2zm0 5h20v3H2z"/>
          </svg>
        </a>
        <h1 className="title"> Notre Dame, Versailles </h1>
      </header>
      <main>
        <MapContainer google={props.google} 
        //onToggle={ this.toggleAside }
        />
      </main>
    </div>
  )
}

export default MapsApp;
