import React, {Component} from 'react'
//import ReactDOM from 'react-dom'
import scriptLoader from 'react-async-script-loader'
import escapeRegExp from 'escape-string-regexp'


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
    //highlightedIcon: false
  }

  componentWillReceiveProps({isScriptLoadSucceed}) {
    if (isScriptLoadSucceed) {
      const map = new window.google.maps.Map(document.getElementById('map'), {
      zoom: 16,
      center: {lat: 48.804546, lng: 2.127116},
      })
      this.renderMarkers(map);
      this.displayInfo();
    }
    else this.props.onError()
  }

  componentDidMount () {
    const { isScriptLoadSucceed } = this.props
    if (isScriptLoadSucceed) {
      this.renderMarkers();
    }
  }

  renderMarkers= (map) => {
    const {locations, markers} = this.state
    const infowindow = new window.google.maps.InfoWindow();
    const bounds = new window.google.maps.LatLngBounds();

    for (let i = 0; i < locations.length; i++) {
      const position = locations[i].location;
      //position: {lat: locations[i].location.lat, lng: locations[i].location.lng},
      // Create a marker per location, and put into markers array.
      const marker = new window.google.maps.Marker({
        position: position,
        title: locations[i].title,
        map: map,
        id: i
      })

      // Push the marker to our array of markers.
      markers.push(marker);
      this.setState({markers});
      console.log(markers);

      // Create an onclick event to open an infowindow at each marker.
      marker.addListener('click', () => {
        this.populateInfoWindow(marker, infowindow);
      });
      bounds.extend(markers[i].position);
    }

    // Extend the boundaries of the map for each marker
    map.fitBounds(bounds);
  }

  populateInfoWindow = (marker, infowindow) => {
    //const {markers} = this.state;
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker !== marker) {
      infowindow.marker = marker;
      infowindow.setContent('<div>' + marker.title + '</div>');
      infowindow.open(this.map, marker);
      // Make sure the marker property is cleared if the infowindow is closed.
      infowindow.addListener('closeclick', () => {
        infowindow.setMarker = null
      })
    }
  }
  //When clicked on a place on the list, display an infowindow
  displayInfo = () => {
    const {markers} = this.state
    const infowindow = new window.google.maps.InfoWindow();
    const that = this
    const place = document.querySelector(".listView")

    place.addEventListener('click', function(event){
      const index = markers.findIndex(marker => (marker.title === event.target.innerHTML))
      that.populateInfoWindow(markers[index], infowindow)
    })
  }

  makeMarkerIcon = (markerColor) => {
    const {google} = this.props
    let markerImage = new window.google.maps.MarkerImage(
      'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
      '|40|_|%E2%80%A2',
      new google.maps.Size(21, 34),
      new google.maps.Point(0, 0),
      new google.maps.Point(10, 34),
      new google.maps.Size(21,34));
    return markerImage;
  }

  updateQuery = (query) => {
    this.setState({ query: query.trim() })
  }

  clearQuery = () => {
    this.setState({ query: '' })
  }

  render() {
    const {locations, markers, query} = this.state;

    let showingPlaces
    if (query) {
      const match = new RegExp(escapeRegExp(query), 'i')
      showingPlaces = markers.filter((marker) => match.test(marker.title))
    } else {
      showingPlaces = markers
    }


    return(
      <div>
        <div className="container">
          <div className="textBox">
            <input role="search" type='text'
            value={query}
            onChange={(event) => this.updateQuery(event.target.value)}
            />
            <ul className="listView">
              {showingPlaces.map((marker, i) =>(<li key={i}>{marker.title}</li>)
                )}
              </ul>
          </div>
          <div id="map" role="application" ref="map">
            Loading Map...
          </div>
        </div>
      </div>
    )
  }
}

export default scriptLoader(
  [`https://maps.googleapis.com/maps/api/js?key=AIzaSyDs0VIWSmdG3BZnOiBxOWz4SVqQF0t7QmQ`]
)(Map);
