import React, {Component} from 'react'
import scriptLoader from 'react-async-script-loader'
import escapeRegExp from 'escape-string-regexp'
import { Venue } from './Venue'


class MapContainer extends Component {

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
    venues: [],
    filteredVenues: [],
    error: null,
    selectedMarkerIndex: 0
  }

  /** Render venues from Foursquare API  */
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
    }).then(response => {
      if(response.ok){
        return response.json()
      } else {
        throw new Error('Network response was not ok.')
      }
    })
      .then(response => {
        setVenueState({venues: response.response.groups[0].items})
      })
      .catch(e => {
        console.log('There has been a problem with yur fetch operation:', e)
        this.setState({error: e.toString()})
      })
      console.log(this.state.venues);
  }

  /** Render Google map and call methods */
  componentWillReceiveProps({isScriptLoadSucceed}) {
    if (isScriptLoadSucceed) {
      const map = new window.google.maps.Map(document.getElementById('map'), {
      zoom: 16,
      center: {lat: 48.804546, lng: 2.127116},
      })
      this.getVenues();
      //this.renderMarkers(map);
      if(this.state.venues.length>1){
        this.renderMarkers(map);
        console.log(this.state.markers);
      }
      else{
        console.log("Error, no markers found")
      }
      this.displayInfo();
      console.log(map);
    }
      else 
        console.log('Map failed to load');
       //this.props.onError()
  }

   /*componentDidMount () {
    const { isScriptLoadSucceed } = this.props
    if (isScriptLoadSucceed) {
      this.getVenues();
    }
  }*/

  renderMarkers= (map) => {
    const {venues, markers} = this.state
    const infowindow = new window.google.maps.InfoWindow();
    const bounds = new window.google.maps.LatLngBounds();

    for (let i = 0; i < venues.length; i++) {
      const position = {lat: venues[i].venue.location.lat, lng: venues[i].venue.location.lng};
      // Create a marker per location, and put into markers array.
      const marker = new window.google.maps.Marker({
        position: position,
        //title: venues[i].venue.name,
        title: venues[i].venue.name,
        address: venues[i].venue.location.address,
        category: venues[i].venue.categories[0].name,
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
      infowindow.setContent(`<h3>${marker.title}</h3><h4>${marker.category}</h4><div>${marker.address}</div>`);
      console.log(typeof(marker))
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

  updateQuery = (query) => {
    this.setState({ query: query })
  }

  /*handleValueChange = (e) => {
    this.setState({query: e.target.value})
  }*/

  render() {
    const {venues, markers, query} = this.state;

    const venueList = venues.map((item,i) =>
      <Venue key={i} 
      name={item.venue.name}  //"name attribute"
      />
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
    for (let i = 0; i < venues.length; i++) {
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
            aria-label="Input filter venues"
            value={query}
            onChange={(event) => this.updateQuery(event.target.value)}
            />
            <ul className="listView">
          {/*showingPlaces.map((marker, i) =>(<li key={i}>{marker.title}</li>)
)})*/}
              {venueList}
              </ul>
          </div>
          <div id="map" role="application" ref="map" aria-label="Google map with markers of venues">
            Loading Map...
          </div>
        </div>
      </div>
    )
  }
}

export default scriptLoader(
  [`https://maps.googleapis.com/maps/api/js?key=AIzaSyDs0VIWSmdG3BZnOiBxOWz4SVqQF0t7QmQ`]
)(MapContainer);
