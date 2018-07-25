import React from 'react'
import ReactDOM from 'react-dom'
//import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();

/*ReactDOM.render(
  <BrowserRouter><App /></BrowserRouter>,
  document.getElementById('root')
  )*/