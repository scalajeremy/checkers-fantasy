import React, { Component } from 'react';

export default class GameLogic extends Component {

  constructor(){
    super();

    this.state = {
      board: {},
      selected: '',
      legalMove: [],
      colNames: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
    }
    const colNames = this.state.colNames;
    for(let row = 0; row < 8; row++){
      for(let col = 0; col < 8; col++){
        let id = colNames[col] + (row+1);
        this.state.board[id] = {
          color: (row+col)%2 ? 'light' : 'dark',
          id: colNames[col] + (row+1),
          content: '',
          pieceColor: ''
        };
      }
    }
  }

  componentDidMount(){
    const reds = ['A1', 'A3', 'B2', 'C1', 'C3', 'D2', 'E1', 'E3', 'F2', 'G1', 'G3', 'H2'];
    const blues = ['A7', 'B6', 'B8', 'C7', 'D6', 'D8', 'E7', 'F6', 'F8', 'G7', 'H6', 'H8'];
    reds.forEach(pos => this.changePiece(pos, <div className="red checker"></div>, 'red'));
    blues.forEach(pos => this.changePiece(pos, <div className="blue checker"></div>, 'blue'));
  }

  changePiece(id, content, color){
    let newBoard = this.state.board;
    newBoard[id].content = content
    newBoard[id].pieceColor = color;
    this.setState({board: newBoard});
  }

  handleClick(id){
    id.preventDefault();
     let choice = (id.currentTarget.id);
     if(this.state.board[choice].content === ''){
       this.handleEmpty(choice)
     }
     else if(this.state.board[choice].content !== ''){
       this.handleOccupied(choice)
     }
  }

  handleEmpty(choice){
    if(this.state.selected){
      if(this.state.legalMove.indexOf(choice) !== -1){
        let selected = this.state.board[this.state.selected];
        let pieceColor = selected.pieceColor;
        this.changePiece(choice, selected.content, pieceColor);
        this.changePiece(this.state.selected, '', '');
        this.setState({legalMove: []});
      }
      else{
        console.log('move pas legal')
      }
    }
  }

  async handleOccupied(choice){
    await this.setState({selected: choice});
    let availableMove = this.possibleMove();
    await this.setState({legalMove: availableMove})

  }

  possibleMove(){
    let selected = this.state.board[this.state.selected];
    let pieceColor = selected.pieceColor;
    let letter = this.state.selected.substring(0,1);
    let column = this.state.colNames.indexOf(letter) +1;
    let row = parseInt(this.state.selected.substring(1));
    let legalMove = [];
    console.log('column: ' + column + ' ' + 'row ' + row)
    // If in column A
    if(column === 1){
      column = this.state.colNames[column];
      if(pieceColor === 'red'){
        row = row + 1;
        let move = column + row

        if(this.state.board[move].content === ''){
          legalMove.push(move);
          return legalMove;
          }
      }
      else{
        if(pieceColor === 'blue'){
          row = row - 1;
          let move = column + row

          if(this.state.board[move].content === ''){
            legalMove.push(move);
            return legalMove;
          }
        }
      }
    }
    // If column H
    else if (column === 8) {
      column = this.state.colNames[column-2];
      if(pieceColor === 'red'){
        row = row +1;
        let move = column + row;

        if(this.state.board[move].content === ''){
          legalMove.push(move);
          return legalMove;
        }
      }
      else{
        if(pieceColor === 'blue'){
          row = row -1;
          let move = column + row;

          if(this.state.board[move].content === ''){
            legalMove.push(move);
            return legalMove;
          }
        }
      }
    }
    // Other column
    else {
      let columnLeft = this.state.colNames[column-2];
      let columnRight = this.state.colNames[column];
      if(pieceColor === 'red'){
        row = row +1;
        let moveLeft = columnLeft + row;
        let moveRight = columnRight + row;

        if(this.state.board[moveLeft].content === ''){
          legalMove.push(moveLeft);
        }
        if(this.state.board[moveRight].content === ''){
          legalMove.push(moveRight);
        }
        return legalMove;
      }
      else{
        if(pieceColor === 'blue'){
          row = row -1;
          let moveLeft = columnLeft + row;
          let moveRight = columnRight + row;

          if(this.state.board[moveLeft].content === ''){
            legalMove.push(moveLeft);
          }
          if(this.state.board[moveRight].content === ''){
            legalMove.push(moveRight);
          }
          return legalMove;
        }
      }
    }
  }

  render() {
    return
  }
}
