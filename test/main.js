const assert = require('assert');
const Board = require('../src/board.js').Board;
const BoardView = require('../src/boardview.js').BoardView;
const Square = require('../src/square.js').Square;
const PieceBoard = require('../src/pieceboard.js').PieceBoard;
const PieceBoardView = require('../src/boardview.js').PieceBoardView;

const board = new Board();
board.parseFenToBoard('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'); // eslint-disable-line

// Boards should return BigInts
describe('Board', function() {
  describe('#parseFenToBoard()', function() {
    it('returns a bitboard for a given fen', function() {
      assert.equal(board.bb, 18446462598732906495n);
    });
  }); 

  describe('#displayCastleStatus', function() {
    it('returns the integer representing the castling status', function() {
      assert.equal(board.castleStatus, 15);
    });
  });

  describe('#flipBoard()', function() {
    it('flips the board', function() {
      const flippedBoard = new Board();
      flippedBoard.parseFenToBoard('r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq '); // eslint-disable-line
      flippedBoard.flipBoard();

      assert.equal(flippedBoard.bb, 15992005286099480479n);
    });
  });
});

// PieceBoard should return BigInts
describe('PieceBoard', function() {
  describe('#bb', function() {
    it('returns the correct bigint', function() {
      const rook = PieceBoard.for('r', 55); 
      assert.equal(rook.bb, 36028797018963968n);
    });
  });

  describe('#pawnMoves', function() {
    it('returns pawn moves', function() {
      let pawnBoard = new Board();
      const pawn2ndRank = PieceBoard.for('P', 10).on(pawnBoard.bb);
      const pawn3rdRank = PieceBoard.for('P', 21).on(pawnBoard.bb);
      // pawnBoard.pieceBoardList['p'] = pawn2ndRank;
      // console.log(pawn);
      // console.log(pawn.moves())
      // console.log(new MoveView(pawn.moves()).display())

      // assert.equal(new BoardView())
      // new BoardView(pieceBoardList.get('k').moves())
      // TODO: add attacks
      // TODO: add black pieces
      assert.equal(new PieceBoardView(pawn2ndRank).display(),  '00000000\n00000000\n00000000\n00000000\n00000000\n00000000\n00100000\n00000000');
      assert.equal(new PieceBoardView(pawn2ndRank).displayMoves(), '00000000\n00000000\n00000000\n00000000\n00100000\n00100000\n00000000\n00000000')
      assert.equal(new PieceBoardView(pawn3rdRank).display(),  '00000000\n00000000\n00000000\n00000000\n00000000\n00000100\n00000000\n00000000');
      assert.equal(new PieceBoardView(pawn3rdRank).displayMoves(), '00000000\n00000000\n00000000\n00000000\n00000100\n00000000\n00000000\n00000000')
    });
  });
});

// BoardView should return Strings
/* eslint-disable max-len */
describe('BoardView', function() {
  // in binary, you have to read from right to left
  // so you need to imagine going through the FEN in reverse order of rank and file
  // ...b8b7b6b5b4b3b2b1a8a7a6a5a4a3a2a1
  // with this function, this makes it easier to understand for regular people
  describe('#display()', function() {
    it('shows the all the pieces on the board', function() {
      assert.equal(new BoardView(board.pieceBoardList).display(), '11111111\n11111111\n00000000\n00000000\n00000000\n00000000\n11111111\n11111111');
    });

    it('correctly flips the board', function() {
      const flippedBoard = new Board();
      flippedBoard.parseFenToBoard('r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq ');
      flippedBoard.flipBoard();

      assert.equal(new BoardView(flippedBoard.pieceBoardList).display(), '11111001\n11110111\n00000100\n00101000\n00101000\n00100000\n11110111\n10111011');
    });

    it('handles arbitrary pieceBoardList', function() {
      let rookBoard = new Board();
      const rook = PieceBoard.for('r', 55);
      rookBoard.pieceBoardList['r'] = rook;
      assert.equal(new BoardView(rookBoard.pieceBoardList).display(), '00000000\n00000001\n00000000\n00000000\n00000000\n00000000\n00000000\n00000000');
    });
  });

  describe('#displayPiece()', function() {
    it('shows the correct initial pawn & piece placements', function() {
      const pieceBoardList = board.pieceBoardList;

      assert.equal(new BoardView(pieceBoardList).displayPiece('P'), '00000000\n00000000\n00000000\n00000000\n00000000\n00000000\n11111111\n00000000');
      assert.equal(new BoardView(pieceBoardList).displayPiece('N'), '00000000\n00000000\n00000000\n00000000\n00000000\n00000000\n00000000\n01000010');
      assert.equal(new BoardView(pieceBoardList).displayPiece('B'), '00000000\n00000000\n00000000\n00000000\n00000000\n00000000\n00000000\n00100100');
      assert.equal(new BoardView(pieceBoardList).displayPiece('R'), '00000000\n00000000\n00000000\n00000000\n00000000\n00000000\n00000000\n10000001');
      assert.equal(new BoardView(pieceBoardList).displayPiece('Q'), '00000000\n00000000\n00000000\n00000000\n00000000\n00000000\n00000000\n00010000');
      assert.equal(new BoardView(pieceBoardList).displayPiece('K'), '00000000\n00000000\n00000000\n00000000\n00000000\n00000000\n00000000\n00001000');
    });
  });
});
/* eslint-enable max-len */

// Square should return integer indices
describe('Square', function() {
  describe('#indicesFor', function() {
    const rookBoard = board.pieceBoardList.r;
    const bKingBoard = board.pieceBoardList.k;
    const wKingBoard = board.pieceBoardList.K;

    it('shows indices of black rook', function() {
      assert.equal(Square.indicesFor(rookBoard)[0], 56);
      assert.equal(Square.indicesFor(rookBoard)[1], 63);
    });

    it('shows indices of black king', function() {
      assert.equal(Square.indicesFor(bKingBoard)[0], 60);
    });

    it('shows indices of white king', function() {
      assert.equal(Square.indicesFor(wKingBoard)[0], 4);
    });
  });
});

