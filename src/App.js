import React, { Component } from 'react';
import './App.css';
import {createGame} from './api/index.js';
import CreateGame from './CreateGame.js';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      render: 'gameList'
    }
  }
  render() {
    return (
      <div className="app">
          <h1 className="app-title">Codenames</h1>
        <div className="app-intro">
          <button onClick={() => {createGame('jordyn')}}>Create a new game</button>
          {this.state.render === 'createGame' ? <CreateGame/> : null}
          <div>Games</div>

        </div>
      </div>
    );
  }
}

export default App;
