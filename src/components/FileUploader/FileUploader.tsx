import styles from "./FileUploader.module.css";
import { useRef, useState } from "react";
import { BiImport, BiExport } from "react-icons/bi";
import { FiFilePlus, FiFolderPlus } from "react-icons/fi";
import { useFileSystem } from "../../contexts/FileSystemContext";

export default function FileUploader() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [isDragging, setIsDragging] = useState(false);
  const { setRawFile } = useFileSystem();

  // 파일 등록
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.name.endsWith(".zip")) {
      setRawFile(file);
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
      />
      <div className={styles.buttonContainer}>
        <button className={styles.fileUploaderButton} onClick={openFileDialog}>
          <FiFilePlus />
        </button>
        <button className={styles.fileUploaderButton}>
          <FiFolderPlus />
        </button>
        <button className={styles.fileUploaderButton}>
          <BiImport />
        </button>
        <button
          className={`${styles.fileUploaderButton} ${styles.exportButton} ${styles.disabled}`}
          disabled={true}
        >
          <BiExport />
        </button>
      </div>
    </div>
  );
}
