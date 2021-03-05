let BOARD;
$(document).ready(function() {
  BOARD = new Board();
  BOARD.generateCells();
  BOARD.drawBoard();
  BOARD.generatePieces();
  BOARD.drawCellValues();
});
