import { useEffect } from "react";

import { useContextMenu } from "../../contexts/ContextMenuContext";
import styles from "./ContextMenu.module.css";

export default function ContextMenu() {
  const { contextMenu, setContextMenu } = useContextMenu();

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
          <li>새 파일 생성</li>
          <li>새 폴더 생성</li>
        </>
      )}
      <li>삭제</li>
    </ul>
  );
}
