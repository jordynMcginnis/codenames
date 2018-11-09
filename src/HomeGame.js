import React, { Component } from 'react';

class Home extends Component {
  constructor(props){
    super(props);
    this.state = {
      players : 0
    }
  }
  componentDidMount () {
    const playersKey = this.props.playersKey;
    for (var key in playersKey){
      if(playersKey[key] !== false){
        this.setState((prevState) => ({players : prevState.players += 1}));
      }
    }
  }
  render() {
    return (
      <div className='game-box'>
        {this.props.title}
        <span className='total'>{this.state.players}/4 Players</span>
      </div>
    );
  }
}

export default Home;