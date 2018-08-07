import React from 'react'
import 'whatwg-fetch';

const ListView = (props) => {

    return (
        <ul className="listView">
        {props.markers.filter(marker => marker.getVisible()).map((marker, i) =>
            (<li key={i}><button>{marker.title}</button></li>))
        }
        </ul>
    )
}

export default ListView;
