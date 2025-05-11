import React, { createContext, useContext, useState } from "react";

interface FileActionMenuState {
  visible: boolean;
  x: number;
  y: number;
  targetPath: string;
  isDirectory: boolean;
}

const defaultState: FileActionMenuState = {
  visible: false,
  x: 0,
  y: 0,
  targetPath: "",
  isDirectory: false,
};

const FileActionMenuContext = createContext<{
  fileActionMenu: FileActionMenuState;
  setFileActionMenu: React.Dispatch<React.SetStateAction<FileActionMenuState>>;
}>({
  fileActionMenu: defaultState,
  setFileActionMenu: () => {},
});

export function FileActionMenuProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [fileActionMenu, setFileActionMenu] =
    useState<FileActionMenuState>(defaultState);
  return (
    <FileActionMenuContext.Provider
      value={{ fileActionMenu, setFileActionMenu }}
    >
      {children}
    </FileActionMenuContext.Provider>
  );
}

export function useFileActionMenu() {
  const context = useContext(FileActionMenuContext);
  if (context === undefined) {
    throw new Error(
      "FileActionMenuProvider 내부에서만 useFileActionMenu를 사용할 수 있습니다."
    );
  }
  return context;
}
