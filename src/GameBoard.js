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
      selectTeam: null,
      gameInfo: {},
      players: {},
      name: null,
      turn: null,
      spym: null,
      redPoints: 0,
      bluePoints: 0,
      gameStatus: null
    }
  }
  componentDidMount () {
    this.fetchGame();
  }
  fetchGame = () => {
    const path = this.props.location.pathname.slice(1);
    const games = firebasedb.ref('/games/' + path +'/');
    games.on('value', (snapshot) => {
      const value = snapshot.val();
      this.setState(() => ({gameInfo: value, players: value.players, selectTeam: value.start, spym: value.spyMaster, turn: value.turn, redPoints: value.redPoints, bluePoints: value.bluePoints, gameStatus: value.gameStatus}));
    });
    const rounds = firebasedb.ref('/games/' + path +'/currentRound');
    rounds.on('value', (snapshot) => {
      checkEndGame(path);
    });
  }
  startGame = (name) => {
    this.setState(() => ({name: name}));
    checkStart(this.props.location.pathname.slice(1));
    checkData(this.props.location.pathname.slice(1));
  }
  isSpyMaster = () => {
    const playersMap = this.state.players;
    for(var player in playersMap){
      let playersPosition = player.slice(-1);
      if(this.state.name === this.state.gameInfo.players[player] && playersPosition === this.state.spym.toString()){
        return true
      }
    }
    return false
  }
  isGameOver = () => {
    return this.state.gameStatus === false
  }
  choosingTeam = () => {
    return this.state.selectTeam === false
  }
  render() {
    return (
      <div className="game-board">
        {this.choosingTeam() === true
          ? <TeamSelection id={this.props.location.pathname.slice(1)} start={this.startGame}/>
          : <div className='bottom'>
              <div className='all-points'>
                <span> Red Points: {this.state.redPoints} </span>
                <span> Blue Points: {this.state.bluePoints} </span>
              </div>
              {this.isGameOver() === true
                ?  <h3>Game Over</h3>
                : <div>
                    {this.isSpyMaster() === true
                      ? <SpyMasters id={this.props.location.pathname.slice(1)} name={this.state.name} turn={this.state.turn} info={this.state.gameInfo.wordMap}/>
                      : <FieldOps id={this.props.location.pathname.slice(1)} name={this.state.name} turn={this.state.turn}/>
                    }
                  </div>
              }
            </div>
        }
      </div>
    );
  }
}

export default GameBoard;