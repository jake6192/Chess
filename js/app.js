class Board {
  constructor() {
    this.cells = [];
    this.pieces = [];

    this.generateCells = () => { for(let i = 0; i < 64; i++) this.cells.push(new Cell(i+1)); };

    this.generatePieces = () => {
      let func = (cellID, pieceType, colour) => {
        let cell = BOARD.cells.filter(e=>e.cellID===cellID)[0];
        let piece = new Piece(cell, pieceType, colour);
        cell.containsPiece = true;
        cell.piece = piece;
        BOARD.pieces.push(piece);
      };
      for(let c = 0; c < 2; c++) {
        let colour = c?'B':'W';
        for(let i = (c?9:49); i < (c?17:57); i++) func(i, 'pawn', colour);
        for(let i = 0; i < 2; i++) func((c&&i?8:(!c&&i?64:(c&&!i?1:57))), 'rook', colour);
        for(let i = 0; i < 2; i++) func((c&&i?7:(!c&&i?63:(c&&!i?2:58))), 'knight', colour);
        for(let i = 0; i < 2; i++) func((c&&i?6:(!c&&i?62:(c&&!i?3:59))), 'bishop', colour);
        func(c?4:60, 'queen', colour);
        func(c?5:61, 'king', colour);
      }
    };

    this.drawBoard = () => {
      for(let i = 0; i < BOARD.cells.length; i++)
        $('#board').append(`<div class="cell" cellID="${BOARD.cells[i].cellID}" ondrop="drop_handler(event, this)" ondragover="dragover_handler(event)"></div>`);
    };

    this.drawCellValues = () => {
      for(let i = 0; i < BOARD.cells.length; i++) {
        let cell = BOARD.cells[i];
        $(`#board .cell[cellID="${i+1}"]`).html('');
        if(cell.containsPiece) $(`#board .cell[cellID="${i+1}"]`).html(`<img draggable="true" ondragstart="dragstart_handler(event, this)" src="imgs/${cell.piece.pieceType}_${cell.piece.colour}.png" />`);
      }
    };
  }
}




class Cell {
  constructor(cellID) {
    this.cellID = cellID;
    this.containsPiece = false;
    this.piece;
    this.row = Math.floor((this.cellID+7)/8);
    for(let i = 0, a = [8,7,6,5,4,3,2,1]; i < 8; i++)
      if((this.cellID+i)%8 === 0) this.column = a[i];
    this.isEdge = (this.row===1||this.row===8||this.column===1||this.column===8);
  }
}




class Piece {
  constructor(startingCell, pieceType, colour) {
    this.startingCell = startingCell;
    this.currentCell = startingCell;
    this.colour = colour;
    this.pieceType = pieceType;
    this.validMoves;

    this.movePiece = (newCell) => {
      let oldCell = BOARD.cells[this.currentCell.cellID-1];
      this.currentCell = newCell;
      this.currentCell.piece = oldCell.piece;
      this.currentCell.containsPiece = true;
      oldCell.piece = undefined;
      oldCell.containsPiece = false;
      BOARD.drawCellValues();
    };

    this.updateValidMovesList = () => {
      let arr;
      let _C = this.colour==='W'?0:1;
      let r = this.currentCell.row, c = this.currentCell.column;
      switch(this.pieceType) {
        case 'pawn': this.validMoves = BOARD.cells.filter(e => (
            e.containsPiece && // If there is a piece to take. //
            e.row === r-(_C?-1:1) &&
            (e.column === c-1 || e.column === c+1) // Check that this capture is valid for this pawn. //
          ) || (
            !e.containsPiece && // If the target cell is empty. //
            e.column === c && (
              (this.startingCell === this.currentCell) ? // Check if pawn is allowed to move 1 or 2 cells. //
                (e.row === r-(_C?-1:1) || e.row === r-(_C?-2:2)) : e.row === r-(_C?-1:1)
            )
          )); break;
        case 'rook': this.validMoves = BOARD.cells.filter(e => (e !== this.currentCell) && (e.row === r || e.column === c)); break;
        case 'knight': this.validMoves = BOARD.cells.filter(e =>
          (e !== this.currentCell) && (
            (e.row === r-2 && e.column === c-1) || (e.row === r-2 && e.column === c+1) || (e.row === r+2 && e.column === c-1) || (e.row === r+2 && e.column === c+1) ||
            (e.row === r-1 && e.column === c-2) || (e.row === r-1 && e.column === c+2) || (e.row === r+1 && e.column === c-2) || (e.row === r+1 && e.column === c+2)
          )); break;
        case 'bishop': // Bishop uses same diagonal method as queen (below). //
        case 'queen': arr = [];
          if(this.pieceType === 'queen') arr = BOARD.cells.filter(e => (e !== this.currentCell) && (e.row === r || e.column === c));
          for(let a = 0; a < 4; a++) switch(a) {
            case 0: loop0: for(let b = 1; b < c;      b++) { arr.push(BOARD.cells[(this.currentCell.cellID-(9*b))-1]); if(BOARD.cells[(this.currentCell.cellID-(9*b))-1].containsPiece) break loop0; } break;
            case 1: loop1: for(let b = 1; b <= (8-c); b++) { arr.push(BOARD.cells[(this.currentCell.cellID-(7*b))-1]); if(BOARD.cells[(this.currentCell.cellID-(9*b))-1].containsPiece) break loop1; } break;
            case 2: loop2: for(let b = 1; b < c;      b++) { arr.push(BOARD.cells[(this.currentCell.cellID+(7*b))-1]); if(BOARD.cells[(this.currentCell.cellID-(9*b))-1].containsPiece) break loop2; } break;
            case 3: loop3: for(let b = 1; b <= (8-c); b++) { arr.push(BOARD.cells[(this.currentCell.cellID+(9*b))-1]); if(BOARD.cells[(this.currentCell.cellID-(9*b))-1].containsPiece) break loop3; } break;
          } this.validMoves = arr.filter(e => e !== this.currentCell); break;
        case 'king': this.validMoves = BOARD.cells.filter(e =>
          (e !== this.currentCell) && (
            (e.row === r-1 && e.column === c-1) || (e.row === r-1 && e.column === c) || (e.row === r-1 && e.column === c+1) || (e.row === r && e.column === c+1) ||
            (e.row === r+1 && e.column === c+1) || (e.row === r+1 && e.column === c) || (e.row === r+1 && e.column === c-1) || (e.row === r && e.column === c-1)
          )); break;
        default: this.validMoves = BOARD.cells.filter(e=>e!=this.currentCell); break;
      }
    };
    this.showValidMoves = () => { $($('.cell').toArray().filter(e => this.validMoves.indexOf(BOARD.cells[(+$(e).attr('cellID'))-1]) !== -1)).addClass('highlight'); };
  }
}
