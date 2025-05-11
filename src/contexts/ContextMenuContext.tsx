import React, { createContext, useContext, useState } from "react";

interface ContextMenuState {
  visible: boolean;
  x: number;
  y: number;
  targetPath: string;
  isDirectory: boolean;
}

const defaultState: ContextMenuState = {
  visible: false,
  x: 0,
  y: 0,
  targetPath: "",
  isDirectory: false,
};

const ContextMenuContext = createContext<{
  contextMenu: ContextMenuState;
  setContextMenu: React.Dispatch<React.SetStateAction<ContextMenuState>>;
}>({
  contextMenu: defaultState,
  setContextMenu: () => {},
});

export function ContextMenuProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [contextMenu, setContextMenu] =
    useState<ContextMenuState>(defaultState);
  return (
    <ContextMenuContext.Provider value={{ contextMenu, setContextMenu }}>
      {children}
    </ContextMenuContext.Provider>
  );
}

export function useContextMenu() {
  const context = useContext(ContextMenuContext);
  if (context === undefined) {
    throw new Error(
      "ContextMenuProvider 내부에서만 useContextMenu를 사용할 수 있습니다."
    );
  }
  return context;
}
