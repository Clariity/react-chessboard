import { useState, useRef, CSSProperties } from "react";

export const ResizableButton = ({
  initialBoardWidth,
  boardContainer,
  setBoardWidth,
}: any) => {
  const squareWidth = initialBoardWidth / 8;
  const [buttonStyle, setButtonStyle] = useState<CSSProperties>({
    position: "absolute",
    zIndex: "24",
    border: "none",
    outline: "none",
    padding: "0",
    borderRadius: "50%",
    cursor: "nwse-resize",
    background: "transparent",
  });

  const resizeButtonRef = useRef<HTMLButtonElement>(null);

  function calculateResizedDivHeight(e: MouseEvent) {
    setButtonStyle({ ...buttonStyle, background: "#ff980091" });
    const mouseYCoord = e.clientY;
    const mouseXCoord = e.clientX;
    setBoardWidth(
      Math.max(
        mouseYCoord - boardContainer.top,
        mouseXCoord - boardContainer.left
      )
    );
  }

  function stopResize() {
    setButtonStyle({ ...buttonStyle, background: "transparent" });
    window.removeEventListener("mousemove", calculateResizedDivHeight, false);
    window.removeEventListener("mouseup", stopResize, false);
  }

  const onResizeBoard = () => {
    window.addEventListener("mousemove", calculateResizedDivHeight, false);
    window.addEventListener("mouseup", stopResize, false);
  };
  return (
    <button
      ref={resizeButtonRef}
      style={{
        ...buttonStyle,
        right: `${-squareWidth / 4}px`,
        bottom: `${-squareWidth / 4}px`,
        width: `${squareWidth / 2}px`,
        height: `${squareWidth / 2}px`,
      }}
      onClick={() => console.log("Clik")}
      onMouseDown={onResizeBoard}
      onMouseOver={() => {
        setButtonStyle({ ...buttonStyle, background: "#ff980091" });
      }}
      onMouseOut={() => {
        setButtonStyle({ ...buttonStyle, background: "transparent" });
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 0.96 0.96"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M.4.8h.4V.4" stroke="#33363F" strokeWidth=".08" />
        <path d="M.48.68h.2v-.2" stroke="#33363F" strokeWidth=".08" />
      </svg>
    </button>
  );
};

export default ResizableButton;
