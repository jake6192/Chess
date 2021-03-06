let BOARD;
let refreshHighlightEventListener;
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
        pieceToMove = cell.piece;
        if(pieceToMove.colour === (BOARD.whiteIsToMoveNext ? 'W' : 'B')) {
          pieceToMove.updateValidMovesList();
          pieceToMove.showValidMoves();
        }
      }
    });
    $('.cell.highlight').click(e => {
      $('.highlight').removeClass('highlight');
      if(pieceToMove) {
        let newCell = BOARD.cells[(+$(e.currentTarget).attr('cellID'))-1];
        if(pieceToMove.validMoves.indexOf(newCell) !== -1) {
         pieceToMove.movePiece(newCell);
         pieceToMove = undefined;
       }
      }
    });
  };
  refreshHighlightEventListener();
});




/*********************************
*|~~  Drag and drop handlers  ~~|*
*********************************/

let pieceToMove;
function dragstart_handler(ev, el) {
 ev.dataTransfer.effectAllowed = "move";
 pieceToMove = BOARD.cells[(+$(el).parent().attr('cellID'))-1].piece;
 if(pieceToMove.colour === (BOARD.whiteIsToMoveNext ? 'W' : 'B')) {
   pieceToMove.updateValidMovesList();
   pieceToMove.showValidMoves();
 } else ev.preventDefault();
}

function dragover_handler(ev) {
 ev.preventDefault();
 ev.dataTransfer.dropEffect = "move"
}

function drop_handler(ev, el) {
 ev.preventDefault();
 $('.highlight').removeClass('highlight');
 if(pieceToMove) {
   let newCell = BOARD.cells[(+$(el).attr('cellID'))-1];
   if(pieceToMove.validMoves.indexOf(newCell) !== -1) {
    pieceToMove.movePiece(newCell);
    pieceToMove = undefined;
   }
 }
}
