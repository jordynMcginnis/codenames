import React, { Component } from 'react';
import TeamSelection from './teamSelection.js';
import { firebasedb } from './utils/config.js';
import SpyMasters from './SpyMasters.js';
import FieldOps from './FieldOps.js';
import {checkStart, checkData, gatherData} from './api/index.js';

class GameBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      teamSelection : false,
      start: false,
      gameInfo: {},
      players: {},
      name: false,
      turn: false,
      spym: false
    }
  }
  componentDidMount () {
    let path = this.props.location.pathname.slice(1);
    let games = firebasedb.ref('/games/' + path);
    games.on('value', (snapshot) => {
      let value = snapshot.val();
      console.log(value.start);
      this.setState(() => ({gameInfo: value, players: value.players, start: value.start, turn: value.turn, spym: value.spyMaster}));
    })
  }
  startGame = (name) =>  {
    this.setState(() => ({name: name}));
    checkStart(this.props.location.pathname.slice(1));
    checkData(this.props.location.pathname.slice(1));
  }
  render() {
    return (
      <div className="game-board">
        {this.state.start === false
          ? <TeamSelection id={this.props.location.pathname.slice(1)} start={this.startGame}/>
          : <div>
              {Object.keys(this.state.players).map((player) => {
                if(this.state.name === this.state.gameInfo.players[player] && player.slice(-1) == this.state.spym){
                  return <SpyMasters id={this.props.location.pathname.slice(1)} name={this.state.name}/>
                } else if (this.state.name === this.state.gameInfo.players[player]){
                  return <FieldOps id={this.props.location.pathname.slice(1)} name={this.state.name}/>
                }
              })}
            </div>
        }
      </div>
    );
  }
}

export default GameBoard;