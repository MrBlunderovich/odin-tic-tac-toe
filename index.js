//
const Gameboard = (function () {
  const _container = document.querySelector(".container");
  const _board = ["X", "", "", "", "X", "", "", "", "X"];
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

  function getBoard() {
    return _board;
  }

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
        DisplayController.setStatus("Player " + _gameOver + " is victorious!");
        return;
      }
    }
    if (_board.every((cell) => cell !== "")) {
      _gameOver = "draw";
      console.log("We have a draw!");
      DisplayController.setStatus("We have a draw!");
      return;
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
      cell.addEventListener("click", DisplayController.handleCellClick);
    });
  };

  const _fillCells = function () {
    const cellsCollection = document.querySelectorAll(".cell");
    cellsCollection.forEach((cell) => {
      const cellIndex = +cell.dataset.index;
      cell.textContent = _board[cellIndex];
    });
  };

  return { generateCells, resetBoard, markCell, isGameOver, getBoard };
})(); //end of Gameboard module////////////////////////////////

const PlayerFF = (playerMark, playerIdentity) => {
  const mark = playerMark;
  const identity = playerIdentity;
  let active = false;
  /* const makeMove = function (cellIndex) {
    Gameboard.markCell(cellIndex, mark);
  }; */
  function activate() {
    active = true;
  }

  function considerMove() {
    active = true;
    if (identity === "AI") {
      AI.makeMove(mark);
    }
  }

  function makeMove(cellIndex) {
    if (active) {
      DisplayController.makeMove(cellIndex, mark);
      active = false;
    } else {
      console.log("player" + mark + " is not active");
    }
  }

  function report() {
    console.log({ mark, identity, active });
  }

  return { considerMove, makeMove, activate, report };
}; //end of PlayerFF factory function/////////////////////////

const AI = (function () {
  function makeMove(mark) {
    setTimeout(() => makeMoveTimeout(mark), 200);
  }
  function makeMoveTimeout(mark) {
    const board = Gameboard.getBoard();
    let emptyCells = [];
    for (let index = 0; index < board.length; index++) {
      if (board[index] === "") {
        emptyCells.push(index);
      }
    }
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const randomMove = emptyCells[randomIndex];
    if (mark === "X") {
      playerX.makeMove(randomMove);
    } else if (mark === "O") {
      playerO.makeMove(randomMove);
    }
  }
  return { makeMove };
})(); //end of AI module

const DisplayController = (function () {
  const playerXDisplay = document.querySelector(".display__player.X");
  const playerODisplay = document.querySelector(".display__player.O");
  const display = document.querySelector(".display__central");
  let status = "";
  let turn = "";
  const refreshDisplay = () => {
    display.textContent = status;
  };

  function restartGame() {
    Gameboard.resetBoard();
    status = "New Game";
    turn = "X";
    callForMove();
  }

  const spaceReset = function (event) {
    if (event.keyCode === 32 || event.type === "click") {
      restartGame();
    }
  };

  function callForMove() {
    if (Gameboard.isGameOver()) {
      playerODisplay.classList.remove("active-player");
      playerXDisplay.classList.remove("active-player");
      console.log("Controller says game over");
      return;
    }
    console.log("Controller says current turn: " + turn);
    if (turn === "X") {
      playerODisplay.classList.remove("active-player");
      playerXDisplay.classList.add("active-player");
      display.textContent = "<< It's player X's turn";
      playerX.considerMove();
      //turn = "O";
    } else if (turn === "O") {
      playerODisplay.classList.add("active-player");
      playerXDisplay.classList.remove("active-player");
      display.textContent = "It's player O's turn >>";
      playerO.considerMove();
      //turn = "X";
    }
    //console.log("Controller says next turn: " + turn);
  }

  const setStatus = (newStatus) => {
    status = newStatus;
    refreshDisplay();
  };

  function makeMove(cellIndex, mark) {
    console.log("controller calls gameboard.markcell()");
    Gameboard.markCell(cellIndex, mark);
    if (turn === "X") {
      turn = "O";
    } else if (turn === "O") {
      turn = "X";
    }
    console.log("Controller says next turn: " + turn);
    callForMove();
  }

  function handleCellClick(event) {
    const cellIndex = event.target.dataset.index;
    console.log(`Cell ${cellIndex} has been clicked`);
    if (turn === "X") {
      playerX.makeMove(cellIndex);
      console.log("handleClick called playerX.makeMove");
    } else if (turn === "O") {
      playerO.makeMove(cellIndex);
      console.log("handleClick called playerO.makeMove");
    }
  }

  function playerToggle(event) {
    //console.log(event.target);
    //console.log(event.target.parentElement.querySelectorAll(".switch"));
    const switchesPair = event.target.parentElement.querySelectorAll(".switch");
    switchesPair.forEach((item) => {
      item.classList.toggle("selected");
    });
    const selectedId = event.target.parentElement.querySelector(".selected").id;
    console.log(selectedId);
    switch (selectedId) {
      case "X_Human":
        playerX = PlayerFF("X", "human");
        break;
      case "X_AI":
        playerX = PlayerFF("X", "AI");
        break;
      case "O_Human":
        playerO = PlayerFF("O", "human");
        break;
      case "O_AI":
        playerO = PlayerFF("O", "AI");
        break;

      default:
        break;
    }
    playerX.report();
    playerO.report();
  }

  document.addEventListener("keydown", spaceReset);
  document.querySelector(".footer").addEventListener("click", spaceReset);
  const switches = document.querySelectorAll(".display__player>.switch");
  switches.forEach((item) => {
    item.addEventListener("click", playerToggle);
  });
  //callForMove();

  return { makeMove, setStatus, handleCellClick };
})(); //end of DisplayController module////////////////////////////////

let playerX = PlayerFF("X", "human");
let playerO = PlayerFF("O", "human");
Gameboard.generateCells();
