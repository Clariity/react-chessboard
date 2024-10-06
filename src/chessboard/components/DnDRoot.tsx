import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
  FC,
} from "react";
import { DndProvider } from "react-dnd";
import { BackendFactory } from "dnd-core";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { ChessboardDnDProviderProps } from "../types";

const ChessboardDnDContext = createContext({ isCustomDndProviderSet: false });

const EmptyProvider: FC<{ children: ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

type ChessboardDnDRootProps = {
  customDndBackend?: BackendFactory;
  customDndBackendOptions: unknown;
  children: ReactNode;
};

export const ChessboardDnDProvider: FC<ChessboardDnDProviderProps> = ({
  children,
  backend,
  context,
  options,
  debugMode,
}) => {
  return (
    <ChessboardDnDContext.Provider value={{ isCustomDndProviderSet: true }}>
      <DndProvider
        backend={
          backend || ("ontouchstart" in window ? TouchBackend : HTML5Backend)
        }
        context={context}
        options={options}
        debugMode={debugMode ?? false}
      >
        {children}
      </DndProvider>
    </ChessboardDnDContext.Provider>
  );
};

export const ChessboardDnDRoot: FC<ChessboardDnDRootProps> = ({
  customDndBackend,
  customDndBackendOptions,
  children,
}) => {
  const [clientWindow, setClientWindow] = useState<Window>();
  const [backendSet, setBackendSet] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { isCustomDndProviderSet } = useContext(ChessboardDnDContext);

  useEffect(() => {
    setIsMobile("ontouchstart" in window);
    setBackendSet(true);
    setClientWindow(window);
  }, []);

  // in case we already wrapped `<Chessboard/>`  with `<DnDProvider/>` we don't need to create a new one
  const DnDWrapper = isCustomDndProviderSet ? EmptyProvider : DndProvider;

  if (!backendSet) {
    return null;
  }

  return clientWindow ? (
    <DnDWrapper
      backend={customDndBackend || (isMobile ? TouchBackend : HTML5Backend)}
      context={clientWindow}
      options={customDndBackend ? customDndBackendOptions : undefined}
    >
      {children}
    </DnDWrapper>
  ) : (
    <>{children}</>
  );
};
