import React, { Component } from 'react';
import './App.css';
import {SubmitName} from './api/index.js';

class TeamSelection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      render: 'name',
      name: false
    }
    this.submitName = this.submitName.bind(this);
    this.updateInput = this.updateInput.bind(this);
  }
  submitName () {
    SubmitName(this.state.name);
    this.state.render === 'name'
      ? this.setState(() => ({render: 'teams'}))
      : this.setState(() => ({render: 'name'}))
  }
  updateInput ({target}) {
   this.setState(() => ({name: target.value}))
  }
  render() {
    return (
      <div className="team-selection">
        {this.state.render === 'name'
          ? <div>
              <input className='t-input' placeholder='name' onChange={this.updateInput}/>
              <button onClick ={this.submitName}>Submit</button>
            </div>
          : <div>
                <div className='blue-team'> jordyn </div>
                <div className='red-team'> jordyn </div>
                <button className='switch'> SWITCH TEAMS</button>
            </div>
        }
      </div>
    );
  }
}

export default TeamSelection;