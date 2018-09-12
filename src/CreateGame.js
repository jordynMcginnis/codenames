import React, { Component } from 'react';
import {createGame} from './api/index.js';

class CreateGame extends Component {
  render () {
    return (
      <div>
        <input placeholder='game name'/>
      </div>
    )
  }
}

export default CreateGame;