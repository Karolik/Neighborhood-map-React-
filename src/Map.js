import React, {Component} from 'react'
import ReactDOM from 'react-dom'


export default class Map extends Component {

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
    infoWindow: new this.props.google.maps.InfoWindow(),
    bounds: new this.props.google.maps.LatLngBounds(),
    defaultIcon: () => {this.makeMarkerIcon('0091ff')},
    highlightedIcon: () => {this.makeMarkerIcon('FFFF24')}
  }

  componentDidMount() {
    this.initMap();
  }

  initMap() {
    if (this.props && this.props.google) {
      // google is available
      const {google} = this.props;
      const maps = google.maps;

      const mapRef = this.refs.map;
      const node = ReactDOM.findDOMNode(mapRef);

      let zoom = 15;
      let lat = 48.804546;
      let lng = 2.127116;
      const center = new maps.LatLng(lat, lng);
      const mapConfig = Object.assign({}, {
        center: center,
        zoom: zoom,
        mapTypeId: 'roadmap'
      })
      this.map = new maps.Map(node, mapConfig) 
      this.renderMarkers()
    }
  }

    renderMarkers() {
      const {google} = this.props
      const {infowindow, locations, markers} = this.state

      locations.forEach((location, i) => {
        const marker = new google.maps.Marker({
          position: {lat: location.location.lat, lng: location.location.lng},
          map: this.map,
          title: location.title
        })
        // Push the marker to the array of markers.
        markers.push(marker);
        this.setState({markers});
        console.log(markers);

        marker.addListener('click', () => {
          this.populateInfoWindow(marker, infowindow)
        })

        this.state.bounds.extend(marker.position);
      })
    // Extend the boundaries of the map for each marker
    this.map.fitBounds(this.state.bounds);
    }

    populateInfoWindow = (marker, infowindow) => {
      //const {markers} = this.state;
      //let infowindow = this.state;
      // Check to make sure the infowindow is not already opened on this marker.
      if (infowindow.marker !== marker) {  
        infowindow.marker = marker;
        infowindow.setContent('<div>' + marker.title + '</div>');
        infowindow.open(this.map, marker);
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function() {
          infowindow.marker = null;
        });
      }
    }
    
    makeMarkerIcon = (markerColor) => {
      const {google} = this.props
      let markerImage = new google.maps.MarkerImage(
        'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
        '|40|_|%E2%80%A2',
        new google.maps.Size(21, 34),
        new google.maps.Point(0, 0),
        new google.maps.Point(10, 34),
        new google.maps.Size(21,34));
      return markerImage;
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
