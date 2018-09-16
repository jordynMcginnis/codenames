import React, { Component } from 'react';
import { firebasedb } from './utils/config.js';
import CardField from './CardField.js';

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
       <h3>Field Operations</h3>
       <CardField data={this.state.words}/>
      </div>
    );
  }
}

export default FieldOps;
