import React, { createContext, useContext, useState } from "react";

type FileSystemContextType = {
  rawFile: File | null;
  setRawFile: React.Dispatch<React.SetStateAction<File | null>>;
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

  return (
    <FileSystemContext.Provider
      value={{
        rawFile,
        setRawFile,
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
