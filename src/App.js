import { useState } from "react";

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i, j) {
    if (calculateWinner(squares) || squares[i][j]) {
      return;
    }
    const nextSquares = squares.map((row) => row.slice());
    if (xIsNext) {
      nextSquares[i][j] = "X";
    } else {
      nextSquares[i][j] = "O";
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  return (
    <>
      <div className="status">{status}</div>
      {squares.map((row, i) => (
        <div key={i} className="board-row">
          {row.map((value, j) => (
            <Square
              key={j}
              value={value}
              onSquareClick={() => handleClick(i, j)}
            />
          ))}
        </div>
      ))}
    </>
  );
}

export default function Game() {
  const size = 15;
  const [history, setHistory] = useState([
    Array(size)
      .fill(null)
      .map(() => Array(size).fill(null)),
  ]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = "Go to move #" + move;
    } else {
      description = "Go to game start";
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const size = squares.length;
  const lines = [];

  // Horizontal lines
  for (let i = 0; i < size; i++) {
    for (let j = 0; j <= size - 5; j++) {
      lines.push([
        [i, j],
        [i, j + 1],
        [i, j + 2],
        [i, j + 3],
        [i, j + 4],
      ]);
    }
  }

  // Vertical lines
  for (let i = 0; i <= size - 5; i++) {
    for (let j = 0; j < size; j++) {
      lines.push([
        [i, j],
        [i + 1, j],
        [i + 2, j],
        [i + 3, j],
        [i + 4, j],
      ]);
    }
  }

  // Diagonal lines (top-left to bottom-right)
  for (let i = 0; i <= size - 5; i++) {
    for (let j = 0; j <= size - 5; j++) {
      lines.push([
        [i, j],
        [i + 1, j + 1],
        [i + 2, j + 2],
        [i + 3, j + 3],
        [i + 4, j + 4],
      ]);
    }
  }

  // Diagonal lines (top-right to bottom-left)
  for (let i = 0; i <= size - 5; i++) {
    for (let j = 4; j < size; j++) {
      lines.push([
        [i, j],
        [i + 1, j - 1],
        [i + 2, j - 2],
        [i + 3, j - 3],
        [i + 4, j - 4],
      ]);
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const [[a1, a2], [b1, b2], [c1, c2], [d1, d2], [e1, e2]] = lines[i];
    if (
      squares[a1][a2] &&
      squares[a1][a2] === squares[b1][b2] &&
      squares[a1][a2] === squares[c1][c2] &&
      squares[a1][a2] === squares[d1][d2] &&
      squares[a1][a2] === squares[e1][e2]
    ) {
      return squares[a1][a2];
    }
  }
  return null;
}
