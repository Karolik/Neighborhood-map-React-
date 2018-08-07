import React from 'react';
import 'whatwg-fetch';

const ListView = (props) => {
    return (
        <ul className="listView">
        {props.markers.filter(m => m.getVisible()).map((m, i) =>
            (<li key={i} tabIndex="0">{m.title}</li>))
        }
        </ul>
    )
}

export default ListView;
