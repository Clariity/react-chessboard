/*!
 * Stockfish.js (http://github.com/nmrugg/stockfish.js)
 * License: GPL
 */

const stockfish = new Worker("./stockfish.js");

type EngineMessage = {
  /** stockfish engine message in UCI format*/
  uciMessage: string;
  /** found best move for current position in format `e2e4`*/
  bestMove?: string;
  /** found best move for opponent in format `e7e5` */
  ponder?: string;
  /**  material balance's difference in centipawns(IMPORTANT! stockfish gives the cp score in terms of whose turn it is)*/
  positionEvaluation?: string;
  /** count of moves until mate */
  possibleMate?: string;
};

export default class Engine {
  stockfish: Worker;
  onMessage: (callback: (messageData: EngineMessage) => void) => void;

  constructor() {
    this.stockfish = stockfish;

    this.onMessage = (callback) => {
      this.stockfish.addEventListener("message", (e) => {
        callback(this.transformSFMessageData(e));
      });
    };
  }

  private transformSFMessageData(e) {
    const uciMessage = e?.data ?? e;

    return {
      uciMessage,
      bestMove: uciMessage.match(/bestmove\s+(\S+)/)?.[1],
      ponder: uciMessage.match(/ponder\s+(\S+)/)?.[1],
      positionEvaluation: uciMessage.match(/cp\s+(\S+)/)?.[1],
      possibleMate: uciMessage.match(/mate\s+(\S+)/)?.[1],
    };
  }
  init() {
    this.stockfish.postMessage("uci");
    this.stockfish.postMessage("isready");
  }

  evaluatePosition(fen, depth = 16) {
    if (depth > 24) depth = 24;

    this.stockfish.postMessage(`position fen ${fen}`);
    this.stockfish.postMessage(`go depth ${depth}`);
  }
  stop() {
    this.stockfish.postMessage("stop"); // Run when searching takes too long time and stockfish will return you the bestmove of the deep it has reached
  }
  terminate() {
    this.stockfish.postMessage("quit"); // Run this before chessboard unmounting.
  }
}
