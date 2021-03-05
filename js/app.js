class Board {
  constructor() {
    this.cells = [];
    this.pieces = [];

    this.generateCells = () => { for(let i = 0; i < 64; i++) this.cells.push(new Cell(i+1)); };

    this.generatePieces = () => {
      let func = (cellID, pieceType, colour) => {
        let piece = new Piece(cellID, pieceType, colour);
        let cell = BOARD.cells.filter(e=>e.cellID===cellID)[0];
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
        func(c?4:61, 'queen', colour);
        func(c?5:60, 'king', colour);
      }
      this.drawCellValues();
    };

    this.drawBoard = () => {
      for(let i = 0; i < BOARD.cells.length; i++)
        $('#board').append(`<div class="cell" cellID="${i+1}"></div>`);
    };

    this.drawCellValues = () => {
      for(let i = 0; i < BOARD.cells.length; i++)
        $(`#board .cell[cellID="${i+1}"]`).text(BOARD.cells[i].containsPiece ? BOARD.cells[i].piece.pieceType.substr(0,4) : i+1);
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

    this.drawPiece = () => {

    };
  }
}
