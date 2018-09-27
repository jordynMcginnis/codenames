import React, { Component } from 'react';
import CreateGame from './CreateGame.js';
import { Link } from 'react-router-dom';
import { firebasedb } from './utils/config.js';

class Home extends Component {
  constructor(props){
    super(props);
    this.state = {
      games: false
    }
  }
  componentDidMount () {
    let that = this;
    let games = firebasedb.ref('/games/');
    games.on('value', function (snapshot) {
      let games = snapshot.val();
      that.setState(() => ({games}));
    })
  }
  render() {
    return (
      <div className="app-intro">
        <CreateGame/>
        <div>Games:</div>
        {Object.keys(this.state.games).map((id) =>
          this.state.games[id].homeRender === true
            ? <Link to={`/${id}`} key={id}> {this.state.games[id]['name']} </Link>
            : null
        )}
      </div>
    );
  }
}

export default Home;