import React, { useState } from "react";
import { useFileSystem } from "../../contexts/FileSystemContext";
import {
  createNewFile,
  updateFileTreeRecursively,
} from "../../utils/fileTree/fileCreateUtils";
import styles from "./FileInput.module.css";

interface FileInputProps {
  parentPath: string;
}

export default function FileInput({ parentPath }: FileInputProps) {
  const { setFileTree, setIsCreatingFile } = useFileSystem();
  const [newFileName, setNewFileName] = useState("");

  const handleCreateFile = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newFileName.trim()) {
      const newFile = createNewFile(newFileName.trim(), parentPath);
      setFileTree((prev) =>
        updateFileTreeRecursively(prev, parentPath, newFile)
      );
      setNewFileName("");
      setIsCreatingFile(false);
    } else if (e.key === "Escape") {
      setNewFileName("");
      setIsCreatingFile(false);
    }
  };

  return (
    <div className={styles.newFileInput}>
      <input
        type="text"
        value={newFileName}
        onChange={(e) => setNewFileName(e.target.value)}
        onKeyDown={handleCreateFile}
        autoFocus
      />
    </div>
  );
}
