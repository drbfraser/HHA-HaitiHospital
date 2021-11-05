import ReactDOM from 'react-dom';
import React from 'react';
// import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
// import { Provider } from 'react-redux';
// import { createStore, applyMiddleware, compose } from 'redux';
// import thunk from 'redux-thunk';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min'

import App from 'app';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// import App from './app';
// import './index.css';
// import rootReducer from './store/reducers';

// Commented out during JS->TS since I'm uncertain
// const initialState = {};

// declare global {
//   interface Window {
//     __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
//   }
// }

// const store = createStore(
//   rootReducer,
//   initialState,
//   compose(
//     applyMiddleware(thunk),
//     (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ &&
//       window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__()) ||
//       compose,
//   ),
// );

// ReactDOM.render(
//   // Commented out during JS->TS since I'm uncertain
//   <Provider store={store}>
//     <Router>
//       <Switch>
//         <Route path="/" component={App} />
//       </Switch>
//     </Router>
//   </Provider>,
//   document.getElementById('root'),
// );
