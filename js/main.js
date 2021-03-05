let BOARD;
$(document).ready(function() {
  BOARD = new Board();
  BOARD.generateCells();
  BOARD.generatePieces();
  BOARD.drawBoard();
  BOARD.drawCellValues();
});




/*********************************
*|~~  Drag and drop handlers  ~~|*
*********************************/

let pieceToMove;
function dragstart_handler(ev, el) {
 ev.dataTransfer.effectAllowed = "move";
 pieceToMove = BOARD.cells[(+$(el).parent().attr('cellID'))-1].piece;
 pieceToMove.updateValidMovesList();
 pieceToMove.showValidMoves();
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
