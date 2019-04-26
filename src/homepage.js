import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import button from './assets/button-nofond.png';

export default class Homepage extends Component {
  render() {
    return (
      <div className="main-view">
        <div>Checkers Fantasy</div>

        <div id="button">
          <Link to="/play"><img src={button} alt=""/></Link>
        </div>
      </div>


    );
  }
}
