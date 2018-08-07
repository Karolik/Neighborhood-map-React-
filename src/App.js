import React from 'react';
//import { GoogleApiWrapper } from 'google-maps-react'
import './App.css'
import MapContainer from './MapContainer'

function MapsApp(props) {
  return (
    <div className="app">
      <header className="app-header" >
        <button id="menu" className="header-menu" tabIndex="0" onClick={props.toggleVenueList}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M2 6h20v3H2zm0 5h20v3H2zm0 5h20v3H2z"/>
          </svg>
        </button>
        <h1 className="title"> Notre Dame, Versailles </h1>
      </header>
      <main>
        <MapContainer google={props.google}
        />
      </main>
    </div>
  )
}

export default MapsApp;
