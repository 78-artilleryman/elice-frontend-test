import React, { useRef } from "react";
import { useFileSystem } from "../../contexts/FileSystemContext";

import styles from "./FileInput.module.css";

import { createNewFolder } from "../../utils/fileTree/folderCreateUtils";
import {
  createNewFile,
  updateFileTreeRecursively,
} from "../../utils/fileTree/fileCreateUtils";

import useOutsideClickClose from "../../hooks/useOutsideClickClose";

interface FileInputProps {
  parentPath: string;
  type: "file" | "folder";
}

export default function FileInput({ parentPath, type }: FileInputProps) {
  const { setFileTree, setIsCreatingFile, setIsCreatingFolder } =
    useFileSystem();
  const inputRef = useRef<HTMLInputElement>(null);

  // 외부 클릭 시 입력창 닫기
  useOutsideClickClose(
    inputRef,
    () => {
      if (type === "file") setIsCreatingFile(false);
      else setIsCreatingFolder(false);
    },
    true
  );

  const handleCreate = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const inputValue = inputRef.current?.value.trim();

    if (e.key === "Enter" && inputValue) {
      const newItem =
        type === "file"
          ? createNewFile(inputValue, parentPath)
          : createNewFolder(inputValue, parentPath);

      setFileTree((prev) =>
        updateFileTreeRecursively(prev, parentPath, newItem)
      );

      if (inputRef.current) {
        inputRef.current.value = ""; // 초기화
      }

      if (type === "file") {
        setIsCreatingFile(false);
      } else {
        setIsCreatingFolder(false);
      }
    } else if (e.key === "Escape") {
      if (inputRef.current) {
        inputRef.current.value = ""; // 초기화
      }

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
        ref={inputRef}
        onKeyDown={handleCreate}
        placeholder={`새 ${type === "file" ? "파일" : "폴더"} 이름 입력`}
        autoFocus
      />
    </div>
  );
}
