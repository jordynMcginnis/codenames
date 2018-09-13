import React, { Component } from 'react';
import './App.css';
import ReactRouter, { Route, BrowserRouter as Router } from 'react-router-dom';
import Home from './Home.js';

class App extends Component {
  render() {
    return (
      <Router>
        <div className="app">
          <h1 className="app-title">Codenames</h1>
          <Route exact path='/' component={Home}/>
        </div>
      </Router>
    );
  }
}

export default App;
