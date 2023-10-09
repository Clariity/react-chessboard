import React, { forwardRef, useEffect, useRef, useState, useMemo } from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import Chess from "chess.js";

import { Chessboard, ClearPremoves } from "../src";
import { CustomSquareProps, Square } from "../src/chessboard/types";
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

      setTimeout(makeRandomMove, 300);
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
      setTimeout(makeRandomMove, 300);
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
        animationDuration={200}
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
        allowDragOutsideBoard={false}
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
