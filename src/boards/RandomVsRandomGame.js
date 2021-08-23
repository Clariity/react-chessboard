import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types';
import Chess from 'chess.js';

import Chessboard from '../Chessboard';

class RandomVsRandom extends Component {
  static propTypes = { children: PropTypes.func };

  state = { fen: 'start' };

  componentDidMount() {
    this.game = new Chess();
    setTimeout(() => this.makeRandomMove(), 1000);
  }

  componentWillUnmount() {
    window.clearTimeout(this.timer());
  }

  timer = () => window.setTimeout(this.makeRandomMove, 100);

  makeRandomMove = () => {
    const possibleMoves = this.game.moves();

    // exit if the game is over
    if (this.game.game_over() === true || this.game.in_draw() === true || possibleMoves.length === 0) {
      console.log(this.game.game_over() === true, this.game.in_draw() === true, possibleMoves.length === 0);
      return;
    }

    const randomIndex = Math.floor(Math.random() * possibleMoves.length);
    this.game.move(possibleMoves[randomIndex]);
    this.setState({ fen: this.game.fen() });

    this.timer();
  };

  render() {
    const { fen } = this.state;
    return this.props.children({ position: fen });
  }
}

/* eslint react/display-name: 0 */
/* eslint react/prop-types: 0 */
export default function RandomVsRandomGame({ boardSize }) {
  return (
    <div>
      <RandomVsRandom>
        {({ position }) => (
          <Chessboard
            boardWidth={boardSize}
            id="random"
            position={position}
            animationDuration={300}
            boardStyle={{
              borderRadius: '5px',
              boxShadow: '0 5px 15px rgba(0, 0, 0, 0.5)'
            }}
          />
        )}
      </RandomVsRandom>
    </div>
  );
}
