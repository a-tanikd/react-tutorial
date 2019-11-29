import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  )
}

function Board(props) {
  return (
    <div>
      {range(0, 3).map(i =>
        <div className="board-row">
          {range(0, 3).map(j => {
            const index = 3 * i + j;
            return (
              <Square
                value={props.squares[index]}
                onClick={props.onClick.bind(this, index)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

function Status(props) {
  const winner = props.winner;
  const status = winner ?
    `Winner: ${winner}` :
    `Next player: ${props.xIsNext ? 'X' : 'O'}`;
  return (
    <div className="status">{status}</div>
  )
}

function GoToButton(props) {
  const step = props.step;
  const desc = step ?
    'Go to move #' + step :
    'Go to game start';
  return (
    <button onClick={() => props.onButtonClick(step)}>
      {desc}
    </button>
  );
}

function range(start = 0, end = Infinity, step = 1) {
  const array = [];
  for (let i = start; i < end; i += step) {
    array.push(i);
  }
  return array;
}

function GoToButtonList(props) {
  const moves = range(0, props.count).map((step) =>
    <li key={step}>
      <GoToButton
        step={step}
        onButtonClick={props.onButtonClick}
      />
    </li>
  );

  return (
    <ol>{moves}</ol>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function GameInfo(props) {
  const history = props.history;
  const count = history.length;
  const current = history[props.stepNumber];
  const winner = calculateWinner(current.squares);

  return (
    <div className="game-info" >
      <Status winner={winner} xIsNext={props.xIsNext} />
      <GoToButtonList
        count={count}
        onButtonClick={props.onButtonClick}
      />
    </div>
  );
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
    };
    this.jumpTo = this.jumpTo.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  render() {
    const history = this.state.history;
    const stepNumber = this.state.stepNumber;
    const current = history[stepNumber];

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={this.handleClick}
          />
        </div>
        <GameInfo
          history={history}
          stepNumber={stepNumber}
          xIsNext={this.state.xIsNext}
          onButtonClick={this.jumpTo}
        />
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
