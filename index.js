//
const GameBoard = (function () {
  const _container = document.querySelector(".container");
  const _board = ["", "", "", "", "", "", "", "", ""];
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
        _board[line[0]] !== "" &&
        _board[line[0]] === _board[line[1]] &&
        _board[line[2]] === _board[line[1]]
      ) {
        _gameOver = _board[line[0]];
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
    if (_board[index] !== "") {
      console.log("cell is already checked");
      return;
    }
    const XOregex = /^(X|O)$/;
    if (index < 0 || index > 8 || !XOregex.test(mark)) {
      console.log("invalid mark or cell index");
      return;
    }
    _board[index] = mark;
    _fillCells();
    _checkForWin();
  };

  const resetBoard = function () {
    for (let i = 0; i < _board.length; i++) {
      _board[i] = "";
    }
    _gameOver = false;
    _fillCells();
  };

  const generateCells = function () {
    const boardCells = _board
      .map((item, index) => {
        return `<div data-index="${index}" class="cell">${item}</div>`;
      })
      .join("");
    _container.innerHTML = boardCells;
    const cellsCollection = document.querySelectorAll(".cell");
    cellsCollection.forEach((cell) => {
      cell.addEventListener("click", handleCellClick);
    });

    const spaceReset = function (event) {
      console.log(event);
      if (event.keyCode === 32) {
        resetBoard();
      }
    };
    document.addEventListener("keydown", spaceReset);
  };

  const _fillCells = function () {
    const cellsCollection = document.querySelectorAll(".cell");
    console.log("_fillCells");
    console.log(_board);
    cellsCollection.forEach((cell) => {
      const cellIndex = +cell.dataset.index;
      cell.textContent = _board[cellIndex];
    });
  };

  return { generateCells, resetBoard, markCell, isGameOver };
})();

GameBoard.generateCells();

function handleCellClick(event) {
  const cellIndex = event.target.dataset.index;
  console.log(cellIndex);
  GameBoard.markCell(cellIndex, "X");
}
