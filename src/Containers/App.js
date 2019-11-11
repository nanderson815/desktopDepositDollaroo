import React from 'react';
import './App.css';
import { HashRouter, Route, } from 'react-router-dom';
import Login from '../Components/Login';
import Dashboard from '../Components/Dashboard';

function App() {
  return (
    <HashRouter>
      <div>
        <Route exact path="/" component={Login} />
        <Route exact path='/dashboard' component={Dashboard} />
      </div>
    </HashRouter>
  );
}

export default App;
