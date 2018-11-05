import React, { Component } from 'react';

class Home extends Component {
  constructor(props){
    super(props);
    this.state = {
      players : 0
    }
  }
  componentDidMount () {
    let playersKey = this.props.playersKey
    for (var key in playersKey){
      if(playersKey[key] !== false){
        let newTotal = this.state.players +=1;
        this.setState(()=>({players : newTotal}));
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
