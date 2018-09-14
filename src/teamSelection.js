import React, { Component } from 'react';
import './App.css';
import {submitName, switchTeam} from './api/index.js';
import { firebasedb } from './utils/config.js';

class TeamSelection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      render: 'name',
      name: false,
      players: {}
    }
    this.submitName = this.submitName.bind(this);
    this.updateInput = this.updateInput.bind(this);
    this.switchTeams = this.switchTeams.bind(this);
  }
  componentDidMount () {
    let that = this;
    let games = firebasedb.ref('/games/' + this.props.id + '/players');
    games.on('value', function (snapshot) {
      let value = snapshot.val();
      that.setState(() => ({players: value}));
    })
  }
  submitName () {
    submitName(this.state.name, this.props.id);
    this.state.render === 'name'
      ? this.setState(() => ({render: 'teams'}))
      : this.setState(() => ({render: 'name'}))
  }
  updateInput ({target}) {
   this.setState(() => ({name: target.value}))
  }
  switchTeams () {
    switchTeam(this.props.id);
  }
  render() {
    return (
      <div className="team-selection">
        {this.state.render === 'name'
          ? <div>
              <input className='t-input' placeholder='name' onChange={this.updateInput}/>
              <button onClick ={this.submitName}>Submit</button>
            </div>
          : <div className='team-options'>
                {Object.keys(this.state.players).map((player) => {
                  if(player[0] === 'b'){
                    return <div className='blue-team' key={player} >{this.state.players[player]} </div>
                  } else {
                    return <div className='red-team' key={player}> {this.state.players[player]} </div>
                  }
                })}
                <button className='switch' onClick={this.switchTeams}> SWITCH TEAMS</button>
                <button className='switch' onClick={() => {this.props.start(this.state.name)}}> START</button>
            </div>
        }
      </div>
    );
  }
}

export default TeamSelection;