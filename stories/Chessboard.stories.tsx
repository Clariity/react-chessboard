import React, { forwardRef, useRef, useState, useEffect } from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import Chess from "chess.js";

import { Chessboard, ClearPremoves } from "../src";
import { CustomSquareProps } from "../src/chessboard/types";
import { useChessGame } from "../src/chessboard/hooks/useChessGame";
import { usePromotion, Move } from "../src/chessboard/hooks/usePromotion";
import { Piece, Square } from "../src/chessboard/types";

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

const boardWrapper = {
  width: `70vw`,
  maxWidth: "70vh",
  margin: "3rem auto",
};
const pieceObjectToPieceNotation = (pieceObject: {
  type: string;
  color: "w" | "b";
}): Piece => {
  if (!pieceObject) return;
  return (pieceObject.color + pieceObject.type.toUpperCase()) as Piece;
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
  const [game, setGame] = useState(new Chess("8/PPP5/2KP4/8/8/4p1k1/5ppp/8 w - - 0 1"));
  function onMakeMove({ from, to, promotion }: Move): boolean {
    const gameCopy = { ...game };
    const move = gameCopy.move({ from, to, promotion });
    setGame(gameCopy);

    // illegal move
    if (move === null) return false;

    // legal move
    return true;
  }

  const { handleMoveWithPossiblePromotion, promotion } = usePromotion({
    onMakeMove,
  });

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
    if (game.game_over() || game.in_draw() || possibleMoves.length === 0) return;

    const randomIndex = Math.floor(Math.random() * possibleMoves.length);
    safeGameMutate((game) => {
      game.move(possibleMoves[randomIndex]);
    });
  }

  function onDrop(sourceSquare, targetSquare) {
    const pieceObject = game.get(sourceSquare);
    const { status: moveStatus } = handleMoveWithPossiblePromotion({
      from: sourceSquare,
      to: targetSquare,
      piece: pieceObjectToPieceNotation(pieceObject),
    });

    return moveStatus === "success";
  }

  useEffect(() => {
    if (game.turn() === "b") {
      // store timeout so it can be cleared on undo/reset so computer doesn't execute move
      const newTimeout = setTimeout(makeRandomMove, 200);
      setCurrentTimeout(newTimeout);
    }
  }, [game.turn()]);

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
        promotion={promotion}
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

//////////////////////////////////
////////// ClickToMove ///////////
//////////////////////////////////
export const ClickToMove = () => {
  const [game, setGame] = useState(new Chess("8/PPP5/2KP4/8/8/4p1k1/5ppp/8 b - - 0 1"));
  function onMakeMove({ from, to, promotion }: Move): boolean {
    const gameCopy = { ...game };
    const move = gameCopy.move({ from, to, promotion });
    setGame(gameCopy);

    // illegal move
    if (move === null) return false;

    // legal move
    return true;
  }

  const { handleMoveWithPossiblePromotion, promotion } = usePromotion({
    onMakeMove,
  });

  const [moveFrom, setMoveFrom] = useState<Square | undefined>(undefined);
  const [rightClickedSquares, setRightClickedSquares] = useState({});
  const [moveSquares, setMoveSquares] = useState({});
  const [optionSquares, setOptionSquares] = useState({});
  function getMoveOptions(square) {
    const moves = game.moves({
      square,
      verbose: true,
    });
    if (moves.length === 0) {
      setOptionSquares({});
      return;
    }

    const newSquares = {};
    moves.map((move) => {
      newSquares[move.to] = {
        background:
          game.get(move.to) && game.get(move.to).color !== game.get(square).color
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
  }

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
    if (game.game_over() || game.in_draw() || possibleMoves.length === 0) return;

    const randomIndex = Math.floor(Math.random() * possibleMoves.length);
    safeGameMutate((game) => {
      game.move(possibleMoves[randomIndex]);
    });
  }

  function onSquareClick(square) {
    setRightClickedSquares({});

    function resetFirstMove(square) {
      setMoveFrom(square);
      getMoveOptions(square);
    }

    // from square
    if (!moveFrom) {
      resetFirstMove(square);
      return;
    }

    if (moveFrom === square) {
      setMoveFrom(undefined);
      setOptionSquares({});
      return;
    }
    // attempt to make move
    const pieceObject = game.get(moveFrom);
    const { status } = handleMoveWithPossiblePromotion({
      from: moveFrom,
      to: square,
      piece: pieceObjectToPieceNotation(pieceObject),
    });

    if (status === "illegal move") {
      resetFirstMove(square);
      return;
    }
  }

  useEffect(() => {
    if (game.turn() === "w") {
      setTimeout(makeRandomMove, 300);
      setMoveFrom(undefined);
      setOptionSquares({});
    }
  }, [game.turn()]);

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
        promotion={promotion}
        customBoardStyle={{
          borderRadius: "4px",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
        }}
        customSquareStyles={{
          ...moveSquares,
          ...optionSquares,
          ...rightClickedSquares,
        }}
      />
      <button
        style={buttonStyle}
        onClick={() => {
          safeGameMutate((game) => {
            game.reset();
          });
          setMoveSquares({});
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
  const [game, setGame] = useState(new Chess("8/PPP5/2KP4/8/8/4p1k1/5ppp/8 w - - 0 1"));
  const [currentTimeout, setCurrentTimeout] = useState<NodeJS.Timeout>();
  const chessboardRef = useRef<ClearPremoves>(null);

  function onMakeMove({ from, to, promotion }: Move): boolean {
    const gameCopy = { ...game };
    const move = gameCopy.move({ from, to, promotion });
    setGame(gameCopy);

    // illegal move
    if (move === null) return false;

    // legal move
    return true;
  }

  const { handleMoveWithPossiblePromotion, promotion } = usePromotion({
    onMakeMove,
  });
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
    if (game.game_over() || game.in_draw() || possibleMoves.length === 0) return;

    const randomIndex = Math.floor(Math.random() * possibleMoves.length);
    safeGameMutate((game) => {
      game.move(possibleMoves[randomIndex]);
    });
  }

  function onDrop(sourceSquare, targetSquare) {
    const pieceObject = game.get(sourceSquare);
    const { status } = handleMoveWithPossiblePromotion({
      from: sourceSquare,
      to: targetSquare,
      piece: pieceObjectToPieceNotation(pieceObject),
    });

    // illegal move
    if (status === "illegal move") return false;

    // store timeout so it can be cleared on undo/reset so computer doesn't execute move

    return true;
  }

  useEffect(() => {
    if (game.turn() === "b") {
      const newTimeout = setTimeout(makeRandomMove, 2000);
      setCurrentTimeout(newTimeout);
    }
  }, [game.turn()]);

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
        promotion={promotion}
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

  function onDrop(sourceSquare, targetSquare) {
    const gameCopy = { ...game };
    const move = gameCopy.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q", // always promote to a queen for example simplicity
    });
    setGame(gameCopy);
    return move;
  }

  const pieces = ["wP", "wN", "wB", "wR", "wQ", "wK", "bP", "bN", "bB", "bR", "bQ", "bK"];
  const customPieces = () => {
    const returnPieces = {};
    pieces.map((p) => {
      returnPieces[p] = ({ squareWidth }) => (
        <div
          style={{
            width: squareWidth,
            height: squareWidth,
            backgroundImage: `url(/${p}.png)`,
            backgroundSize: "100%",
          }}
        />
      );
      return null;
    });
    return returnPieces;
  };

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
        customPieces={customPieces()}
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
      <Chessboard id="CustomSquare" customSquare={CustomSquareRenderer} />
    </div>
  );
};
