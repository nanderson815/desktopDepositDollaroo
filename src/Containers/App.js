import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';
import Login from '../Components/Login';
import Dashboard from '../Components/Dashboard'

function App() {
  return (
    <Router>
      <Route exact path="/" component={Login} />
      <Route exact path='/dashboard' component={Dashboard} />
    </Router>
  );
}

export default App;
