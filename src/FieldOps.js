import React, { Component } from 'react';
import { firebasedb } from './utils/config.js';

class FieldOps extends Component {
  constructor(props) {
    super(props);
    this.state = {
      words: {}
    };
  }
  componentDidMount () {
    let games = firebasedb.ref('/games/' + this.props.id + '/words');
    games.on('value', (snapshot) => {
      let words = snapshot.val();
      this.setState(() => ({words}));
    })
  }
  render() {
    return (
      <div className="board">
       field ops
      </div>
    );
  }
}

export default FieldOps;
