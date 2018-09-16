import React, { Component } from 'react';
import { firebasedb } from './utils/config.js';
import CardField from './CardField.js';
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
       <h3>Spy Master</h3>
       <CardField data={this.state.words}/>
      </div>
    );
  }
}

export default SpyMasters;