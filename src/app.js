import React, { Component } from 'react';
import Routes from './routes';
import io from 'socket.io-client';

export default class App extends Component {
  constructor(){
    super();
    this.state = {
      socket: io.connect('http://localhost:3001')
    }
  }

  buttonPressed(){
    this.state.socket.emit('Press button', "some data or object");
  }

  render(){
    return (
      <div className="App">
        <Routes />
      </div>
    );
  }
}
