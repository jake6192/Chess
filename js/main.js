let BOARD;
$(document).ready(function() {
  BOARD = new Board();
  BOARD.generateCells();
  BOARD.generatePieces();
  BOARD.drawBoard();
  BOARD.drawCellValues();
});
