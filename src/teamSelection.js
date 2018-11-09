import React, { Component } from 'react';
import {submitName, selectRounds} from './api/index.js';
import { firebasedb } from './utils/config.js';

class TeamSelection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      render: 'name',
      name: false,
      players: {},
      round: 2,
      count: 0,
      red: true,
      blue: true
    }
  }
  componentDidMount () {
    const games = firebasedb.ref('/games/' + this.props.id + '/players');
    games.on('value', (snapshot) => {
      const value = snapshot.val();
      this.setState(() => ({players: value}));
      for(var key in this.state.players){
        if(this.state.players[key] !== false){
          this.setState((prevState)=>({count : prevState.count += 1}));
        }
      }
    });
    let rounds = firebasedb.ref('/games/' + this.props.id + '/rounds');
    rounds.on('value', (snapshot) => {
      let value = snapshot.val();
      this.setState(() => ({round: value}));
    });
  }
  submit = (team) => {
    if(this.state.name !== false){
      submitName(this.state.name, this.props.id, team).then((teamFilled)=>{
        if(teamFilled === true) {
          this.setState(()=>({[team] : false}))
        } else {
          this.props.start(this.state.name);
          this.state.render === 'name'
            ? this.setState(() => ({render: 'teams'}))
            : this.setState(() => ({render: 'name'}))
        }
      })
    }
  }
  updateInput = ({target}) => {
    this.setState(() => ({name: target.value}));
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
                  return <div className='blue-team' key={player}>{this.state.players[player]}</div>
                }
                return null;
              })}
            </span>
            vs
            <span>
              {Object.keys(this.state.players).map((player) => {
                if(player[0] === 'r'){
                  return <div className='red-team' key={player}>{this.state.players[player]}</div>
                }
                return null;
              })}
            </span>
          </div>
          {this.state.render === 'name'
            ? <div className='enter-info'>
                <input className='t-input' placeholder='name' onChange={this.updateInput}/>
                SELECT TEAM:
                <span>
                  {this.state.red === true
                    ? <button className='switchr' onClick ={()=>{this.submit('red')}}>Red</button>
                    : <button className='full'>Red Team Full</button>
                  }
                  {this.state.blue === true
                    ? <button className='switch' onClick ={()=>{this.submit('blue')}}>Blue</button>
                    : <button className='full'>Blue Team Full</button>
                  }
                </span>
              </div>
            : null
          }
          <h2>Rounds Selected : {this.state.round}</h2>
          <div className="dropdown">
            <button className="dropbtn">Change Rounds</button>
            <div className="dropdown-content">
              <div onClick={()=>{this.switchRounds(2)}}>2</div>
              <div onClick={()=>{this.switchRounds(4)}}>4</div>
              <div onClick={()=>{this.switchRounds(6)}}>6</div>
            </div>
          </div>
          {this.state.count >= 3
            ? <button className='switch' onClick={() => {this.props.start(this.state.name)}}>START</button>
            : <div>Waiting for more players to join...</div>
          }
        </div>
      </div>
    );
  }
}

export default TeamSelection;