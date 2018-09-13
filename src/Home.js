import React, { Component } from 'react';
import './App.css';
import CreateGame from './CreateGame.js';
import { Link } from 'react-router-dom';
import { firebasedb } from './utils/config.js';

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
    let that = this;
    let games = firebasedb.ref('/games/');
    games.on('value', function (snapshot) {
      let value = snapshot.val();
      that.setState(() => ({games: value}));
    })
  }
  renderCreateGame () {
    this.state.render === 'createGame'
      ? this.setState(() => ({render: 'gameList'}))
      : this.setState(() => ({render: 'createGame'}));
  }
  render() {
    return (
      <div className="app-intro">
          <button onClick={this.renderCreateGame}>Create a new game</button>
          {this.state.render === 'createGame' ? <CreateGame exitSubmit={this.renderCreateGame}/> : null}
          <div>Games:</div>
          {Object.keys(this.state.games).map((id) => <Link to={`/game/${id}`} key={id}> {this.state.games[id]['name']} </Link>)}
      </div>
    );
  }
}

export default Home;