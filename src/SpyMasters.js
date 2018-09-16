import React, { Component } from 'react';
import { firebasedb } from './utils/config.js';

class SpyMasters extends Component {
  constructor(props) {
    super(props);
    this.state = {
      words: {}
    };
  }
  componentDidMount () {
    let games = firebasedb.ref('/games/' + this.props.id + '/wordMap');
    games.on('value', (snapshot) => {
      let words = snapshot.val();
      this.setState(() => ({words}));
    })
  }
  render() {
    return (
      <div className="board">
       sppyyyyy masterrrr
      </div>
    );
  }
}

export default SpyMasters;