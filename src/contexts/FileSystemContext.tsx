import React, { createContext, useContext, useState } from "react";
import type { FileEntry } from "../types/fileTree.type";

type FileSystemContextType = {
  rawFile: File | null;
  setRawFile: React.Dispatch<React.SetStateAction<File | null>>;
  fileTree: FileEntry[];
  setFileTree: React.Dispatch<React.SetStateAction<FileEntry[]>>;
  updateFileContent: (path: string, newContent: string) => void;
  selectedFolderPath: string;
  setSelectedFolderPath: React.Dispatch<React.SetStateAction<string>>;
  isCreatingFile: boolean;
  setIsCreatingFile: React.Dispatch<React.SetStateAction<boolean>>;
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
  const [selectedFolderPath, setSelectedFolderPath] = useState("");
  const [isCreatingFile, setIsCreatingFile] = useState(false);

  console.log(fileTree);

  const updateFileContent = (path: string, newContent: string) => {
    const updateNodeContent = (nodes: FileEntry[]): FileEntry[] => {
      return nodes.map((node) => {
        if (node.path === path) {
          const blob = new Blob([newContent], { type: "text/plain" });
          const file = new File([blob], node.name, { type: "text/plain" });

          return {
            ...node,
            content: newContent,
            file: file,
          };
        }
        if (node.children) {
          return {
            ...node,
            children: updateNodeContent(node.children),
          };
        }
        return node;
      });
    };

    setFileTree((prevTree) => updateNodeContent(prevTree));
  };

  return (
    <FileSystemContext.Provider
      value={{
        rawFile,
        setRawFile,
        fileTree,
        setFileTree,
        updateFileContent,
        selectedFolderPath,
        setSelectedFolderPath,
        isCreatingFile,
        setIsCreatingFile,
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
