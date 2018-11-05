import React, { Component } from 'react';
import ReactRouter, { Route, BrowserRouter as Router } from 'react-router-dom';
import Home from './Home.js';
import GameBoard from './GameBoard.js';

class App extends Component {
  render() {
    return (
      <Router>
        <div className="app">
          <h1 className="app-title">Code<span className='name'>Names</span></h1>
          <Route exact path='/' component={Home}/>
          <Route path='/:id' component={GameBoard} />
        </div>
      </Router>
    );
  }
}

export default App;