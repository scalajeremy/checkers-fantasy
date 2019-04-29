import React, { Component } from 'react';
import avatar_red from './assets/avatar_red.png';
import avatar_blue from './assets/avatar_blue.png';
// import GameLogic from './game_logic';

export default class Mainboard extends Component {

  constructor(){
    super();

    this.state = {
      board: {},
      selected: ''
    }
    console.log(this.state.board)
    const colNames = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    for(let row = 0; row < 8; row++){
      for(let col = 0; col < 8; col++){
        let id = colNames[col] + (row+1);
        this.state.board[id] = {
          color: (row+col)%2 ? 'light' : 'dark',
          id: colNames[col] + (row+1),
          content: ''
        };
      }
    }
  }

  componentDidMount(){
    const reds = ['A1', 'A3', 'B2', 'C1', 'C3', 'D2', 'E1', 'E3', 'F2', 'G1', 'G3', 'H2'];
    const blues = ['A7', 'B6', 'B8', 'C7', 'D6', 'D8', 'E7', 'F6', 'F8', 'G7', 'H6', 'H8'];
    reds.forEach(pos => this.changePiece(pos, <div className="red checker"></div>));
    blues.forEach(pos => this.changePiece(pos, <div className="blue checker"></div>));
  }

  changePiece(id, content){
    let newBoard = this.state.board;
    newBoard[id].content = content
    this.setState({board: newBoard});
  }

  handleClick(id){
    id.preventDefault();
     let choice = (id.currentTarget.id);
     if(this.state.board[choice].content === ''){
       this.handleEmpty(choice)
     }else if(this.state.board[choice].content !== ''){
       this.handleOccupied(choice)
     }
  }

  handleEmpty(choice){
    console.log(choice + ' est vide');
    if(this.state.selected){
      this.changePiece(choice, this.state.board[this.state.selected].content);
      this.changePiece(this.state.selected, '');
    }
  }

  handleOccupied(choice){
    console.log('y a quelqu\'un en ' + choice);
    this.setState({selected: choice});

  }


  render() {
    return (
      <div className="main-view">
        <div id="checker-board">
          {Object.keys(this.state.board).map(key => {
            let square = this.state.board[key];
            return (
            <div className={'square ' + square.color} id={square.id} key={square.id} onClick={this.handleClick.bind(this)}>
              {square.content}
            </div>
            
          )})}

         
         
        </div>

        <div className="hello">
            <img src={avatar_red} alt="avatar_red" className="first-pers" />
        </div>
        <div className="hello">
            <img src={avatar_blue} alt="avatar_blue" className="second-pers" />
        </div>
      </div>
    );
  }
}
