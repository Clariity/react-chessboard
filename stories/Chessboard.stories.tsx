import React, { forwardRef, useEffect, useRef, useState, useMemo } from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import Chess from "chess.js";

import { Chessboard, ClearPremoves } from "../src";
import {
  CustomSquareProps,
  Square,
  BoardOrientation,
} from "../src/chessboard/types";
import Engine from "./stockfish/engine";

// examples
// multiboard example https://storybook.js.org/docs/react/writing-stories/stories-for-multiple-components

const buttonStyle = {
  cursor: "pointer",
  padding: "10px 20px",
  margin: "10px 10px 0px 0px",
  borderRadius: "6px",
  backgroundColor: "#f0d9b5",
  border: "none",
  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.5)",
};

const inputStyle = {
  padding: "10px 20px",
  margin: "10px 0 10px 0",
  borderRadius: "6px",
  border: "none",
  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.5)",
};

const boardWrapper = {
  width: `70vw`,
  maxWidth: "70vh",
  margin: "3rem auto",
};

export default {
  title: "Example/Chessboard",
  component: Chessboard,
} as ComponentMeta<typeof Chessboard>;

const Template: ComponentStory<typeof Chessboard> = (args) => (
  <div style={boardWrapper}>
    <Chessboard {...args} />
  </div>
);

export const ConfigurableBoard = Template.bind({});
ConfigurableBoard.args = {
  id: "Configurable Board",
};

///////////////////////////////////
////////// PlayVsRandom ///////////
///////////////////////////////////
export const PlayVsRandom = () => {
  const [game, setGame] = useState(new Chess());
  const [currentTimeout, setCurrentTimeout] = useState<NodeJS.Timeout>();

  function safeGameMutate(modify) {
    setGame((g) => {
      const update = { ...g };
      modify(update);
      return update;
    });
  }

  function makeRandomMove() {
    const possibleMoves = game.moves();

    // exit if the game is over
    if (game.game_over() || game.in_draw() || possibleMoves.length === 0)
      return;

    const randomIndex = Math.floor(Math.random() * possibleMoves.length);
    safeGameMutate((game) => {
      game.move(possibleMoves[randomIndex]);
    });
  }

  function onDrop(sourceSquare, targetSquare, piece) {
    const gameCopy = { ...game };
    const move = gameCopy.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: piece[1].toLowerCase() ?? "q",
    });
    setGame(gameCopy);

    // illegal move
    if (move === null) return false;

    // store timeout so it can be cleared on undo/reset so computer doesn't execute move
    const newTimeout = setTimeout(makeRandomMove, 200);
    setCurrentTimeout(newTimeout);
    return true;
  }

  return (
    <div style={boardWrapper}>
      <Chessboard
        id="PlayVsRandom"
        position={game.fen()}
        onPieceDrop={onDrop}
        customBoardStyle={{
          borderRadius: "4px",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
        }}
      />
      <button
        style={buttonStyle}
        onClick={() => {
          safeGameMutate((game) => {
            game.reset();
          });
          clearTimeout(currentTimeout);
        }}
      >
        reset
      </button>
      <button
        style={buttonStyle}
        onClick={() => {
          safeGameMutate((game) => {
            game.undo();
          });
          clearTimeout(currentTimeout);
        }}
      >
        undo
      </button>
    </div>
  );
};

///////////////////////////////////
////////// PlayVsStockfish ////////
///////////////////////////////////

export const PlayVsComputer = () => {
  const levels = {
    "Easy 🤓": 2,
    "Medium 🧐": 8,
    "Hard 😵": 18,
  };
  const engine = useMemo(() => new Engine(), []);
  const game = useMemo(() => new Chess(), []);

  const [gamePosition, setGamePosition] = useState(game.fen());
  const [stockfishLevel, setStockfishLevel] = useState(2);

  function findBestMove() {
    engine.evaluatePosition(game.fen(), stockfishLevel);

    engine.onMessage(({ bestMove }) => {
      if (bestMove) {
        // In latest chess.js versions you can just write ```game.move(bestMove)```
        game.move({
          from: bestMove.substring(0, 2),
          to: bestMove.substring(2, 4),
          promotion: bestMove.substring(4, 5),
        });

        setGamePosition(game.fen());
      }
    });
  }

  function onDrop(sourceSquare, targetSquare, piece) {
    const move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: piece[1].toLowerCase() ?? "q",
    });
    setGamePosition(game.fen());

    // illegal move
    if (move === null) return false;

    // exit if the game is over
    if (game.game_over() || game.in_draw()) return false;

    findBestMove();

    return true;
  }

  return (
    <div style={boardWrapper}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "1rem",
        }}
      >
        {Object.entries(levels).map(([level, depth]) => (
          <button
            style={{
              ...buttonStyle,
              backgroundColor: depth === stockfishLevel ? "#B58863" : "#f0d9b5",
            }}
            onClick={() => setStockfishLevel(depth)}
          >
            {level}
          </button>
        ))}
      </div>

      <Chessboard
        id="PlayVsStockfish"
        position={gamePosition}
        onPieceDrop={onDrop}
      />

      <button
        style={buttonStyle}
        onClick={() => {
          game.reset();
          setGamePosition(game.fen());
        }}
      >
        New game
      </button>
      <button
        style={buttonStyle}
        onClick={() => {
          game.undo();
          game.undo();
          setGamePosition(game.fen());
        }}
      >
        Undo
      </button>
    </div>
  );
};

//////////////////////////////////
////////// ClickToMove ///////////
//////////////////////////////////
export const ClickToMove = () => {
  const [game, setGame] = useState(new Chess());
  const [moveFrom, setMoveFrom] = useState("");
  const [moveTo, setMoveTo] = useState<Square | null>(null);
  const [showPromotionDialog, setShowPromotionDialog] = useState(false);
  const [rightClickedSquares, setRightClickedSquares] = useState({});
  const [moveSquares, setMoveSquares] = useState({});
  const [optionSquares, setOptionSquares] = useState({});

  function safeGameMutate(modify) {
    setGame((g) => {
      const update = { ...g };
      modify(update);
      return update;
    });
  }

  function getMoveOptions(square) {
    const moves = game.moves({
      square,
      verbose: true,
    });
    if (moves.length === 0) {
      setOptionSquares({});
      return false;
    }

    const newSquares = {};
    moves.map((move) => {
      newSquares[move.to] = {
        background:
          game.get(move.to) &&
          game.get(move.to).color !== game.get(square).color
            ? "radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)"
            : "radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)",
        borderRadius: "50%",
      };
      return move;
    });
    newSquares[square] = {
      background: "rgba(255, 255, 0, 0.4)",
    };
    setOptionSquares(newSquares);
    return true;
  }

  function makeRandomMove() {
    const possibleMoves = game.moves();

    // exit if the game is over
    if (game.game_over() || game.in_draw() || possibleMoves.length === 0)
      return;

    const randomIndex = Math.floor(Math.random() * possibleMoves.length);
    safeGameMutate((game) => {
      game.move(possibleMoves[randomIndex]);
    });
  }

  function onSquareClick(square) {
    setRightClickedSquares({});

    // from square
    if (!moveFrom) {
      const hasMoveOptions = getMoveOptions(square);
      if (hasMoveOptions) setMoveFrom(square);
      return;
    }

    // to square
    if (!moveTo) {
      // check if valid move before showing dialog
      const moves = game.moves({
        moveFrom,
        verbose: true,
      });
      const foundMove = moves.find(
        (m) => m.from === moveFrom && m.to === square
      );
      // not a valid move
      if (!foundMove) {
        // check if clicked on new piece
        const hasMoveOptions = getMoveOptions(square);
        // if new piece, setMoveFrom, otherwise clear moveFrom
        setMoveFrom(hasMoveOptions ? square : "");
        return;
      }

      // valid move
      setMoveTo(square);

      // if promotion move
      if (
        (foundMove.color === "w" &&
          foundMove.piece === "p" &&
          square[1] === "8") ||
        (foundMove.color === "b" &&
          foundMove.piece === "p" &&
          square[1] === "1")
      ) {
        setShowPromotionDialog(true);
        return;
      }

      // is normal move
      const gameCopy = { ...game };
      const move = gameCopy.move({
        from: moveFrom,
        to: square,
        promotion: "q",
      });

      // if invalid, setMoveFrom and getMoveOptions
      if (move === null) {
        const hasMoveOptions = getMoveOptions(square);
        if (hasMoveOptions) setMoveFrom(square);
        return;
      }

      setGame(gameCopy);

      setTimeout(makeRandomMove, 1300);
      setMoveFrom("");
      setMoveTo(null);
      setOptionSquares({});
      return;
    }
  }

  function onPromotionPieceSelect(piece) {
    // if no piece passed then user has cancelled dialog, don't make move and reset
    if (piece) {
      const gameCopy = { ...game };
      gameCopy.move({
        from: moveFrom,
        to: moveTo,
        promotion: piece[1].toLowerCase() ?? "q",
      });
      setGame(gameCopy);
      setTimeout(makeRandomMove, 1300);
    }

    setMoveFrom("");
    setMoveTo(null);
    setShowPromotionDialog(false);
    setOptionSquares({});
    return true;
  }

  function onSquareRightClick(square) {
    const colour = "rgba(0, 0, 255, 0.4)";
    setRightClickedSquares({
      ...rightClickedSquares,
      [square]:
        rightClickedSquares[square] &&
        rightClickedSquares[square].backgroundColor === colour
          ? undefined
          : { backgroundColor: colour },
    });
  }

  return (
    <div style={boardWrapper}>
      <Chessboard
        id="ClickToMove"
        animationDuration={1200}
        arePiecesDraggable={false}
        position={game.fen()}
        onSquareClick={onSquareClick}
        onSquareRightClick={onSquareRightClick}
        onPromotionPieceSelect={onPromotionPieceSelect}
        customBoardStyle={{
          borderRadius: "4px",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
        }}
        customSquareStyles={{
          ...moveSquares,
          ...optionSquares,
          ...rightClickedSquares,
        }}
        promotionToSquare={moveTo}
        showPromotionDialog={showPromotionDialog}
      />
      <button
        style={buttonStyle}
        onClick={() => {
          safeGameMutate((game) => {
            game.reset();
          });
          setMoveSquares({});
          setOptionSquares({});
          setRightClickedSquares({});
        }}
      >
        reset
      </button>
      <button
        style={buttonStyle}
        onClick={() => {
          safeGameMutate((game) => {
            game.undo();
          });
          setMoveSquares({});
          setOptionSquares({});
          setRightClickedSquares({});
        }}
      >
        undo
      </button>
    </div>
  );
};

//////////////////////////////////////
////////// PremovesEnabled ///////////
//////////////////////////////////////
export const PremovesEnabled = () => {
  const [game, setGame] = useState(new Chess());
  const [currentTimeout, setCurrentTimeout] = useState<NodeJS.Timeout>();
  const chessboardRef = useRef<ClearPremoves>(null);

  function safeGameMutate(modify) {
    setGame((g) => {
      const update = { ...g };
      modify(update);
      return update;
    });
  }

  function makeRandomMove() {
    const possibleMoves = game.moves();

    // exit if the game is over
    if (game.game_over() || game.in_draw() || possibleMoves.length === 0)
      return;

    const randomIndex = Math.floor(Math.random() * possibleMoves.length);
    safeGameMutate((game) => {
      game.move(possibleMoves[randomIndex]);
    });
  }

  function onDrop(sourceSquare, targetSquare, piece) {
    const gameCopy = { ...game };
    const move = gameCopy.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: piece[1].toLowerCase() ?? "q",
    });
    setGame(gameCopy);

    // illegal move
    if (move === null) return false;

    // store timeout so it can be cleared on undo/reset so computer doesn't execute move
    const newTimeout = setTimeout(makeRandomMove, 2000);
    setCurrentTimeout(newTimeout);
    return true;
  }

  return (
    <div style={boardWrapper}>
      <Chessboard
        id="PremovesEnabled"
        arePremovesAllowed={true}
        position={game.fen()}
        isDraggablePiece={({ piece }) => piece[0] === "w"}
        onPieceDrop={onDrop}
        customBoardStyle={{
          borderRadius: "4px",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
        }}
        ref={chessboardRef}
      />
      <button
        style={buttonStyle}
        onClick={() => {
          safeGameMutate((game) => {
            game.reset();
          });
          // clear premove queue
          chessboardRef.current?.clearPremoves();
          // stop any current timeouts
          clearTimeout(currentTimeout);
        }}
      >
        reset
      </button>
      <button
        style={buttonStyle}
        onClick={() => {
          // undo twice to undo computer move too
          safeGameMutate((game) => {
            game.undo();
            game.undo();
          });
          // clear premove queue
          chessboardRef.current?.clearPremoves();
          // stop any current timeouts
          clearTimeout(currentTimeout);
        }}
      >
        undo
      </button>
    </div>
  );
};

///////////////////////////////////
////////// Styled Board ///////////
///////////////////////////////////
export const StyledBoard = () => {
  const [game, setGame] = useState(new Chess());

  function safeGameMutate(modify) {
    setGame((g) => {
      const update = { ...g };
      modify(update);
      return update;
    });
  }

  function onDrop(sourceSquare, targetSquare, piece) {
    const gameCopy = { ...game };
    const move = gameCopy.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: piece[1].toLowerCase() ?? "q",
    });
    setGame(gameCopy);
    return move;
  }

  const pieces = [
    "wP",
    "wN",
    "wB",
    "wR",
    "wQ",
    "wK",
    "bP",
    "bN",
    "bB",
    "bR",
    "bQ",
    "bK",
  ];

  const customPieces = useMemo(() => {
    const pieceComponents = {};
    pieces.forEach((piece) => {
      pieceComponents[piece] = ({ squareWidth }) => (
        <div
          style={{
            width: squareWidth,
            height: squareWidth,
            backgroundImage: `url(/${piece}.png)`,
            backgroundSize: "100%",
          }}
        />
      );
    });
    return pieceComponents;
  }, []);

  return (
    <div style={boardWrapper}>
      <Chessboard
        id="StyledBoard"
        boardOrientation="black"
        position={game.fen()}
        onPieceDrop={onDrop}
        customBoardStyle={{
          borderRadius: "4px",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
        }}
        customDarkSquareStyle={{ backgroundColor: "#779952" }}
        customLightSquareStyle={{ backgroundColor: "#edeed1" }}
        customPieces={customPieces}
      />
      <button
        style={buttonStyle}
        onClick={() => {
          safeGameMutate((game) => {
            game.reset();
          });
        }}
      >
        reset
      </button>
      <button
        style={buttonStyle}
        onClick={() => {
          safeGameMutate((game) => {
            game.undo();
          });
        }}
      >
        undo
      </button>
    </div>
  );
};

///////////////////////////////////
///////// Styled 3D Board /////////
///////////////////////////////////

export const Styled3DBoard = () => {
  const engine = useMemo(() => new Engine(), []);
  const game = useMemo(() => new Chess(), []);

  const [gamePosition, setGamePosition] = useState(game.fen());

  function findBestMove() {
    engine.evaluatePosition(game.fen());

    engine.onMessage(({ bestMove }) => {
      if (bestMove) {
        game.move({
          from: bestMove.substring(0, 2),
          to: bestMove.substring(2, 4),
          promotion: bestMove.substring(4, 5),
        });

        setGamePosition(game.fen());
      }
    });
  }

  function onDrop(sourceSquare, targetSquare, piece) {
    const move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: piece[1].toLowerCase() ?? "q",
    });
    setGamePosition(game.fen());

    // illegal move
    if (move === null) return false;

    // exit if the game is over
    if (game.game_over() || game.in_draw()) return false;

    findBestMove();

    return true;
  }

  const [activeSquare, setActiveSquare] = useState("");

  const threeDPieces = useMemo(() => {
    const pieces = [
      { piece: "wP", pieceHeight: 1 },
      { piece: "wN", pieceHeight: 1.2 },
      { piece: "wB", pieceHeight: 1.2 },
      { piece: "wR", pieceHeight: 1.2 },
      { piece: "wQ", pieceHeight: 1.5 },
      { piece: "wK", pieceHeight: 1.6 },
      { piece: "bP", pieceHeight: 1 },
      { piece: "bN", pieceHeight: 1.2 },
      { piece: "bB", pieceHeight: 1.2 },
      { piece: "bR", pieceHeight: 1.2 },
      { piece: "bQ", pieceHeight: 1.5 },
      { piece: "bK", pieceHeight: 1.6 },
    ];

    const pieceComponents = {};
    pieces.forEach(({ piece, pieceHeight }) => {
      pieceComponents[piece] = ({ squareWidth, square }) => (
        <div
          style={{
            width: squareWidth,
            height: squareWidth,
            position: "relative",
            pointerEvents: "none",
          }}
        >
          <img
            src={`/3d-pieces/${piece}.webp`}
            width={squareWidth}
            height={pieceHeight * squareWidth}
            style={{
              position: "absolute",
              bottom: `${0.2 * squareWidth}px`,
              objectFit: piece[1] === "K" ? "contain" : "cover",
            }}
          />
        </div>
      );
    });
    return pieceComponents;
  }, []);

  return (
    <div style={boardWrapper}>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <button
          style={buttonStyle}
          onClick={() => {
            game.reset();
            setGamePosition(game.fen());
          }}
        >
          Reset
        </button>
        <button
          style={buttonStyle}
          onClick={() => {
            game.undo();
            game.undo();
            setGamePosition(game.fen());
          }}
        >
          Undo
        </button>
      </div>
      <Chessboard
        id="Styled3DBoard"
        position={gamePosition}
        onPieceDrop={onDrop}
        customBoardStyle={{
          transform: "rotateX(27.5deg)",
          transformOrigin: "center",
          border: "16px solid #b8836f",
          borderStyle: "outset",
          borderRightColor: " #b27c67",
          borderRadius: "4px",
          boxShadow: "rgba(0, 0, 0, 0.5) 2px 24px 24px 8px",
          borderRightWidth: "2px",
          borderLeftWidth: "2px",
          borderTopWidth: "0px",
          borderBottomWidth: "18px",
          borderTopLeftRadius: "8px",
          borderTopRightRadius: "8px",
          padding: "8px 8px 12px",
          background: "#e0c094",
          backgroundImage: 'url("wood-pattern.png")',
          backgroundSize: "cover",
        }}
        customPieces={threeDPieces}
        customLightSquareStyle={{
          backgroundColor: "#e0c094",
          backgroundImage: 'url("wood-pattern.png")',
          backgroundSize: "cover",
        }}
        customDarkSquareStyle={{
          backgroundColor: "#865745",
          backgroundImage: 'url("wood-pattern.png")',
          backgroundSize: "cover",
        }}
        animationDuration={500}
        customSquareStyles={{
          [activeSquare]: {
            boxShadow: "inset 0 0 1px 6px rgba(255,255,255,0.75)",
          },
        }}
        onMouseOverSquare={(sq) => setActiveSquare(sq)}
        onMouseOutSquare={(sq) => setActiveSquare("")}
      />
    </div>
  );
};

///////////////////////////////////
////////// Custom Square ///////////
///////////////////////////////////
const CustomSquareRenderer = forwardRef<HTMLDivElement, CustomSquareProps>(
  (props, ref) => {
    const { children, square, squareColor, style } = props;

    return (
      <div ref={ref} style={{ ...style, position: "relative" }}>
        {children}
        <div
          style={{
            position: "absolute",
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: 16,
            width: 16,
            borderTopLeftRadius: 6,
            backgroundColor: squareColor === "black" ? "#064e3b" : "#312e81",
            color: "#fff",
            fontSize: 14,
          }}
        >
          {square}
        </div>
      </div>
    );
  }
);

export const CustomSquare = () => {
  // Defined outside

  // const CustomSquareRenderer = forwardRef<HTMLDivElement, CustomSquareProps>((props, ref) => {
  //   const { children, square, squareColor, style } = props;

  //   return (
  //     <div ref={ref} style={{ ...style, position: "relative" }}>
  //       {children}
  //       <div
  //         style={{
  //           position: "absolute",
  //           right: 0,
  //           bottom: 0,
  //           display: "flex",
  //           alignItems: "center",
  //           justifyContent: "center",
  //           height: 16,
  //           width: 16,
  //           borderTopLeftRadius: 6,
  //           backgroundColor: squareColor === "black" ? "#064e3b" : "#312e81",
  //           color: "#fff",
  //           fontSize: 14,
  //         }}
  //       >
  //         {square}
  //       </div>
  //     </div>
  //   );
  // });

  return (
    <div style={boardWrapper}>
      <Chessboard
        id="CustomSquare"
        customSquare={CustomSquareRenderer}
        showBoardNotation={false}
      />
    </div>
  );
};

//////////////////////////////////
////////// AnalysisBoard //////////
///////////////////////////////////

export const AnalysisBoard = () => {
  const engine = useMemo(() => new Engine(), []);
  const game = useMemo(() => new Chess(), []);
  const inputRef = useRef<HTMLInputElement>();
  const [chessBoardPosition, setChessBoardPosition] = useState(game.fen());
  const [positionEvaluation, setPositionEvaluation] = useState(0);
  const [depth, setDepth] = useState(10);
  const [bestLine, setBestline] = useState("");
  const [possibleMate, setPossibleMate] = useState("");

  function findBestMove() {
    engine.evaluatePosition(chessBoardPosition, 18);

    engine.onMessage(({ positionEvaluation, possibleMate, pv, depth }) => {
      if (depth < 10) return;

      positionEvaluation &&
        setPositionEvaluation(
          ((game.turn() === "w" ? 1 : -1) * Number(positionEvaluation)) / 100
        );
      possibleMate && setPossibleMate(possibleMate);
      depth && setDepth(depth);
      pv && setBestline(pv);
    });
  }

  function onDrop(sourceSquare, targetSquare, piece) {
    const move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: piece[1].toLowerCase() ?? "q",
    });
    setPossibleMate("");
    setChessBoardPosition(game.fen());

    // illegal move
    if (move === null) return false;

    engine.stop();
    setBestline("");

    if (game.game_over() || game.in_draw()) return false;

    return true;
  }

  useEffect(() => {
    if (!game.game_over() || game.in_draw()) {
      findBestMove();
    }
  }, [chessBoardPosition]);

  const bestMove = bestLine?.split(" ")?.[0];
  const handleFenInputChange = (e) => {
    const { valid } = game.validate_fen(e.target.value);

    if (valid) {
      inputRef.current.value = e.target.value;
      game.load(e.target.value);
      setChessBoardPosition(game.fen());
    }
  };
  return (
    <div style={boardWrapper}>
      <h4>
        Position Evaluation:{" "}
        {possibleMate ? `#${possibleMate}` : positionEvaluation}
        {"; "}
        Depth: {depth}
      </h4>
      <h5>
        Best line: <i>{bestLine.slice(0, 40)}</i> ...
      </h5>
      <input
        ref={inputRef}
        style={{ ...inputStyle, width: "90%" }}
        onChange={handleFenInputChange}
        placeholder="Paste FEN to start analysing custom position"
      />
      <Chessboard
        id="AnalysisBoard"
        position={chessBoardPosition}
        onPieceDrop={onDrop}
        customBoardStyle={{
          borderRadius: "4px",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
        }}
        customArrows={
          bestMove && [
            [
              bestMove.substring(0, 2) as Square,
              bestMove.substring(2, 4) as Square,
              "rgb(0, 128, 0)",
            ],
          ]
        }
      />
      <button
        style={buttonStyle}
        onClick={() => {
          setPossibleMate("");
          setBestline("");
          game.reset();
          setChessBoardPosition(game.fen());
        }}
      >
        reset
      </button>
      <button
        style={buttonStyle}
        onClick={() => {
          setPossibleMate("");
          setBestline("");
          game.undo();
          setChessBoardPosition(game.fen());
        }}
      >
        undo
      </button>
    </div>
  );
};

export const BoardWithCustomArrows = () => {
  const colorVariants = [
    "darkred",
    "#48AD7E",
    "rgb(245, 192, 0)",
    "#093A3E",
    "#F75590",
    "#F3752B",
    "#058ED9",
  ];
  const [activeColor, setActiveColor] = useState(colorVariants[0]);
  return (
    <div style={boardWrapper}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div>Choose arrow color</div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {colorVariants.map((color) => (
            <div
              style={{
                width: "24px",
                height: "24px",
                background: color,
                borderRadius: "50%",
                cursor: "pointer",
                margin: "16px 6px",
                transform: color === activeColor ? "scale(1.5)" : "none",
                transition: "all 0.15s ease-in",
              }}
              onClick={() => setActiveColor(color)}
            />
          ))}
        </div>
      </div>
      <Chessboard
        id="BoardWithCustomArrows"
        customArrows={[
          ["a2", "a3", colorVariants[0]],
          ["b2", "b4", colorVariants[1]],
          ["c2", "c5", colorVariants[2]],
        ]}
        customArrowColor={activeColor}
        onArrowsChange={console.log}
      />
    </div>
  );
};

// TODO: REMOVE THIS TEST BOARD EXAMPLE

// this array generated by ChatGPT
const FAMOUS_CHESS_POSITIONS = [
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", // Starting Position
  "r1bqkb1r/ppp2ppp/2n2n2/3pp3/2B1P3/2NP1N2/PPP2PPP/R1BQ1RK1 b kq - 4 7", // The Immortal Game
  "rnbq1rk1/pp2bppp/2p1pn2/3p4/2PP4/2N2N2/PP2PPPP/R1BQKB1R w KQ - 4 7", // The Evergreen Game
  "8/8/5K1k/8/8/8/8/8 w - - 0 1", // The Immortal Zugzwang Game
  "rnbqkbnr/pp1ppppp/8/2p5/2B1P3/8/PPP2PPP/RNBQK1NR w KQkq c6 0 4", // Deep Blue vs. Kasparov Game 6
  "rnbq1rk1/pp3ppp/2p5/3pP3/3P4/3B1N2/PPP2PPP/R1BQ1RK1 w - - 2 10", // The Game of the Century
  "rnbqkb1r/pp3ppp/2p1pn2/3p4/2B1P3/5N2/PPP2PPP/RN1QK2R w KQkq - 4 7", // The Opera Game
  "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1", // Sicilian Defense
  "rnbqkb1r/pppppppp/5n2/8/4P3/8/PPP2PPP/RNBQKBNR w KQkq - 0 3", // Queen's Gambit Declined
  "rnbqk1nr/pp2bppp/3p4/2pPp3/2B1P3/2P5/PP3PPP/RNBQK1NR b KQkq - 0 6", // Ruy Lopez
  "r1bqkbnr/pppp1ppp/2n2P2/8/4P3/8/PPP2PPP/RNBQKBNR b KQkq - 0 4", // Fried Liver Attack
  "2r3k1/1p4pp/p2R4/4P3/5P2/6P1/P1b2K1P/8 w - - 0 1", // King and Pawn vs. King and Bishop
  "1rb4k/ppp2R1p/4p1p1/8/4P3/8/PPP2PPP/RNBQKBNR w KQ - 2 10", // Anastasia's Mate
  "3r1rk1/2pqppbp/1p1n1np1/2pP4/4P3/1NN1B3/PPP2PPP/R2Q1RK1 w - - 0 15", // Kasparov vs. Topalov, 1999
  "r1bqkbnr/ppp2ppp/2n1p3/3p4/2B1P3/2N2N2/PPP2PPP/R1BQ1RK1 b kq - 2 6", // Caro-Kann Defense
  "rnbqkb1r/ppp1pppp/5n2/8/4p3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 4", // Scandinavian Defense
  "r2qkb1r/pppb1ppp/2n1pn2/3p4/3P4/2N2N2/PPP1BPPP/R1BQK2R w KQkq - 2 8", // Sicilian Dragon
  "rnbqk2r/pppp1ppp/5n2/8/3P4/8/PPP2PPP/RNBQKBNR b KQkq d3 0 3", // Alekhine's Defense
  "r1bq1rk1/pp2ppbp/2n1pn2/3p4/2PP4/2N1PN2/PP2BPPP/R1BQK2R w KQ - 5 8", // King's Indian Defense
  "rnbqkb1r/pppp1ppp/5n2/4p3/4P3/5N2/PPP2PPP/RNBQKB1R w KQkq - 0 4", // Pirc Defense
  "rnbqkb1r/pppp1ppp/4pn2/5B2/4P3/8/PPPP1PPP/RN1QK1NR b KQkq - 1 4", // Grünfeld Defense
  "rnb1k2r/pp1p1ppp/1b1qpn2/2p5/4P3/2N2N2/PPPP1PPP/R1BQKB1R w KQkq - 0 1",
  "rnbqkb1r/ppp1pp1p/5np1/3p4/2PP4/1QN5/PP2PPPP/R1B1KBNR b KQkq - 0 1",
  "8/bB6/P2k4/3P4/4K3/8/8/8 w - - 0 1",
  "6k1/8/6PP/5K2/2B5/2b5/8/8 b - - 0 1",
  "8/5P2/3K4/8/8/1k6/8/q7 w - - 0 1",
  "8/8/8/7k/3p2p1/3P4/6KP/8 b - - 0 1",
  "rnbqk2r/ppppp1bp/5np1/5p2/2PP4/5NP1/PP2PPBP/RNBQK2R b KQkq - 0 1",
];

export const TestBoard = () => {
  const [index, setPos] = useState(0);
  const [orientation, setOrientation] = useState<BoardOrientation>("white");

  const handleClick = () => {
    setPos(Math.floor(Math.random() * FAMOUS_CHESS_POSITIONS.length));
    setOrientation(orientation === "white" ? "black" : "white");
  };

  return (
    <div style={boardWrapper}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <button onClick={handleClick}>Change position and rotate</button>
        <span style={{ whiteSpace: "nowrap" }}>
          {FAMOUS_CHESS_POSITIONS[index]}
        </span>
      </div>
      <Chessboard
        id="TestBoard"
        position={FAMOUS_CHESS_POSITIONS[index]}
        boardOrientation={orientation}
        animationDuration={750}
      />
    </div>
  );
};
