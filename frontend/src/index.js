import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Axios from "axios";

window.axios = Axios;

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
