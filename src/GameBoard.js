import React, { Component } from 'react';
import './App.css';
import TeamSelection from './teamSelection.js';

class GameBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      teamSelection : false
    }
  }
  render() {
    return (
      <div className="game-board">
        <TeamSelection/>
      </div>
    );
  }
}

export default GameBoard;
