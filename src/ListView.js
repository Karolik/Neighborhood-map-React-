import React from 'react'
import 'whatwg-fetch';

const ListView = (props) => {

    return (
        <ul className="listView">
        {props.markers.filter(marker => marker.getVisible()).map((marker, i) =>
            (<li key={i} aria-label="Top pick on the map"><button aria-label="Click to open more info">{marker.title}</button></li>))
        }
        </ul>
    )
}

export default ListView;
