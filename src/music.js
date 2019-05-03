import React, { Component } from 'react';
import Theme from './audio/music.mp3';

export default class Music extends Component {
  render() {
    return (
      <>
      <div className="audioplay-object">
        <div className="audioplay-button"></div>
        <audio className="audioplay-player" data-apautoplay="no autostart" data-apskin="classic" data-apskinspath="./audio/skins" data-apmode="playpause" data-apwidth="100px" data-apheight="100px"  >
          <source src={ Theme } />
        </audio>
      </div>
      </>
  )}
}
