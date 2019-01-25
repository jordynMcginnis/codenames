import React, { Component } from 'react';
import  { GoOrganization, GoGistSecret, GoPerson, GoStar, GoPrimitiveDot, GoZap }  from "react-icons/go/index.js/";
class Instructions extends Component {
  render() {
    return (
      <div>
        <ul className='rules'>
          <li><GoOrganization className='icon'/>Join existing game below or create game above.You need at least four
            players to play. </li>
          <li><GoGistSecret className='icon'/>
            Spymasters know the secret identities of 25 agents. Their teammates know the agents only by their
            codenames.
          </li>
          <li><GoPerson className='icon'/>
          Spymasters take turns giving one-word clues. A clue may relate to multiple words on the table.
          </li>
          <li><GoStar className='icon'/> The field
operatives try to guess which words their spymaster meant. When a field operative chooses a word, the
game reveals its secret identity. </li>
          <li><GoPrimitiveDot className='icon'/>
           If the field operatives guess correctly, they may continue guessing,
until they run out of ideas for the given clue or until they hit a wrong person.
          </li>
          <li><GoZap className='icon'/>
          Then it is the other team's
turn to give a clue and guess.
           The first team to contact all their agents wins the game.
          </li>
        </ul>
      </div>
    );
  }
}

export default Instructions;