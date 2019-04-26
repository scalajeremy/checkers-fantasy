import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import Routes from './routes';
import logo from './logo.svg';
import './App.css';

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
