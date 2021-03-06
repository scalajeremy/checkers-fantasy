import React, { Component } from 'react';
import avatar_red from './assets/avatar_red.png';
import avatar_blue from './assets/avatar_blue.png';
import growl01 from './audio/growl01.mp3';
import growl02 from './audio/growl02.mp3';
import power_fire1 from './assets/power_fire1.png';
import power_fire2 from './assets/power_fire2.png';
import power_fire3 from './assets/power_fire3.png';
import power_ice1 from './assets/power_ice1.png';
import power_ice2 from './assets/power_ice2.png';
import power_ice3 from './assets/power_ice3.png';

import ReactTooltip from 'react-tooltip';
import io from 'socket.io-client';

export default class Mainboard extends Component {

  constructor(){
    super();

    this.state = {
      board: {},
      selected: '',
      legalMove: [],
      mandatory: [],
      colNames: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
      socket: io.connect('http://localhost:3001'),
      player_red_life : 12,
      player_red_score : 0,
      player_blue_life : 12,
      player_blue_score : 0
    }
    const colNames = this.state.colNames;
    for(let row = 0; row < 8; row++){
      for(let col = 0; col < 8; col++){
        let id = colNames[col] + (row+1);
        this.state.board[id] = {
          color: (row+col)%2 ? 'light' : 'dark',
          id: colNames[col] + (row+1),
          content: '',
          pieceColor: '',
          highlighted: false,
          queen: false
        };
      }
    }
  }

  componentDidMount(){
    const reds = ['A1', 'A3', 'B2', 'C1', 'C3', 'D2', 'E1', 'E3', 'F2', 'G1', 'G3', 'H2'];
    const blues = ['A7', 'B6', 'B8', 'C7', 'D6', 'D8', 'E7', 'F6', 'F8', 'G7', 'H6', 'H8'];
    reds.forEach(pos => this.changePiece(pos, <div className="red checker"></div>, 'red', false));
    blues.forEach(pos => this.changePiece(pos, <div className="blue checker"></div>, 'blue', false));
  }

  playAudio(color) {
    if (color === 'red') {
      let growl = document.getElementById("audio_growl01");
      growl.play();
    } else {
      let growl = document.getElementById("audio_growl02");
      growl.play();
    }
  }

  changePiece(id, content, color, isQueen){
    let newBoard = this.state.board;
    newBoard[id].content = content
    newBoard[id].pieceColor = color;
    newBoard[id].queen = isQueen;
    this.setState({board: newBoard});
  }

  handleClick(event){
    event.preventDefault();
     let choice = (event.currentTarget.id);
     if(this.state.board[choice].content === ''){
       this.handleEmpty(choice)
     }
     else {
       this.handleOccupied(choice);
       this.playAudio(this.state.board[choice].pieceColor);
     }
  }

  handleEmpty(choice){

    if(this.state.selected){
      if((this.state.mandatory.length !== 0) && (this.state.mandatory.indexOf(this.state.selected + choice ) === -1)) {
        console.log("u have to capture smthg u fool")
        return;
      }
      let index = this.state.legalMove.indexOf(choice)
      if(index !== -1){
        this.state.socket.emit('move', this.state.selected + choice);
        // let moveAnim = '';
        // if(this.state.colNames.indexOf(this.state.selected.substring(0, 1)) < this.state.colNames.indexOf(choice.substring(0, 1))) {
        //   if(this.state.selected.substring(1, 2) < choice.substring(1, 2))
        //     moveAnim = ' moveLowerRight';
        //   else {
        //     moveAnim = ' moveUpperRight';
        //   }
        // } else {
        //   if(this.state.selected.substring(1, 2) < choice.substring(1, 2))
        //     moveAnim = ' moveLowerLeft';
        //   else {
        //     moveAnim = ' moveUpperLeft';
        //   }
        // }
        let newBoard = {...this.state.board};
        this.state.legalMove.forEach(element => {newBoard[element].highlighted = false});
        this.setState({board: newBoard});
        let selected = this.state.board[this.state.selected];
        let pieceColor = selected.pieceColor;

        let row_origin = parseInt(this.state.selected.substring(1));
        let row_destination = parseInt(choice.substring(1));

        if(row_destination === 8 && pieceColor === 'red'){
          this.changePiece(choice, <div className="red-queen checker"></div>, pieceColor, true)

        }

        else if(row_destination === 1 && pieceColor === 'blue'){
          this.changePiece(choice, <div className="blue-queen checker"></div>, pieceColor, true)

        }

        else {
          this.changePiece(choice, selected.content, pieceColor, selected.queen);
        }
        //Capture
        if (Math.abs(row_origin - row_destination) > 1) {
          let column_origin = this.state.colNames.indexOf(this.state.selected.substring(0, 1));
          let column_destination = this.state.colNames.indexOf(choice.substring(0, 1));
          let piece_captured = this.state.board[(this.state.colNames[(column_origin + column_destination) / 2] + ((row_origin + row_destination) / 2))].pieceColor;
          this.playerStats(piece_captured);
          this.changePiece((this.state.colNames[(column_origin + column_destination) / 2] + ((row_origin + row_destination) / 2)) , '', '', false);
        }
        this.changePiece(this.state.selected, '', '', false);
        this.setState({legalMove: []});
        this.setState({mandatory: []});
      }
      else
        console.log('move pas legal')
    }
  }

  activePower(){

  }

  handlePower(cost, color){
    console.log(cost, color, this.state.player_blue_score);
    if(color === "blue" && this.state.player_blue_score >= cost){
      this.setState((preState)=>{return {player_blue_score : preState.player_blue_score - cost}});
    }
    if(color === "red" && this.state.player_red_score >= cost){
      this.setState((preState)=>{return {player_red_score : preState.player_red_score - cost}});
    }
  }

  playerStats(piece_captured){
    if(piece_captured === 'red'){
      this.setState((preState)=> {return {player_red_life : preState.player_red_life - 1}});
      this.setState((preState)=> {return {player_blue_score : preState.player_blue_score + 1}});
    }
    else{
      this.setState((preState)=> {return {player_blue_life : preState.player_blue_life - 1}});
      this.setState((preState)=> {return {player_red_score : preState.player_red_score + 1}});
     }
  }


  async handleOccupied(choice){
     await this.setState({selected: choice});
     for(let square in this.state.board){
       if(this.state.board[square].pieceColor === this.state.board[choice].pieceColor)
         this.mandatoryMove(this.state.board[square]);

     }
     let legalMove = this.possibleMove();
     this.setState({legalMove: legalMove});
     let newBoard = {...this.state.board};
     for(let square in newBoard){
       newBoard[square].highlighted = legalMove.includes(square);
     }
     this.setState({board: newBoard});
   }

   mandatoryMove(cell) {
       let letter = cell.id.substring(0,1);
       let column = this.state.colNames.indexOf(letter) + 1;
       let row = parseInt(cell.id.substring(1));
       let pieceColor = cell.pieceColor;

       let moveUpperLeft = this.state.board[this.state.colNames[column - 2] + (row - 1)];
       let moveUpperRight = this.state.board[this.state.colNames[column] + (row - 1)];
       let moveLowerLeft = this.state.board[this.state.colNames[column - 2] + (row + 1)];
       let moveLowerRight = this.state.board[this.state.colNames[column] + (row + 1)];

       if ((pieceColor === 'red' || cell.queen) && (column - 3 >= 0) && (row < 7) && ((moveLowerLeft.pieceColor !== pieceColor) && moveLowerLeft.content !== '') &&  (this.state.board[(this.state.colNames[column - 3] + (row + 2))].content === '')) {

         if(this.state.mandatory.indexOf(cell.id + this.state.colNames[column - 3] + (row + 2)) === -1) {
           let newMandatory = this.state.mandatory;
           newMandatory.push(cell.id + this.state.colNames[column - 3] + (row + 2))
           this.setState({mandatory: newMandatory});
         }
       }

       if ((pieceColor === 'red' || cell.queen) && (column < 7) && (row < 7) && ((moveLowerRight.pieceColor !== pieceColor) && moveLowerRight.content !== '') &&  (this.state.board[(this.state.colNames[column + 1] + (row + 2))].content === '')) {

         if(this.state.mandatory.indexOf(cell.id + this.state.colNames[column + 1] + (row + 2)) === -1) {
           let newMandatory = this.state.mandatory;
           newMandatory.push(cell.id + this.state.colNames[column + 1] + (row + 2))
           this.setState({mandatory: newMandatory});
         }
       }

       if ((pieceColor === 'blue' || cell.queen) && (column - 3 >= 0) && (row > 2) && ((moveUpperLeft.pieceColor !== pieceColor) && moveUpperLeft.content !== '') &&  (this.state.board[(this.state.colNames[column - 3] + (row - 2))].content === '')) {

         if(this.state.mandatory.indexOf(cell.id + this.state.colNames[column - 3] + (row - 2)) === -1) {
           let newMandatory = this.state.mandatory;
           newMandatory.push(cell.id + this.state.colNames[column - 3] + (row - 2))
           this.setState({mandatory: newMandatory});
         }
       }

       if ((pieceColor === 'blue' || cell.queen) && (column < 7) && (row > 2) && ((moveUpperRight.pieceColor !== pieceColor) && moveUpperRight.content !== '') &&  (this.state.board[(this.state.colNames[column + 1] + (row - 2))].content === '')) {

         if(this.state.mandatory.indexOf(cell.id + this.state.colNames[column + 1] + (row - 2)) === -1) {
           let newMandatory = this.state.mandatory;
           newMandatory.push(cell.id + this.state.colNames[column + 1] + (row - 2))
           this.setState({mandatory: newMandatory});
         }
       }
     }

  possibleMove(){
    let selected = this.state.board[this.state.selected];
    let pieceColor = selected.pieceColor;
    let letter = this.state.selected.substring(0,1);
    let column = this.state.colNames.indexOf(letter) + 1;
    let row = parseInt(this.state.selected.substring(1));
    let legalMove = [];

    let moveUpperLeft = this.state.colNames[column - 2] + (row - 1);
    let moveUpperRight = this.state.colNames[column] + (row - 1);
    let moveLowerLeft = this.state.colNames[column - 2] + (row + 1);
    let moveLowerRight = this.state.colNames[column] + (row + 1);

    if(((column - 2 >= 0) && (row < 8) && (this.state.board[moveLowerLeft].content === '' ) && (pieceColor === 'red' || selected.queen)) || ((pieceColor === 'red' || selected.queen) && (column - 3 >= 0) && (row < 7) && (this.state.board[moveLowerLeft].pieceColor !== pieceColor) &&   (this.state.board[(this.state.colNames[column - 3] + (row + 2))].content === ''))){
      if(this.state.board[moveLowerLeft].content === '')
        legalMove.push(moveLowerLeft);

      else
        legalMove.push((this.state.colNames[column - 3] + (row + 2)));
    }

    if(((column < 8) && (row < 8) && (this.state.board[moveLowerRight].content === '') && (pieceColor === 'red' || selected.queen)) || ((pieceColor === 'red' || selected.queen) && (column < 7) && (row < 7) && (this.state.board[moveLowerRight].pieceColor !== pieceColor) && (this.state.board[(this.state.colNames[column + 1] + (row + 2))].content === ''))){
      if(this.state.board[moveLowerRight].content === '')
        legalMove.push(moveLowerRight);

      else
        legalMove.push((this.state.colNames[column + 1] + (row + 2)));
    }

    if(((column - 2 >= 0) && (row >= 2) && (this.state.board[moveUpperLeft].content === '') && (pieceColor === 'blue' || selected.queen)) || ((pieceColor === 'blue' || selected.queen) && (column - 3 >= 0) && (row > 2) && (this.state.board[moveUpperLeft].pieceColor !== pieceColor) && (this.state.board[(this.state.colNames[column - 3] + (row - 2))].content === ''))){
      if(this.state.board[moveUpperLeft].content === '')
        legalMove.push(moveUpperLeft);

      else
        legalMove.push((this.state.colNames[column - 3] + (row - 2)));
    }

    if(((column < 8) && (row >= 2) && (this.state.board[moveUpperRight].content === '') && (pieceColor === 'blue' || selected.queen)) || ((pieceColor === 'blue' || selected.queen) && (column < 7) && (row > 2) && (this.state.board[moveUpperRight].pieceColor !== pieceColor) && (this.state.board[(this.state.colNames[column + 1] + (row - 2))].content === ''))){
      if(this.state.board[moveUpperRight].content === '')
        legalMove.push(moveUpperRight);

      else
        legalMove.push((this.state.colNames[column + 1] + (row - 2)));
    }
    return legalMove;
  }


  render() {
    let power_ice1cn = '';
    let power_ice2cn = '';
    let power_ice3cn = '';
    let power_fire1cn = '';
    let power_fire2cn = '';
    let power_fire3cn = '';


    if(this.state.player_blue_score < 2){
      power_ice1cn = '';
      power_ice2cn = '';
      power_ice3cn = '';
    }
    if(this.state.player_blue_score >= 2){
      power_ice1cn = 'active';
    }
    if(this.state.player_blue_score >= 4){
      power_ice2cn = 'active';
    }
    if(this.state.player_blue_score >= 6){
      power_ice3cn = 'active';
    }

    if(this.state.player_red_score < 2){
      power_fire1cn = '';
      power_fire2cn = '';
      power_fire3cn = '';
    }
    if(this.state.player_red_score >= 2){
      power_fire1cn = 'active';
    }
    if(this.state.player_red_score >= 4){
      power_fire2cn = 'active';
    }
    if(this.state.player_red_score >= 6){
      power_fire3cn = 'active';
    }

    return (
      <>

      <ReactTooltip />

      <audio id="audio_growl01">
        <source src={growl01} type="audio/mpeg"/>
      </audio>
      <audio id="audio_growl02">
        <source src={growl02} type="audio/mpeg"/>
      </audio>

      <div className="container-fluid">
        <div className="row">
          <div className="col align-self-start ui" id="red">
            <div className="pics mb-3">
              <div className="star red-shadow">{this.state.player_red_score}</div>
              <div className="heart red-shadow">{this.state.player_red_life}</div>
              <img src={avatar_red} alt="avatar_red" className="avatar" />
            </div>
            <div className="powers">
              <div data-tip="Kill one ennemy unit and skip your next turn." className={"power-border " + power_fire1cn} onClick={() => this.handlePower.bind(this)(2, "red")}><img src={power_fire1} className={"power m-auto " + power_fire1cn} alt="power_fire1"/><div className="star-power sp-red">2</div></div>
              <div data-tip="Kill 2 ennemy units, don't gain stars and skip your next turn." className={"power-border " + power_fire2cn} onClick={() => this.handlePower.bind(this)(4, "red")}><img src={power_fire2} className={"power m-auto " + power_fire2cn} alt="power_fire2"/><div className="star-power sp-red">4</div></div>
              <div data-tip="Kill all units in one row." className={"power-border " + power_fire3cn} onClick={() => this.handlePower.bind(this)(6, "red")}><img src={power_fire3} className={"power m-auto " + power_fire3cn} alt="power_fire3"/><div className="star-power sp-red">6</div></div>
            </div>
          </div>
          <div className="col align-self-center mainboard">
          <div id="checker-board">
            {Object.keys(this.state.board).map(key => {
              let square = this.state.board[key];
              return (
                <div className={`square ${square.color}${square.highlighted ? ' highlighted' : ''}`} id={square.id} key={square.id} onClick={this.handleClick.bind(this)}>{square.content}
              </div>
            )}
          )}
          </div>
          </div>
          <div className="col align-self-end ml-3">
            <div className="powers">
              <div data-tip="Regenerate a friendly unit and skip your next turn" className={"power-border "+ power_ice1cn} onClick={() => this.handlePower.bind(this)(2, "blue")}><img src={power_ice1} className={"power m-auto " + power_ice1cn} alt="power_ice1"/><div className="star-power sp-blue">2</div></div>
              <div data-tip="Freeze a ennemy unit, it cannot move at its next turn." className={"power-border " + power_ice2cn} onClick={() => this.handlePower.bind(this)(4, "blue")}><img src={power_ice2} className={"power m-auto " + power_ice2cn} alt="power_ice2"/><div className="star-power sp-blue">4</div></div>
              <div data-tip="Freeze two ennemy units, they cannot move at theirs next turn. You skip your next turn" className={"power-border " + power_ice3cn} onClick={() => this.handlePower.bind(this)(6, "blue")}><img src={power_ice3} className={"power m-auto " + power_ice3cn} alt="power_ice3"/><div className="star-power sp-blue">6</div></div>
            </div>
            <div className="pics mt-3">
              <img src={avatar_blue} alt="avatar_blue" className="avatar" />
              <div className="heart blue-shadow">{this.state.player_blue_life}</div>
              <div className="star blue-shadow">{this.state.player_blue_score}</div>
            </div>
          </div>
        </div>
      </div>

    </>
    );
  }
}
