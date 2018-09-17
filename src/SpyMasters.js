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
       <h6>Spy Master</h6>
       <CardField data={this.state.words}/>
       <input placeholder='word'/>
       <ol>
         <li> </li>
         <li> </li>
         <li> </li>
         <li> </li>
       </ol>
       <button>Submit</button>
      </div>
    );
  }
}

export default SpyMasters;