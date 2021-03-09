let BOARD;
let refreshHighlightEventListener;
let _pieceToMove_;
$(document).ready(function() {
  BOARD = new Board();
  BOARD.generateCells();
  BOARD.generatePieces();
  BOARD.drawBoard();
  BOARD.drawCellValues();




  /*************************
  *|~~  Click handlers  ~~|*
  *************************/

  refreshHighlightEventListener = () => {
    $('.cell, .cell img').off('click');
    $('.cell img').click(e => {
      let cell = BOARD.cells[+$(e.currentTarget).parent().attr('cellID')-1];
      if(cell.containsPiece) {
        _pieceToMove_ = cell.piece;
        if(_pieceToMove_.colour === (BOARD.whiteIsToMoveNext ? 'W' : 'B')) {
          _pieceToMove_.updateValidMovesList();
          _pieceToMove_.showValidMoves();
        }
      }
    });
    $('.cell.highlight').click(e => {
      $('.highlight').removeClass('highlight');
      if(_pieceToMove_) {
        let newCell = BOARD.cells[(+$(e.currentTarget).attr('cellID'))-1];
        if(_pieceToMove_.validMoves.indexOf(newCell) !== -1) {
          _pieceToMove_.movePiece(BOARD, newCell);
          _pieceToMove_ = undefined;
        }
      }
    });
  };
  refreshHighlightEventListener();
});




/*********************************
*|~~  Drag and drop handlers  ~~|*
*********************************/

function dragstart_handler(ev, el) {
 ev.dataTransfer.effectAllowed = "move";
 _pieceToMove_ = BOARD.cells[(+$(el).parent().attr('cellID'))-1].piece;
 if(_pieceToMove_.colour === (BOARD.whiteIsToMoveNext ? 'W' : 'B')) {
   _pieceToMove_.updateValidMovesList();
   _pieceToMove_.showValidMoves();
 } else ev.preventDefault();
}

function dragover_handler(ev) {
 ev.preventDefault();
 ev.dataTransfer.dropEffect = "move"
}

function drop_handler(ev, el) {
 ev.preventDefault();
 $('.highlight').removeClass('highlight');
 if(_pieceToMove_) {
   let newCell = BOARD.cells[(+$(el).attr('cellID'))-1];
   if(_pieceToMove_.validMoves.indexOf(newCell) !== -1) {
    _pieceToMove_.movePiece(BOARD, newCell);
    _pieceToMove_ = undefined;
   }
 }
}




/****************************
*|~~  Development Tools  ~~|*
****************************/
