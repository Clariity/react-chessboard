import { PropsWithChildren } from "react";

import { errorImage } from "../media/error";

type ErrorBoundaryProps = PropsWithChildren;

export function ErrorBoundary({ children }: ErrorBoundaryProps) {
  try {
    return <>{children}</>;
  } catch (error) {
    console.log(error);
    return <WhiteKing showError={true} />;
  }
}

export function WhiteKing({ showError = false }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          width: 250,
          height: 250,
          transform: "rotate(90deg)",
        }}
      >
        {errorImage.whiteKing}
      </div>
      {showError && <h1>Something went wrong</h1>}
    </div>
  );
}
