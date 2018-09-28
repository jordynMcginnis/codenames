import React, { Component } from 'react';
import {submitName, switchTeam, selectRounds} from './api/index.js';
import { firebasedb } from './utils/config.js';

class TeamSelection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      render: 'name',
      name: false,
      players: {},
      round: 2
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
    let rounds = firebasedb.ref('/games/' + this.props.id + '/rounds');
    rounds.on('value', function (snapshot) {
      let value = snapshot.val();
      that.setState(() => ({round: value}));
    })
  }
  submitName () {
    submitName(this.state.name, this.props.id);
    this.props.start(this.state.name);
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
  switchRounds = (round) => {
    this.setState(()=>({round}));
    selectRounds(this.props.id, round);
  }
  render() {
    return (
      <div className="team-selection">

        <div className='team-options'>
          <div className='all-teams'>
            <span>
              {Object.keys(this.state.players).map((player) => {
                if(player[0] === 'b'){
                  return <div className='blue-team' key={player} >{this.state.players[player]} </div>
                }
              })}
            </span>
            vs
            <span>
              {Object.keys(this.state.players).map((player) => {
                if(player[0] === 'r'){
                  return <div className='red-team' key={player}> {this.state.players[player]} </div>
                }
              })}
            </span>
          </div>
          {this.state.render === 'name'
            ? <div>
                <input className='t-input' placeholder='name' onChange={this.updateInput}/>
                <button onClick ={this.submitName}>Submit</button>
              </div>
            : null
          }
          <span>
            <button className='switch' >Blue</button>
            <button className='switch' >Red</button>
          </span>
          <h2> Rounds : {this.state.round}</h2>
          <div class="dropdown">
            <button class="dropbtn">Change Rounds</button>
            <div class="dropdown-content">
              <div onClick={()=>{this.switchRounds(2)}}>2</div>
              <div onClick={()=>{this.switchRounds(4)}}>4</div>
              <div onClick={()=>{this.switchRounds(6)}}>6</div>
            </div>
          </div>
          <button className='switch' onClick={() => {this.props.start(this.state.name)}}> START</button>
        </div>
      </div>
    );
  }
}

export default TeamSelection;