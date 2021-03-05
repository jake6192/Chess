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
}

function dragover_handler(ev) {
 ev.preventDefault();
 ev.dataTransfer.dropEffect = "move"
}

function drop_handler(ev, el) {
 ev.preventDefault();
 if(pieceToMove) {
   let newCell = BOARD.cells[(+$(el).attr('cellID'))-1];
   // if(validateMove(pieceToMove, newCell)) { // TODO //
    pieceToMove.movePiece(newCell);
    pieceToMove = undefined;
   // }
 }
}
