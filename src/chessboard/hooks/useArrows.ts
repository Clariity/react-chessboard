import { useState, useEffect } from "react";
import { Square } from "../types";

type Arrow = Square[];
type Arrows = Arrow[];

const toSet = (arrows: Arrows) =>
  new Set(arrows?.map((arrow) => arrow.join(",")));
const toArray = (arrowsSet: Set<string>): Arrows =>
  Array.from(arrowsSet).map((arrow) => arrow.split(",")) as Arrows;

export const useArrows = (
  customArrows?: Arrows,
  areArrowsAllowed: boolean = true,
  onArrowsChange?: (arrows: Arrows) => void
) => {
  // current arrows
  const [arrows, setArrows] = useState(new Set<string>());

  // arrow which we draw while user dragging mouse
  const [newArrow, setNewArrow] = useState<Arrow>();

  const [hasDrawnArrowOnDrag, setHasDrawnArrowOnDrag] = useState(false);

  // handle external arrows change
  useEffect(() => {
    if (customArrows && (customArrows.length !== 0 || arrows.size > 0)) {
      setArrows(toSet(customArrows));
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
    if (fromSquare === toSquare) {
      setNewArrow(undefined)
    } else {
      setHasDrawnArrowOnDrag(true)
      setNewArrow([fromSquare, toSquare]);
    }
  };

  const onArrowDrawEnd = (fromSquare: Square, toSquare: Square) => {
    setHasDrawnArrowOnDrag(false)
    if (fromSquare === toSquare) return;
    // remove it if we already have same arrow in arrows set
    const newArrow = `${fromSquare},${toSquare}`;
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
    arrows: toArray(arrows),
    newArrow,
    hasDrawnArrowOnDrag,
    clearArrows,
    removeArrow,
    drawNewArrow,
    setArrows,
    onArrowDrawEnd,
  };
};
