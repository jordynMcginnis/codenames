import React, { Component } from 'react';
import './App.css';
import CreateGame from './CreateGame.js';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      render: 'gameList'
    }
    this.renderCreateGame = this.renderCreateGame.bind(this);
  }
  renderCreateGame () {
    this.state.render === 'createGame'? this.setState(() => ({render: 'gameList'})): this.setState(() => ({render: 'createGame'}));
  }

  render() {
    return (
      <div className="app">
          <h1 className="app-title">Codenames</h1>
        <div className="app-intro">
          <button onClick={this.renderCreateGame}>Create a new game</button>
          {this.state.render === 'createGame' ? <CreateGame exitSubmit={this.renderCreateGame}/> : null}
          <div>Games</div>
        </div>
      </div>
    );
  }
}

export default App;
