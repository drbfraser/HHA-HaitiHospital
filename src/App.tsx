import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route} from 'react-router-dom';
import HomePage from './pages/HomePage'

function App() {
  return (
    <Router>
      <div className="app">
        <Route exact path='/home' component={HomePage}/>
      </div>
    </Router>
  );
}

export default App;
