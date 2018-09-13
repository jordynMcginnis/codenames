import React, { Component } from 'react';
import './App.css';
import TeamSelection from './teamSelection.js';

class GameBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      teamSelection : false,
      start: false
    }
    this.startGame = this.startGame.bind(this);
  }
  startGame () {
    this.state.start === true ? this.setState(() => ({start: false})) : this.setState(() => ({start: true}));
  }
  render() {
    return (
      <div className="game-board">
      {this.state.start === false
        ? <TeamSelection id={this.props.location.pathname.slice(1)} start={this.startGame}/>
        : 'hi'
      }


      </div>
    );
  }
}

export default GameBoard;
