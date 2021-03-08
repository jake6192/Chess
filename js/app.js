class Board {
  constructor() {
    this.cells = [];
    this.pieces = [];
    this.whiteIsToMoveNext = true;

    this.generateCells = () => { for(let i = 0; i < 64; i++) this.cells.push(new Cell(i+1)); };

    this.generatePieces = () => {
      let func = (cellID, pieceType, colour) => {
        let cell = BOARD.cells.filter(e=>e.cellID===cellID)[0];
        let piece = new Piece(cell, null, pieceType, colour);
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

    this.kingIsInCheck = (colour) => {
      let cellsToCheck = this.cells.filter(e => e.containsPiece && e.piece.colour === (colour==='W'?'B':'W'));
      for(let i = 0; i < cellsToCheck.length; i++) {
        let validMoves = cellsToCheck[i].piece.updateValidMovesList(true, this);
        if(validMoves != [] && validMoves.filter(e => e.containsPiece && e.piece.colour === colour && e.piece.pieceType === 'king').length > 0)
          return true;
      } return false;
    };

    this.projectMove = (pieceToMove, cellToMoveTo) => {
      let futureBOARD = new Board();
      for(let i = 0; i < 64; i++) {
        let oldCell = BOARD.cells[i];
        let newCell = new Cell(oldCell.cellID, oldCell.containsPiece, oldCell.row, oldCell.column);
        if(oldCell.containsPiece) {
          let oldPiece = oldCell.piece;
          let newPiece = new Piece(oldPiece.startingCell.cellID, newCell, oldPiece.pieceType, oldPiece.colour);
          if(oldPiece.validMoves) {
            newPiece.validMoves = [];
            for(let j = 0; j < oldPiece.validMoves.length; j++)
              newPiece.validMoves.push(futureBOARD.cells[oldPiece.validMoves[j].cellID-1]);
          }
          newCell.piece = newPiece;
          futureBOARD.pieces.push(newPiece);
        }
        futureBOARD.cells.push(newCell);
      }
      futureBOARD.pieces.map(e => e.startingCell = futureBOARD.cells[e.startingCell-1]);
      let futurePiece = futureBOARD.cells[pieceToMove.currentCell.cellID-1].piece;
      let futureCell = futureBOARD.cells[cellToMoveTo.cellID-1];
      futurePiece.movePiece(futureBOARD, futureCell, true);
      return futureBOARD;
    };
  }
}




class Cell {
  constructor(cellID, containsPiece, row, column) {
    this.cellID = cellID;
    this.containsPiece = containsPiece ?? false;
    this.piece;
    this.row = row ?? Math.floor((this.cellID+7)/8);
    if(column) this.column = column;
    for(let i = 0, a = [8,7,6,5,4,3,2,1]; i < 8; i++)
      if((this.cellID+i)%8 === 0) this.column = a[i];
    this.isEdge = (this.row===1||this.row===8||this.column===1||this.column===8);
  }
}




class Piece {
  constructor(startingCell, currentCell, pieceType, colour) {
    this.startingCell = startingCell;
    this.currentCell = currentCell ?? startingCell;
    this.pieceType = pieceType;
    this.colour = colour;
    this.validMoves;

    this.movePiece = (_BOARD_, newCell, isProjection) => {
      let oldCell = _BOARD_.cells[this.currentCell.cellID-1];
      this.currentCell = newCell;
      this.currentCell.piece = oldCell.piece;
      this.currentCell.containsPiece = true;
      oldCell.piece = undefined;
      oldCell.containsPiece = false;
      _BOARD_.whiteIsToMoveNext = !BOARD.whiteIsToMoveNext;
      if(!isProjection) {
        _BOARD_.drawCellValues();
        refreshHighlightEventListener();
      }
    };

    this.updateValidMovesList = (isProjection, _BOARD_) => {
      _BOARD_ = _BOARD_ ?? BOARD;
      let arr, currentCell = this.currentCell;
      let _C = this.colour==='W'?0:1;
      let r = currentCell.row, c = currentCell.column;
      switch(this.pieceType) {
        case 'pawn': arr = [];
          if(_BOARD_.cells[currentCell.cellID-(_C?-7:7)-1].containsPiece && _BOARD_.cells[currentCell.cellID-(_C?-7:7)-1].piece.colour != this.colour) arr.push(_BOARD_.cells[currentCell.cellID-(_C?-7:7)-1]);
          if(_BOARD_.cells[currentCell.cellID-(_C?-9:9)-1].containsPiece && _BOARD_.cells[currentCell.cellID-(_C?-9:9)-1].piece.colour != this.colour) arr.push(_BOARD_.cells[currentCell.cellID-(_C?-9:9)-1]);
          if(!_BOARD_.cells[currentCell.cellID-(_C?-8:8)-1].containsPiece) {
            arr.push(_BOARD_.cells[currentCell.cellID-(_C?-8:8)-1]);
            if(this.currentCell === this.startingCell && !_BOARD_.cells[currentCell.cellID-(_C?-16:16)-1].containsPiece)
              arr.push(_BOARD_.cells[currentCell.cellID-(_C?-16:16)-1]);
          } this.validMoves = arr; break;
        case 'rook': arr = [];
          for(let a = 0; a < 4; a++) switch(a) {
            case 0: loop0: for(let b = 1; b < c; b++) { try { let cell = _BOARD_.cells[(currentCell.cellID-b)-1]; arr.push(cell); if(cell.containsPiece) { if(cell.piece.colour === this.colour) arr.pop(); break loop0; } } catch(e) {;} } break;
            case 1: loop1: for(let b = 1; b <= (8-c); b++) { try { let cell = _BOARD_.cells[(currentCell.cellID+b)-1]; arr.push(cell); if(cell.containsPiece) { if(cell.piece.colour === this.colour) arr.pop(); break loop1; } } catch(e) {;} } break;
            case 2: loop2: for(let b = 1; b <= (8-r); b++) { try { let cell = _BOARD_.cells[(currentCell.cellID+(8*b))-1]; arr.push(cell); if(cell.containsPiece) { if(cell.piece.colour === this.colour) arr.pop(); break loop2; } } catch(e) {;} } break;
            case 3: loop3: for(let b = 1; b < r; b++) { try { let cell = _BOARD_.cells[(currentCell.cellID-(8*b))-1]; arr.push(cell); if(cell.containsPiece) { if(cell.piece.colour === this.colour) arr.pop(); break loop3; } } catch(e) {;} } break;
          } this.validMoves = arr; break;
        case 'knight': this.validMoves = _BOARD_.cells.filter(e => {
          if(e.containsPiece && e.piece.colour === this.colour) return false;
          return (e !== this.currentCell) && (
            (e.row === r-2 && e.column === c-1) || (e.row === r-2 && e.column === c+1) || (e.row === r+2 && e.column === c-1) || (e.row === r+2 && e.column === c+1) ||
            (e.row === r-1 && e.column === c-2) || (e.row === r-1 && e.column === c+2) || (e.row === r+1 && e.column === c-2) || (e.row === r+1 && e.column === c+2)
          )}); break;
        case 'bishop': // Bishop uses same diagonal method as queen (below). //
        case 'queen': arr = [];
          for(let a = 0; a < 4; a++) switch(a) {
/*Diagonal*/case 0: loop0: for(let b = 1; b < c; b++) { try { let cell = _BOARD_.cells[(currentCell.cellID-(9*b))-1]; if(cell) arr.push(cell); if(cell && cell.containsPiece) { if(cell.piece.colour === this.colour) arr.pop(); break loop0; } } catch(e) {;} }
/*Straights*/ if(this.pieceType === 'queen') loop0: for(let b = 1; b < c; b++) { try { let cell = _BOARD_.cells[(currentCell.cellID-b)-1]; if(cell) arr.push(cell); if(cell.containsPiece) { if(cell.piece.colour === this.colour) arr.pop(); break loop0; } } catch(e) {;} } break;
/*Diagonal*/case 1: loop1: for(let b = 1; b <= (8-c); b++) { try { let cell = _BOARD_.cells[(currentCell.cellID-(7*b))-1]; if(cell) arr.push(cell); if(cell && cell.containsPiece) { if(cell.piece.colour === this.colour) arr.pop(); break loop1; } } catch(e) {;} }
/*Straights*/ if(this.pieceType === 'queen') loop1: for(let b = 1; b <= (8-c); b++) { try { let cell = _BOARD_.cells[(currentCell.cellID+b)-1]; if(cell) arr.push(cell); if(cell.containsPiece) { if(cell.piece.colour === this.colour) arr.pop(); break loop1; } } catch(e) {;} } break;
/*Diagonal*/case 2: loop2: for(let b = 1; b < c; b++) { try { let cell = _BOARD_.cells[(currentCell.cellID+(7*b))-1]; if(cell) arr.push(cell); if(cell && cell.containsPiece) { if(cell.piece.colour === this.colour) arr.pop(); break loop2; } } catch(e) {;} }
/*Straights*/ if(this.pieceType === 'queen') loop2: for(let b = 1; b <= (8-r); b++) { try { let cell = _BOARD_.cells[(currentCell.cellID+(8*b))-1]; if(cell) arr.push(cell); if(cell.containsPiece) { if(cell.piece.colour === this.colour) arr.pop(); break loop2; } } catch(e) {;} } break;
/*Diagonal*/case 3: loop3: for(let b = 1; b <= (8-c); b++) { try { let cell = _BOARD_.cells[(currentCell.cellID+(9*b))-1]; if(cell) arr.push(cell); if(cell && cell.containsPiece) { if(cell.piece.colour === this.colour) arr.pop(); break loop3; } } catch(e) {;} }
/*Straights*/ if(this.pieceType === 'queen') loop3: for(let b = 1; b < r; b++) { try { let cell = _BOARD_.cells[(currentCell.cellID-(8*b))-1]; if(cell) arr.push(cell); if(cell.containsPiece) { if(cell.piece.colour === this.colour) arr.pop(); break loop3; } } catch(e) {;} } break;
          } this.validMoves = arr; break;
        case 'king': this.validMoves = _BOARD_.cells.filter(e => {
          if(e.containsPiece && e.piece.colour === this.colour) return false;
          return (e !== this.currentCell) && (
            (e.row === r-1 && e.column === c-1) || (e.row === r-1 && e.column === c) || (e.row === r-1 && e.column === c+1) || (e.row === r && e.column === c+1) ||
            (e.row === r+1 && e.column === c+1) || (e.row === r+1 && e.column === c) || (e.row === r+1 && e.column === c-1) || (e.row === r && e.column === c-1)
          )}); break;
      }
      if(!isProjection) {
        this.validMoves = this.validMoves.filter(e => {
          let futureBOARD = _BOARD_.projectMove(this, e);
          let isValid = !futureBOARD.kingIsInCheck(futureBOARD.whiteIsToMoveNext ? 'B' : 'W');
          return isValid;
        });
      }
      return this.validMoves;
    };
    this.showValidMoves = () => {
      $('.highlight').removeClass('highlight');
      $($('.cell').toArray().filter(e => this.validMoves.indexOf(BOARD.cells[(+$(e).attr('cellID'))-1]) !== -1)).addClass('highlight');
      refreshHighlightEventListener();
    };
  }
}
