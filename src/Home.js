import React, { Component } from 'react';
import './App.css';
import CreateGame from './CreateGame.js';
import {fetchGames} from './api/index.js';

class Home extends Component {
  constructor(props){
    super(props);
    this.state = {
      render: 'gameList',
      games: false
    }
    this.renderCreateGame = this.renderCreateGame.bind(this);
  }
  componentDidMount () {
    fetchGames().then((games) => {
      this.setState(() => ({games}));
    })
  }
  renderCreateGame () {
    this.state.render === 'createGame'? this.setState(() => ({render: 'gameList'})): this.setState(() => ({render: 'createGame'}));
  }
  render() {
    return (
      <div className="app-intro">
          <button onClick={this.renderCreateGame}>Create a new game</button>
          {this.state.render === 'createGame' ? <CreateGame exitSubmit={this.renderCreateGame}/> : null}
          <div>Games:</div>
          {Object.keys(this.state.games).map((id) => <h3> {this.state.games[id]['name']} </h3>)}
      </div>
    );
  }
}

export default Home;