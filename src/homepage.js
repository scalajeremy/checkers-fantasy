import React, { Component } from 'react';
import {Link} from 'react-router-dom';

export default class Homepage extends Component {
  render() {
    return (
      <div className="main-view">
        <div>Checkers Fantasy</div>
        <Link to="/play">Go to the main board</Link>

        <div id="button">
        <button type="button"></button>
        </div>
      </div>


    );
  }
}
