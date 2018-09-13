import React, { Component } from 'react';
import {createGame} from './api/index.js';

class CreateGame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: false
    };
    this.handleName = this.handleName.bind(this);
    this.submitName = this.submitName.bind(this);
  }
  handleName ({target}) {
    this.setState(() => ({ name : target.value}))
  }
  submitName () {
    createGame(this.state.name)
    this.props.exitSubmit();
  }
  render () {
    return (
      <div>
        <input placeholder='game name' onChange={this.handleName}/>
        <button onClick={this.submitName}>Submit</button>
      </div>
    )
  }
}

export default CreateGame;





