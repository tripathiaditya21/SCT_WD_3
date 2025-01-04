let board = Array(9).fill('');
let currentPlayer = 'X';
let isUserVsComputer = false;
const winPatterns = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6],            // Diagonals
];

const boardElement = document.getElementById('board');
const statusElement = document.getElementById('status');
const turnElement = document.getElementById('turn');
const toggleModeButton = document.getElementById('toggle-mode');
const restartButton = document.getElementById('restart');

// Create board dynamically
function createBoard(size = 3) {
  boardElement.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  board = Array(size * size).fill('');
  boardElement.innerHTML = '';

  board.forEach((cell, index) => {
    const cellElement = document.createElement('div');
    cellElement.classList.add('cell');
    cellElement.dataset.index = index;
    cellElement.innerText = cell;
    cellElement.addEventListener('click', onCellClick);
    boardElement.appendChild(cellElement);
  });
}

function onCellClick(e) {
  const index = e.target.dataset.index;

  if (board[index] === '') {
    board[index] = currentPlayer;
    e.target.innerText = currentPlayer;
    e.target.classList.add('taken');

    if (checkWin()) {
      turnElement.innerText = `${currentPlayer} Wins!`;
      endGame();
      return;
    }

    if (board.every(cell => cell !== '')) {
      turnElement.innerText = "It's a Tie!";
      return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    turnElement.innerText = `${currentPlayer}'s Turn`;

    if (isUserVsComputer && currentPlayer === 'O') {
      setTimeout(computerMove, 500); // Add delay for realism
    }
  }
}

function computerMove() {
  let emptyCells = board
    .map((cell, index) => (cell === '' ? index : null))
    .filter(index => index !== null);

  let randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];

  board[randomIndex] = 'O';
  const cellElement = document.querySelector(`.cell[data-index="${randomIndex}"]`);
  cellElement.innerText = 'O';
  cellElement.classList.add('taken');

  if (checkWin()) {
    turnElement.innerText = 'O Wins!';
    endGame();
    return;
  }

  currentPlayer = 'X';
  turnElement.innerText = `${currentPlayer}'s Turn`;
}

function checkWin() {
  return winPatterns.some(pattern =>
    pattern.every(index => board[index] === currentPlayer)
  );
}

function endGame() {
  document.querySelectorAll('.cell').forEach(cell => cell.classList.add('taken'));
}

function restartGame() {
  board = Array(board.length).fill('');
  currentPlayer = 'X';
  turnElement.innerText = `${currentPlayer}'s Turn`;
  createBoard(Math.sqrt(board.length)); // Maintain the current board size
}

function toggleMode() {
  isUserVsComputer = !isUserVsComputer;
  statusElement.innerText = `Mode: ${isUserVsComputer ? 'User vs Computer' : 'User vs User'}`;
  restartGame();
}

// Event Listeners
restartButton.addEventListener('click', restartGame);
toggleModeButton.addEventListener('click', toggleMode);

// Initialize with a default 3x3 board
createBoard();
