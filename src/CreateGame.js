import React, { Component } from 'react';
import {createGame} from './api/index.js';

class CreateGame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: false
    };
  }
  handleName = ({target}) => {
    this.setState(() => ({name : target.value}));
  }
  submitName = () => {
    createGame(this.state.name);
  }
  render () {
    return (
      <div>
        <input className='enter-name' placeholder='Create Game' onChange={this.handleName}/>
        <button className='send-name' onClick={this.submitName}>Submit</button>
      </div>
    )
  }
}

export default CreateGame;