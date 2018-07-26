import React, {Component} from 'react'
//import ReactDOM from 'react-dom'
import scriptLoader from 'react-async-script-loader'


class Map extends Component {

  state = {
    locations: [
      {title: 'Versailles Palace', location: {lat: 48.804865, lng: 2.120355}},
      {title: 'Church of Notre-Dame', location: {lat: 48.807542, lng: 2.128779}},
      {title: 'Notre Dame Market', location: {lat: 48.806546, lng: 2.132030}},
      {title: 'Italian Restaurant', location: {lat: 48.807963, lng: 2.131558}},
      {title: 'Cinema Cyrano', location: {lat: 48.808210, lng: 2.131097}}
    ],
    markers: [],
    query: '',
    //infoWindow: new this.props.google.maps.InfoWindow(),
    //bounds: new this.props.google.maps.LatLngBounds(),
    //highlightedIcon: false
  }

  componentWillReceiveProps({isScriptLoadSucceed}) {
    if (isScriptLoadSucceed) {
      const map = new window.google.maps.Map(document.getElementById('map'), {
      zoom: 16,
      center: {lat: 48.804546, lng: 2.127116},
      })
      this.renderMarkers();
    }
    else this.props.onError()
  }

 /* componentDidMount () {
    const { isScriptLoadSucceed } = this.props
    if (isScriptLoadSucceed) {
      this.renderMarkers();
    }
  }*/

  renderMarkers() {
    //const {google} = this.props
    const {locations, markers} = this.state

    for (let i = 0; i < locations.length; i++) {
      var position = locations[i].location;
      // Create a marker per location, and put into markers array.
      const marker = new window.google.maps.Marker({
        position: {lat: locations[i].location.lat, lng: locations[i].location.lng},
        //position: position,
        title: locations[i].title,
        map: this.map,
        id: i
      })
      // Push the marker to our array of markers.
      markers.push(marker);
      this.setState({markers});
      console.log(markers);

    }
  }

 render() {
    return(
      <div>
        <div className="container">
          <div className="searchInput">
          </div>
          <div id="map" role="application" ref="map">
          </div>
        </div>
      </div>
    )
  }
}

export default scriptLoader(
  [`https://maps.googleapis.com/maps/api/js?key=AIzaSyDs0VIWSmdG3BZnOiBxOWz4SVqQF0t7QmQ`]
)(Map);
