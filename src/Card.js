import React, { Component } from 'react';


class Card extends Component {
  render() {
    return (
      <div className={this.props.class1}>
        {this.props.value}
      </div>
    );
  }
}

export default Card;
