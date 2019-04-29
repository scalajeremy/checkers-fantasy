import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import button from './assets/button-nofond.png';
import logo from './assets/logo.png';

export default class Homepage extends Component {
  render() {
    return(
      <div className="main-view-home">
        <img src={logo} id="logo" alt="logo"/>
        <Link to="/play"><img src={button} id="button" alt="start"/></Link>
      </div>
    );
  }
}
