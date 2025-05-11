import { useRef, useState } from "react";

import styles from "./FileUploader.module.css";
import { BiImport, BiExport } from "react-icons/bi";
import { FiFilePlus, FiFolderPlus } from "react-icons/fi";

import { useFileSystem } from "../../contexts/FileSystemContext";
import { downloadFileTreeAsZip, extractZip } from "../../utils/zip";

export default function FileUploader() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [isDragging, setIsDragging] = useState(false);
  const {
    setRawFile,
    setFileTree,
    fileTree,
    rawFile,
    selectedFolderPath,
    setSelectedFolderPath,
    isCreatingFile,
    setIsCreatingFile,
    isCreatingFolder,
    setIsCreatingFolder,
  } = useFileSystem();

  // 파일 등록
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.name.endsWith(".zip")) {
      setRawFile(file);
      const tree = await extractZip(file);
      setFileTree(tree);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  // 드래그 앤 드롭 관련 함수
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith(".zip")) {
      setRawFile(file);
    }
  };

  const handleCreateNewFile = () => {
    // 이미 파일 생성 모드라면 취소
    if (isCreatingFile) {
      setIsCreatingFile(false);
      return;
    }
    // 파일 생성 모드 시작
    setIsCreatingFile(true);
    // 선택된 폴더가 없으면 루트를 선택
    if (!selectedFolderPath) {
      setSelectedFolderPath("/");
    }
  };

  const handleCreateNewFolder = () => {
    // 이미 폴더 생성 모드라면 취소
    if (isCreatingFolder) {
      setIsCreatingFolder(false);
      return;
    }
    // 폴더 생성 모드 시작
    setIsCreatingFolder(true);
    // 선택된 폴더가 없으면 루트를 선택
    if (!selectedFolderPath) {
      setSelectedFolderPath("/");
    }
  };

  return (
    <div
      className={`${styles.container} ${isDragging ? styles.dragging : ""}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept=".zip"
        ref={fileInputRef}
        onChange={handleFileSelect}
        style={{ display: "none" }}
        aria-label="ZIP 파일 선택"
      />
      <div className={styles.buttonContainer}>
        <button
          className={styles.fileUploaderButton}
          onClick={handleCreateNewFile}
          aria-label="새 파일 생성"
        >
          <FiFilePlus />
        </button>
        <button
          className={styles.fileUploaderButton}
          onClick={handleCreateNewFolder}
          aria-label="새 폴더 생성"
        >
          <FiFolderPlus />
        </button>
        <button
          className={styles.fileUploaderButton}
          onClick={openFileDialog}
          aria-label="ZIP 파일 업로드"
        >
          <BiImport />
        </button>
        <button
          className={`${styles.fileUploaderButton} ${styles.exportButton} ${
            !fileTree.length ? styles.disabled : ""
          }`}
          disabled={!fileTree.length}
          onClick={() => {
            if (fileTree.length > 0 && rawFile) {
              downloadFileTreeAsZip(fileTree, rawFile);
            }
          }}
          aria-label="ZIP 파일 다운로드"
        >
          <BiExport />
        </button>
      </div>
    </div>
  );
}
