import React, { Component } from 'react';
import TeamSelection from './teamSelection.js';
import { firebasedb } from './utils/config.js';
import SpyMasters from './SpyMasters.js';
import FieldOps from './FieldOps.js';

class GameBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      teamSelection : false,
      start: false,
      gameInfo: {},
      players: {},
      name: false
    }
    this.startGame = this.startGame.bind(this);
  }
  componentDidMount () {
    let path = this.props.location.pathname.slice(1);
    let games = firebasedb.ref('/games/' + path);
    games.on('value', (snapshot) => {
      let value = snapshot.val();
      this.setState(() => ({gameInfo: value, players: value.players}));
    })
  }
  startGame (name) {
    this.state.start === true ? this.setState(() => ({start: false})) : this.setState(() => ({start: true, name: name}));
  }

  render() {
    return (
      <div className="game-board">
      {this.state.start === false
        ? <TeamSelection id={this.props.location.pathname.slice(1)} start={this.startGame}/>
        : <div>
            {Object.keys(this.state.players).map((player) => {
              if(this.state.name === this.state.gameInfo.players[player] && player.slice(-1) == 1){
                return <SpyMasters/>
              } else if (this.state.name === this.state.gameInfo.players[player]){
                return <FieldOps/>
              }
            })}
          </div>
      }
      </div>
    );
  }
}

export default GameBoard;