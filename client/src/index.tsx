import ReactDOM from 'react-dom';
import React, { Suspense } from 'react';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import './i18n';
import App from 'app';
import axios from 'axios';

if (process.env.NODE_ENV === 'development') {
  axios.defaults.baseURL = `http://${window.location.hostname}:8000`;
  axios.defaults.withCredentials = true;
}

ReactDOM.render(
  <React.StrictMode>
    <Suspense fallback={<div>Loading...</div>}>
      <App />
    </Suspense>
  </React.StrictMode>,
  document.getElementById('root'),
);
