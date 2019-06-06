import React, {Component} from 'react'
import scriptLoader from 'react-async-script-loader'
//import { Venue } from './Venue'
import ListView from './ListView'
import Search from './Search'


class MapContainer extends Component {

  state = {
    markers: [],
    query: '',
    map: '',
    venues: [],
    //foundVenues: [],
    error: null
  }

  /** Render venues from Foursquare API  */
  componentDidMount() {
    this.getVenues();
  }

  getVenues() {
    let setVenueState = this.setState.bind(this);
    const venuesEndpoint = 'https://api.foursquare.com/v2/venues/explore?';

    const params = {
      client_id: '*****',
      client_secret: '*****',
      ll: '48.804546,2.127116', //The latitude and longitude of Notre Dame, Versailles
      limit: 6, //The max number of venues to load
      section: 'topPicks',//or 'sights'
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
        const mapContainer = document.querySelector('.container');
        mapContainer.innerHTML = `<div class='error'><h2>ERROR</h2>
        <p>Foursquare API failed to fetch the data. Please try to refresh the page.<p></div>`;
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
      if(this.state.venues.length>1){
        this.renderMarkers(map);
        console.log(this.state.markers);
        this.displayInfo();
        this.toggleVenueList();
      }
      else{
        console.log("Error, no markers found")
        const mapContainer = document.querySelector('.container');
        mapContainer.innerHTML = `<div class='error'><h2>UPS ERROR</h2>
        <p>No markers were found. The Foursquare API failed to fetch the data. Please try to refresh the page.</p></div>`;
      }
      console.log(map);
    } else {
      console.log('Map failed to load');
      const mapContainer = document.querySelector('.container');
      mapContainer.innerHTML = `<div class='error'><h2>UPS ERROR</h2>
      <p>Google Maps API failed to load.
      Try to refresh the page and check your browser console for more informations.<p></div>`;
      //this.props.onError()
    }    
  }

  /** Create and render markers of the venues. */
  renderMarkers= (map) => {
    const {venues, markers} = this.state
    const infowindow = new window.google.maps.InfoWindow();
    const bounds = new window.google.maps.LatLngBounds();

    for (let i = 0; i < venues.length; i++) {
      const position = {lat: venues[i].venue.location.lat, lng: venues[i].venue.location.lng};
      // Create a marker per location, and put into markers array.
      const marker = new window.google.maps.Marker({
        position: position,
        title: venues[i].venue.name,
        address: venues[i].venue.location.address,
        category: venues[i].venue.categories[0].name,
        map: map,
        animation: window.google.maps.Animation.DROP,
        id: i,
        gestureHandling: 'cooperative',
        tabIndex: "0"
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

  /** Create an infowindow, and open it when  */
  populateInfoWindow = (marker, infowindow) => {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker !== marker) {
      infowindow.marker = marker;
      marker.setAnimation(window.google.maps.Animation.BOUNCE);   //Animate the marker when clicked
			setTimeout(function(){
			  marker.setAnimation(null); 
			}, 200);
      infowindow.setContent(`<a tabIndex="0" aria-label="Infowindow for marker"><h3>${marker.title}</h3><h4>${marker.category}</h4><div>${marker.address}</div></a>`);
      infowindow.open(this.map, marker);
      // Make sure the marker property is cleared if the infowindow is closed.
      infowindow.addListener('closeclick', () => {
        infowindow.setMarker = null
      })
    }
  }

  /** When clicked on a place on the list, display an infowindow. */
  displayInfo = () => {
    const {markers} = this.state
    const infowindow = new window.google.maps.InfoWindow();
    const that = this
    const place = document.querySelector('.listView')
  
    if(infowindow){
      infowindow.close();
      place.addEventListener('click', function(event){
        const index = markers.findIndex(marker => (marker.title === event.target.innerText))
        if(infowindow){
          infowindow.close();
        }
          that.populateInfoWindow(markers[index], infowindow)
      })
    }
  }

/** Search venues by their name. */
  searchVenues = (query) => {
    this.setState({ query })
    const {venues, markers} = this.state;
    const infowindow = new window.google.maps.InfoWindow();

    if (query) {
      venues.forEach((v, i) => {
        if (v.venue.name.toLowerCase().includes(query.toLowerCase())) {
          markers[i].setVisible(true)
        } else {
            markers[i].setVisible(false)
            //infowindow.setMarker = null
        }
      })
    } else {
        venues.forEach((v, i) => {
          if (markers.length && markers[i]) {
            markers[i].setVisible(true)
          }
        })
    }
  }

  /**  Open the list when the menu icon is clicked. */
  toggleVenueList = () => {
    const menu = document.querySelector('#menu');
    const mapArea = document.querySelector('.map');
    const venueList = document.querySelector('.sideBox');
    
    menu.addEventListener('click', function(e) {
      venueList.classList.toggle('open');
      e.stopPropagation();
    });
    mapArea.addEventListener('click', function() {
      venueList.classList.remove('open');
    });
  }

  /*
  clickVenueList = () => {
    this.state.venues.forEach((e, venue) => {
      this.LocationClicked(venue)
    }) 
  }*/

  render() {
    return(
        <div className="container">
          <aside className="sideBox">
            <Search 
            markers = {this.state.markers}
            venues = {this.state.venues}
            query = {this.state.query}
            searchVenues = {this.searchVenues}
            />
            <ListView 
            markers = {this.state.markers}
            venues = {this.state.venues}
            onClick = {this.displayInfo}
            />
          </aside>
          <section className="map">
          <div id="map" role="application" ref="map" aria-label="Google map with markers of venues">
            Loading Map...
          </div>
          </section>
        </div>
    )
  }
}

export default scriptLoader(
  [`https://maps.googleapis.com/maps/api/js?key=***********************`]
)(MapContainer);
