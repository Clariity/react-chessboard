import { useState, useEffect } from "react";
import { Square } from "../types";

type Arrow = [Square, Square, string?];
type Arrows = Arrow[];

const toSet = (arrows: Arrows) =>
  new Set(arrows?.map((arrow) => arrow.join(",")));
const toArray = (arrowsSet: Set<string>): Arrows =>
  Array.from(arrowsSet).map((arrow) => arrow.split(",")) as Arrows;

export const useArrows = (
  customArrows?: Arrows,
  areArrowsAllowed: boolean = true,
  onArrowsChange?: (arrows: Arrows) => void,
  customArrowColor?: string
) => {
  // arrows passed from outside as a prop
  const [customArrowsSet, setCustomArrows] = useState(new Set<string>());

  // current arrows
  const [arrows, setArrows] = useState(new Set<string>());

  // arrow which we draw while user dragging mouse
  const [newArrow, setNewArrow] = useState<Arrow>();

  // handle external arrows change
  useEffect(() => {
    if (Array.isArray(customArrows)) {
      setCustomArrows(
        //filter out arrows which starts and ends in the same square
        toSet(customArrows?.filter((arrow) => arrow[0] !== arrow[1]))
      );
    }
  }, [customArrows]);

  // callback when new arrows are set
  useEffect(() => {
    onArrowsChange?.(toArray(arrows));
  }, [arrows]);

  function clearArrows() {
    setArrows(new Set());
    setNewArrow(undefined);
  }

  const removeArrow = (fromSquare: Square, toSquare: Square) => {
    let removedArrow;
    const arrowsArray = Array.from(arrows);
    for (const [i] of arrowsArray.entries()) {
      if (arrowsArray[i][0] === fromSquare && arrowsArray[i][1] === toSquare) {
        setArrows((oldArrows) => {
          const newArrows = [...oldArrows];
          newArrows.splice(i, 1);
          return new Set(newArrows);
        });
        removedArrow = [fromSquare, toSquare];
      }
    }

    return Boolean(removedArrow);
  };

  const drawNewArrow = (fromSquare: Square, toSquare: Square) => {
    if (!areArrowsAllowed) return;

    setNewArrow([fromSquare, toSquare, customArrowColor]);
  };

  const onArrowDrawEnd = (fromSquare: Square, toSquare: Square) => {
    if (fromSquare === toSquare) return;
    // remove it if we already have same arrow in arrows set
    const newArrow = `${fromSquare},${toSquare},${customArrowColor}`;
    const arrowsSet = new Set(arrows);
    if (arrowsSet.has(newArrow)) {
      arrowsSet.delete(newArrow);
    } // add to arrows set  new arrow
    else {
      arrowsSet.add(newArrow);
    }

    setNewArrow(undefined);
    setArrows(arrowsSet);
  };

  return {
    arrows: toArray(new Set([...arrows, ...customArrowsSet])),
    newArrow,
    clearArrows,
    removeArrow,
    drawNewArrow,
    setArrows,
    onArrowDrawEnd,
  };
};
