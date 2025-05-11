import { useEffect } from "react";

import { useContextMenu } from "../../contexts/ContextMenuContext";
import { useFileSystem } from "../../contexts/FileSystemContext";
import { useOpenTabs } from "../../contexts/OpenTabsContext";

import type { FileEntry } from "../../types/fileTree.type";
import styles from "./ContextMenu.module.css";

export default function ContextMenu() {
  const { contextMenu, setContextMenu } = useContextMenu();
  const {
    setIsCreatingFile,
    setIsCreatingFolder,
    setSelectedFolderPath,
    setFileTree,
  } = useFileSystem();
  const { openTabs, setOpenTabs, activeTab, setActiveTab } = useOpenTabs();

  // 바깥 클릭/스크롤 시 메뉴 닫기
  useEffect(() => {
    if (!contextMenu.visible) return;
    const close = () => setContextMenu((prev) => ({ ...prev, visible: false }));
    document.addEventListener("mousedown", close);
    document.addEventListener("scroll", close, true);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("scroll", close, true);
    };
  }, [contextMenu.visible, setContextMenu]);

  if (!contextMenu.visible) return null;

  // 삭제 유틸 함수
  const handleDelete = () => {
    const deleteRecursively = (
      nodes: FileEntry[],
      targetPath: string
    ): FileEntry[] =>
      nodes
        .filter((n: FileEntry) => n.path !== targetPath)
        .map((n: FileEntry) =>
          n.children
            ? { ...n, children: deleteRecursively(n.children, targetPath) }
            : n
        );
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
