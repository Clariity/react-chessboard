import { useDroppable } from "@dnd-kit/core";

type Props = {
  children?: React.ReactNode;
  id: string;
  isLightSquare: boolean;
  column: string;
  row: string;
  darkSquareColor: string;
  lightSquareColor: string;
};

export function Cell({
  children,
  id,
  isLightSquare,
  column,
  row,
  darkSquareColor,
  lightSquareColor,
}: Props) {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        aspectRatio: "1/1",
        backgroundColor: isLightSquare ? lightSquareColor : darkSquareColor,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        border: isOver ? "1px solid black" : "",
      }}
      data-column={column}
      data-row={row}
    >
      {row === "1" && (
        <span style={{ position: "absolute", bottom: 1, right: 4, fontSize: "13px" }}>
          {column}
        </span>
      )}
      {column === "a" && (
        <span style={{ position: "absolute", top: 2, left: 2, fontSize: "13px" }}>
          {row}
        </span>
      )}
      {children}
    </div>
  );
}
