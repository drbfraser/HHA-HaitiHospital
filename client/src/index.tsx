import React from 'react';
import ReactDOM from 'react-dom';
import 'index.css';
import App from 'App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);


// Commented out during converting JS to TS
// import React from 'react';
// import ReactDOM from 'react-dom';
// import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
// import { Provider } from 'react-redux';
// import { createStore, applyMiddleware, compose } from 'redux';
// import thunk from 'redux-thunk';

// import App from './App';
// import './index.css';
// import rootReducer from './store/reducers';

// Commented out during JS->TS since I'm uncertain
// const initialState = {};
// 
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
  // Commented out during JS->TS since I'm uncertain
  // <Provider store={store}>
  //   <Router>
  //     <Switch>
  //       <Route path="/" component={App} />
  //     </Switch>
  //   </Router>
  // </Provider>,
//   document.getElementById('root'),
// );
