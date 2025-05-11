import { useRef } from "react";

import { useFileActionMenu } from "../../contexts/FileActionMenuContext";
import { useFileSystem } from "../../contexts/FileSystemContext";
import { useOpenTabs } from "../../contexts/OpenTabsContext";

import { deleteRecursively } from "../../utils/fileTree/fileDeleteUtils";

import styles from "./FileActionMenu.module.css";
import useOutsideClickClose from "../../hooks/useOutsideClickClose";

export default function FileActionMenu() {
  const { fileActionMenu, setFileActionMenu } = useFileActionMenu();
  const {
    setIsCreatingFile,
    setIsCreatingFolder,
    setSelectedFolderPath,
    setFileTree,
  } = useFileSystem();
  const { openTabs, setOpenTabs, activeTab, setActiveTab } = useOpenTabs();
  const menuRef = useRef<HTMLUListElement>(null);

  // 바깥 클릭/스크롤 시 메뉴 닫기
  useOutsideClickClose(
    menuRef,
    () => setFileActionMenu((prev) => ({ ...prev, visible: false })),
    fileActionMenu.visible
  );

  if (!fileActionMenu.visible) return null;

  // 삭제 유틸 함수
  const handleDelete = () => {
    setFileTree((prev) => deleteRecursively(prev, fileActionMenu.targetPath));
    setFileActionMenu((prev) => ({ ...prev, visible: false }));

    const tabIndex = openTabs.findIndex(
      (t) => t.path === fileActionMenu.targetPath
    );
    const newTabs = openTabs.filter(
      (t) => t.path !== fileActionMenu.targetPath
    );
    setOpenTabs(newTabs);

    if (activeTab === fileActionMenu.targetPath) {
      if (newTabs.length > 0) {
        // 닫힌 탭의 바로 다음 탭을 활성화하거나, 마지막 탭을 닫은 경우 이전 탭을 활성화
        const newActiveIndex =
          tabIndex < newTabs.length ? tabIndex : newTabs.length - 1;
        setActiveTab(newTabs[newActiveIndex].path);
      } else {
        setActiveTab(null);
      }
    }
  };

  const handleCreateFile = () => {
    setIsCreatingFile(true);
    setSelectedFolderPath(fileActionMenu.targetPath);
    setFileActionMenu((prev) => ({ ...prev, visible: false }));
  };

  const handleCreateFolder = () => {
    setIsCreatingFolder(true);
    setSelectedFolderPath(fileActionMenu.targetPath);
    setFileActionMenu((prev) => ({ ...prev, visible: false }));
  };

  return (
    <ul
      className={styles.contextMenu}
      style={{
        position: "fixed",
        left: fileActionMenu.x,
        top: fileActionMenu.y,
        zIndex: 9999,
      }}
      onMouseDown={(e) => e.stopPropagation()}
      ref={menuRef}
    >
      {fileActionMenu.isDirectory && (
        <>
          <li onClick={handleCreateFile}>새 파일 생성</li>
          <li onClick={handleCreateFolder}>새 폴더 생성</li>
        </>
      )}
      <li onClick={handleDelete}>삭제</li>
    </ul>
  );
}
