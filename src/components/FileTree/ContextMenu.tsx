import { useRef } from "react";

import { useContextMenu } from "../../contexts/ContextMenuContext";
import { useFileSystem } from "../../contexts/FileSystemContext";
import { useOpenTabs } from "../../contexts/OpenTabsContext";

import { deleteRecursively } from "../../utils/fileTree/fileDeleteUtils";

import styles from "./ContextMenu.module.css";
import useOutsideClickClose from "../../hooks/useOutsideClickClose";

export default function ContextMenu() {
  const { contextMenu, setContextMenu } = useContextMenu();
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
    () => setContextMenu((prev) => ({ ...prev, visible: false })),
    contextMenu.visible
  );

  if (!contextMenu.visible) return null;

  // 삭제 유틸 함수
  const handleDelete = () => {
    setFileTree((prev) => deleteRecursively(prev, contextMenu.targetPath));
    setContextMenu((prev) => ({ ...prev, visible: false }));

    const tabIndex = openTabs.findIndex(
      (t) => t.path === contextMenu.targetPath
    );
    const newTabs = openTabs.filter((t) => t.path !== contextMenu.targetPath);
    setOpenTabs(newTabs);

    if (activeTab === contextMenu.targetPath) {
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
    setSelectedFolderPath(contextMenu.targetPath);
    setContextMenu((prev) => ({ ...prev, visible: false }));
  };

  const handleCreateFolder = () => {
    setIsCreatingFolder(true);
    setSelectedFolderPath(contextMenu.targetPath);
    setContextMenu((prev) => ({ ...prev, visible: false }));
  };

  return (
    <ul
      className={styles.contextMenu}
      style={{
        position: "fixed",
        left: contextMenu.x,
        top: contextMenu.y,
        zIndex: 9999,
      }}
      onMouseDown={(e) => e.stopPropagation()}
      ref={menuRef}
    >
      {contextMenu.isDirectory && (
        <>
          <li onClick={handleCreateFile}>새 파일 생성</li>
          <li onClick={handleCreateFolder}>새 폴더 생성</li>
        </>
      )}
      <li onClick={handleDelete}>삭제</li>
    </ul>
  );
}
