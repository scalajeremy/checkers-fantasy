import React, { Component } from 'react';
import {Link} from 'react-router-dom';

export default class Homepage extends Component {
  render() {
    return (
      <div className="App">
        <div>Checkers Fantasy</div>
        <Link to="/play">Go to the main board</Link>
      </div>
    );
  }
}
