import React, { createContext, useContext, useState } from "react";
import type { FileEntry } from "../types/fileTree.type";
type FileSystemContextType = {
  rawFile: File | null;
  setRawFile: React.Dispatch<React.SetStateAction<File | null>>;
  fileTree: FileEntry[];
  setFileTree: React.Dispatch<React.SetStateAction<FileEntry[]>>;
};

const FileSystemContext = createContext<FileSystemContextType | undefined>(
  undefined
);

export function FileSystemProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [rawFile, setRawFile] = useState<File | null>(null);
  const [fileTree, setFileTree] = useState<FileEntry[]>([]);

  console.log(fileTree);

  return (
    <FileSystemContext.Provider
      value={{
        rawFile,
        setRawFile,
        fileTree,
        setFileTree,
      }}
    >
      {children}
    </FileSystemContext.Provider>
  );
}

export function useFileSystem() {
  const context = useContext(FileSystemContext);
  if (context === undefined) {
    throw new Error(
      "FileSystemProvider 내부에서만 useFileSystem을 사용할 수 있습니다."
    );
  }
  return context;
}
