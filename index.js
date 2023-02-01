//
const GameBoard = (function () {
  const _container = document.querySelector(".container");
  const _board = [
    { mark: "" },
    { mark: "X" },
    { mark: "" },
    { mark: "" },
    { mark: "" },
    { mark: "O" },
    { mark: "O" },
    { mark: "O" },
    { mark: "" },
  ];
  const _lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  let _gameOver = false;

  const isGameOver = function () {
    return _gameOver;
  };

  const _checkForWin = function () {
    for (let line of _lines) {
      if (
        _board[line[0]].mark !== "" &&
        _board[line[0]].mark === _board[line[1]].mark &&
        _board[line[2]].mark === _board[line[1]].mark
      ) {
        _gameOver = _board[line[0]].mark;
        console.log(_gameOver + " win on line: " + line);
        return;
      }
    }
  };

  const markCell = function (index, mark) {
    if (_gameOver) {
      console.log("game is over");
      return;
    }
    if (_board[index].mark !== "") {
      console.log("cell is already checked");
      return;
    }
    const XOregex = /^(X|O)$/;
    if (index < 0 || index > 8 || !XOregex.test(mark)) {
      console.log("invalid mark or cell index");
      return;
    }
    _board[index].mark = mark;
    _renderCells();
    _checkForWin();
  };

  const resetBoard = function () {
    _board.forEach((cell) => (cell.mark = ""));
    _gameOver = false;
    _renderCells();
  };

  const _generateCells = function () {
    //_resetBoard()
    return _board
      .map((item, index) => {
        return `<div data-index="${index}" class="cell">${item.mark}</div>`;
      })
      .join("");
  };

  const _renderCells = function () {
    _container.innerHTML = _generateCells();
  };
  return { resetBoard, markCell, isGameOver };
})();

GameBoard.resetBoard();
