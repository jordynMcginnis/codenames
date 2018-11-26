import React, { Component } from 'react';
import CreateGame from './CreateGame.js';
import { Link } from 'react-router-dom';
import { firebasedb } from './utils/config.js';
import HomeGame from './HomeGame.js';

class Home extends Component {
  constructor(props){
    super(props);
    this.state = {
      games: false
    }
  }
  componentDidMount () {
    this.getGame();
  }
  getGame = () => {
    const gamesRef = firebasedb.ref('/games/');
    gamesRef.on('value', (snapshot) => {
      const games = snapshot.val();
      this.setState(() => ({games}));
    })
  }
  render() {
    return (
      <div className="app-intro">
        <CreateGame/>
        <div className='all-games'>
          {Object.keys(this.state.games).map((id) =>
            this.state.games[id].homeRender === true
              ? <Link to={`/${id}`} key={id} className='link'>  <HomeGame title={this.state.games[id]['name']} playersKey={this.state.games[id]['players']}/></Link>
              : null
          )}
        </div>
      </div>
    );
  }
}

export default Home;