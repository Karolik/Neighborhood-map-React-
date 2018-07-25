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
    bounds: new this.props.google.maps.LatLngBounds()
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
      let {google} = this.props
      let {infowindow} = this.state
      let {locations} = this.state
      let {markers} = this.state

      locations.forEach((location, i) => {
        const marker = new google.maps.Marker({
          position: {lat: location.location.lat, lng: location.location.lng},
          map: this.map,
          title: location.title
        })
        // Push the marker to the array of markers.
        markers.push(marker);
        this.setState({markers});

        marker.addListener('click', () => {
          this.populateInfoWindow(marker, infowindow)
        })

        this.state.bounds.extend(marker.position);
      })
    // Extend the boundaries of the map for each marker
    this.map.fitBounds(this.state.bounds);
    }

      // Style the markers a bit. This will be our listing marker icon.
      //var defaultIcon = makeMarkerIcon('0091ff');
      
      // Create a "highlighted location" marker color for when the user
      // mouses over the marker.
      //var highlightedIcon = makeMarkerIcon('FFFF24');

      // The following group uses the location array to create an array of markers on initialize.
     /* for (let i = 0; i < locations.length; i++) {
        // Get the position from the location array.
        //var position = locations[i].location;
        //var position = {lat: locations[i].location.lat, lng: locations[i].location.lng}
        //var title = locations[i].title;
        // Create a marker per location, and put into markers array.
        const marker = new google.maps.Marker({
          //position: position,
          position: {lat: locations[i].location.lat, lng: locations[i].location.lng},
          title: locations[i].title,
          map: this.map,
          //animation: google.maps.Animation.DROP,
          //icon: defaultIcon,
          id: i
        })
        // Push the marker to our array of markers.
        this.state.markers.push(marker);
        this.setState((state) => ({
          markers: [...state.markers, marker]
        }))
        // Create an onclick event to open the large infowindow at each marker.
       /* marker.addListener('click', function() {
          this.populateInfoWindow(this, infowindow);
        });*/
        // Two event listeners - one for mouseover, one for mouseout,
        // to change the colors back and forth.
        /*marker.addListener('mouseover', function() {
          this.setIcon(highlightedIcon);
        });*/
        /*marker.addListener('mouseout', function() {
          this.setIcon(defaultIcon);
        }); 
      }
      }*/

    populateInfoWindow = (marker, infowindow) => {
      const {markers} = this.state;
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

/*export default GoogleApiWrapper({
  apiKey: 'AIzaSyDs0VIWSmdG3BZnOiBxOWz4SVqQF0t7QmQ'
})(App) */