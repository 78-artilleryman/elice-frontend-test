import React, { useState } from "react";
import { useFileSystem } from "../../contexts/FileSystemContext";

import styles from "./FileInput.module.css";

import { createNewFolder } from "../../utils/fileTree/folderCreateUtils";
import {
  createNewFile,
  updateFileTreeRecursively,
} from "../../utils/fileTree/fileCreateUtils";

interface FileInputProps {
  parentPath: string;
  type: "file" | "folder";
}

export default function FileInput({ parentPath, type }: FileInputProps) {
  const { setFileTree, setIsCreatingFile, setIsCreatingFolder } =
    useFileSystem();
  const [newName, setNewName] = useState("");

  const handleCreate = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newName.trim()) {
      const newItem =
        type === "file"
          ? createNewFile(newName.trim(), parentPath)
          : createNewFolder(newName.trim(), parentPath);

      setFileTree((prev) =>
        updateFileTreeRecursively(prev, parentPath, newItem)
      );
      setNewName("");
      if (type === "file") {
        setIsCreatingFile(false);
      } else {
        setIsCreatingFolder(false);
      }
    } else if (e.key === "Escape") {
      setNewName("");
      if (type === "file") {
        setIsCreatingFile(false);
      } else {
        setIsCreatingFolder(false);
      }
    }
  };

  return (
    <div className={styles.newFileInput}>
      <input
        type="text"
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
        onKeyDown={handleCreate}
        placeholder={`새 ${type === "file" ? "파일" : "폴더"} 이름 입력`}
        autoFocus
      />
    </div>
  );
}
