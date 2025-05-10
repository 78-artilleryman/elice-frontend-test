import { createBlobFromFileTree, downloadZip } from "../fileTreeUtils";
import type { FileEntry } from "../../types/fileTree.type";

export const exportZip = async (fileTree: FileEntry[], rawFile: File) => {
  if (!fileTree || fileTree.length === 0) {
    console.error("내보낼 파일이 없습니다.");
    return;
  }

  try {
    const blob = await createBlobFromFileTree(fileTree);
    const filename = rawFile?.name || "exported.zip";
    downloadZip(blob, filename);
  } catch (error) {
    console.error("ZIP 내보내기 실패:", error);
  }
};
