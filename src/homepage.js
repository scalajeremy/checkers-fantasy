import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import button from './assets/button-nofond.png';
import logo from './assets/logo.png';

export default class Homepage extends Component {
  render() {
    return(
      <div className="main-view-home">
          <div className="main-logo"><img src={logo} id="logo" alt="logo"/></div>
          <div className="main-button"><Link to="/play"><img src={button} id="button" alt="start"/></Link></div>
      </div>
    );
  }
}
