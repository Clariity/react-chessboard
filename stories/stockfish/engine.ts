const stockfish = new Worker("./stockfish.js");

export default class Engine {
  stockfish: Worker;
  sendMessage: (message: string) => void;
  onMessage: (callback: (message: string) => void) => void;

  constructor() {
    this.stockfish = stockfish;
    this.sendMessage = (message) => {
      this.stockfish.postMessage(message);
    };
    this.onMessage = (callback) => {
      this.stockfish.addEventListener("message", (e) => {
        callback(e.data);
      });
    };
  }

  init() {
    this.sendMessage("uci");
    this.sendMessage("isready");
  }

  // Common sendMessage commands.
  setPosition(fenString) {
    this.sendMessage(`position fen ${fenString}`);
  }

  evaluatePosition(fenString, depth = 16) {
    if (depth > 24) depth = 24;

    this.setPosition(fenString);
    this.sendMessage(`go depth ${depth}`);
  }
  stop() {
    this.sendMessage("stop"); // Run when changing positions
  }
  terminate() {
    this.sendMessage("quit"); // Good to run this before chessboard unmounting.
  }
}
