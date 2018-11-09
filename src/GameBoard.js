import React, { Component } from 'react';
import TeamSelection from './teamSelection.js';
import { firebasedb } from './utils/config.js';
import SpyMasters from './SpyMasters.js';
import FieldOps from './FieldOps.js';
import {checkStart, checkData, checkEndGame} from './api/index.js';

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
      spym: false,
      redPoints: 0,
      bluePoints: 0,
      gameStatus: true
    }
  }
  componentDidMount () {
    const path = this.props.location.pathname.slice(1);
    const games = firebasedb.ref('/games/' + path +'/');
    games.on('value', (snapshot) => {
      const value = snapshot.val();
      this.setState(() => ({gameInfo: value, players: value.players, start: value.start, spym: value.spyMaster, turn: value.turn, redPoints: value.redPoints, bluePoints: value.bluePoints, gameStatus: value.gameStatus}));
    });
    const rounds = firebasedb.ref('/games/' + path +'/currentRound');
    rounds.on('value', (snapshot) => {
      checkEndGame(path);
    });
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
              {this.state.gameStatus === false
                ? <div>
                    <h3>Game Over</h3>
                    <div className='all-points'>
                      <span> Red Points: {this.state.redPoints} </span>
                      <span> Blue Points: {this.state.bluePoints} </span>
                    </div>
                  </div>
                : <div className='bottom'>
                    <div className='all-points'>
                      <span> Red Points: {this.state.redPoints} </span>
                      <span> Blue Points: {this.state.bluePoints} </span>
                    </div>
                    {Object.keys(this.state.players).map((player) => {
                      if(this.state.name === this.state.gameInfo.players[player] && player.slice(-1) === this.state.spym){
                        return <SpyMasters id={this.props.location.pathname.slice(1)} name={this.state.name} turn={this.state.turn} info={this.state.gameInfo.wordMap}/>
                      } else if (this.state.name === this.state.gameInfo.players[player]){
                        return <FieldOps id={this.props.location.pathname.slice(1)} name={this.state.name} turn={this.state.turn}/>
                      } else {
                        return null
                      }
                    })}
                  </div>
              }
            </div>
        }
      </div>
    );
  }
}

export default GameBoard;