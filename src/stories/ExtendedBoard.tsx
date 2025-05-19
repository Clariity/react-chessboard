import type { StoryObj } from "@storybook/react";
import { useState } from "react";

import { Chessboard } from "..";
import meta from "./Chessboard.stories";
import {
  PositionDataType,
  PieceType,
  PieceDataType,
  PieceDropHandlerArgs,
} from "../types";

type Story = StoryObj<typeof meta>;

export const ExtendedBoard: Story = {
  render: () => {
    const [boardDimensions, setBoardDimensions] = useState<{
      rows: number;
      columns: number;
    }>({
      rows: 12,
      columns: 12,
    });
    const [position, setPosition] = useState<PositionDataType>({
      a1: {
        pieceType: PieceType.wR,
      },
      a2: {
        pieceType: PieceType.wP,
      },
      a3: {
        pieceType: PieceType.wP,
      },
    });

    function onPieceDrop({ sourceSquare, targetSquare, piece }: PieceDropHandlerArgs) {
      const newPosition = { ...position };
      delete newPosition[sourceSquare];
      setPosition({
        ...newPosition,
        [targetSquare]: {
          pieceType: piece.pieceType,
        },
      });
    }

    const chessboardOptions = {
      chessboardRows: boardDimensions.rows,
      chessboardColumns: boardDimensions.columns,
      position,
      onPieceDrop,
    };

    return (
      <>
        <Chessboard options={chessboardOptions} />

        <label>Rows</label>
        <input
          type="number"
          value={boardDimensions.rows}
          onChange={(e) =>
            setBoardDimensions({
              ...boardDimensions,
              rows: parseInt(e.target.value),
            })
          }
        />

        <label>Columns</label>
        <input
          type="number"
          value={boardDimensions.columns}
          onChange={(e) =>
            setBoardDimensions({
              ...boardDimensions,
              columns: parseInt(e.target.value),
            })
          }
        />
      </>
    );
  },
};
