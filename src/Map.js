import React, {Component} from 'react'
//import ReactDOM from 'react-dom'
import scriptLoader from 'react-async-script-loader'
import escapeRegExp from 'escape-string-regexp'
import { Venue } from './Venue'


class Map extends Component {

  state = {
    /*locations: [
      {title: 'Versailles Palace', location: {lat: 48.804865, lng: 2.120355}},
      {title: 'Church of Notre-Dame', location: {lat: 48.807542, lng: 2.128779}},
      {title: 'Notre Dame Market', location: {lat: 48.806546, lng: 2.132030}},
      {title: 'Italian Restaurant', location: {lat: 48.807963, lng: 2.131558}},
      {title: 'Cinema Cyrano', location: {lat: 48.808210, lng: 2.131097}}
    ],*/
    markers: [],
    query: '',
    map: '',
    //highlightedIcon: false
    venues: []
  }

  componentDidMount() {
  this.getVenues();
  }

  getVenues() {
    let setVenueState = this.setState.bind(this);
    const venuesEndpoint = 'https://api.foursquare.com/v2/venues/explore?';

    const params = {
      client_id: 'NTYCPUV20MOOHIOHYXF3ZZ2A2EZVZ1RSHXKWFELIJBP5HNLC',
      client_secret: '4SATNABB4YRB5CECKTU5V1OIBQH0QYKTMIWZ1C2FKUP5JDJG',
      ll: '48.804546,2.127116', //The latitude and longitude of Notre Dame, Versailles
      limit: 6, //The max number of venues to load
      section: 'topPicks',//or 'sights'
      //query: 'Pubs', //The type of venues we want to query 'Pubs'
      v: '20180801' //The version of the API.
    };

    fetch(venuesEndpoint + new URLSearchParams(params), {
      method: 'GET'
    }).then(response => response.json()).then(response => {
      setVenueState({venues: response.response.groups[0].items});
    });
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
    //else 
      //this.props.onError()
  }

  renderMarkers= (map) => {
    const {venues, markers} = this.state
    const infowindow = new window.google.maps.InfoWindow();
    const bounds = new window.google.maps.LatLngBounds();

    for (let i = 0; i < venues.length; i++) {
      //const position = venues[i].location;
      const position = {lat: venues[i].location.lat, lng: venues[i].location.lng};
      // Create a marker per location, and put into markers array.
      const marker = new window.google.maps.Marker({
        position: position,
        title: venues[i].name,
        map: map,
        animation: window.google.maps.Animation.DROP,
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
      marker.setAnimation(window.google.maps.Animation.BOUNCE);   //Animate the marker when clicked
			setTimeout(function(){
			  marker.setAnimation(null); 
			}, 200);
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
  
    if(infowindow){
      infowindow.close();
      place.addEventListener('click', function(event){
        const index = markers.findIndex(marker => (marker.title === event.target.innerText))
        //Check if another infowindow is open and close it
        //... ???
        if(infowindow){
          infowindow.close();
        }
          that.populateInfoWindow(markers[index], infowindow)
      })
    }
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

  // This function will loop through the listings and hide them all.
  hideMarkers = (markers) => {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
  }

  render() {
    const {venues, markers, query} = this.state;

    const venueList = venues.map((item,i) =>
      <Venue key={i} 
      name={item.venue.name}
      location={item.venue.location.address}/> //Create a new "name attribute"
    );

    let showingPlaces
    if (query) {
      for (let i = 0; i < venues.length; i++) {
      const match = new RegExp(escapeRegExp(query), 'i')
      showingPlaces = markers.filter((marker) => match.test(marker.title));

      if(markers[i].title.toLowerCase().includes(query.toLowerCase())){
        markers[i].setVisible(true)
      }
      else {
        markers[i].setVisible(false)
      
        //if (infowindow.marker === markers[i]) {
          // close the info window if marker removed
          //infowindow.close()
        //}
      }
    } 
  } else {
    for (var i = 0; i < venues.length; i++) {
      showingPlaces = markers
        if(markers[i]){
          markers[i].setVisible(true)
        }
      }
    }

    return(
      <div>
        <div className="container">
          <div className="textBox">
            <input className="search" role="search" type='text'
            value={query}
            onChange={(event) => this.updateQuery(event.target.value)}
            />
            <ul className="listView">
              {showingPlaces.map((marker, i) =>(<li key={i}>{marker.title}</li>)
              )}
              {venueList}
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
