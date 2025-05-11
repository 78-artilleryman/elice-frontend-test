import JSZip from "jszip";
import type { FileEntry } from "../../types/fileTree.type";
import { detectLanguageFromPath } from "../detectLanguageFromPath";

// 파일 트리 및 ZIP 파일 처리를 위한 유틸리티 함수들
export const sortFileTree = (tree: FileEntry[]): FileEntry[] => {
  return tree
    .sort((a, b) => {
      if (a.isDirectory === b.isDirectory) {
        return a.name.localeCompare(b.name);
      }
      return a.isDirectory ? -1 : 1;
    })
    .map((node) => {
      if (node.children) {
        return {
          ...node,
          children: sortFileTree(node.children),
        };
      }
      return node;
    });
};

export const isValidPath = (
  path: string,
  entry: JSZip.JSZipObject
): boolean => {
  return !(entry.dir || path.includes("__MACOSX") || path.startsWith("."));
};

export const createFileEntry = async (
  path: string,
  isLast: boolean,
  zipEntry: JSZip.JSZipObject
): Promise<FileEntry> => {
  const { language, type } = detectLanguageFromPath(path);

  const content =
    isLast && type === "text" ? await zipEntry.async("string") : undefined;

  const imageUrl =
    isLast && type === "image"
      ? URL.createObjectURL(await zipEntry.async("blob"))
      : undefined;

  return {
    name: path.split("/").pop()!,
    path,
    isDirectory: !isLast,
    children: !isLast ? [] : undefined,
    content,
    imageUrl,
    language: isLast ? language : undefined,
  };
};

export const splitPath = (path: string): string[] => {
  return path.split("/").filter(Boolean);
};

// 압축 파일 다운로드 할 때 사용하는 유틸 함수
export const createBlobFromFileTree = async (
  fileTree: FileEntry[]
): Promise<Blob> => {
  const zip = new JSZip();

  const addToZip = async (entry: FileEntry, parentPath: string = "") => {
    const fullPath = parentPath ? `${parentPath}/${entry.name}` : entry.name;

    if (entry.isDirectory) {
      // 폴더 생성
      zip.folder(fullPath);
      if (entry.children) {
        for (const child of entry.children) {
          await addToZip(child, fullPath);
        }
      }
    } else {
      // 파일 추가
      if (entry.content) {
        // 텍스트 파일
        zip.file(fullPath, entry.content);
      } else if (entry.imageUrl) {
        // 이미지 파일
        try {
          const response = await fetch(entry.imageUrl);
          const blob = await response.blob();
          zip.file(fullPath, blob);
        } catch (error) {
          console.error(`Failed to add image file ${fullPath}:`, error);
        }
      } else if (entry.file) {
        // 원본 파일이 있는 경우
        zip.file(fullPath, entry.file);
      }
    }
  };

  // 파일 트리를 순회하며 ZIP 파일 생성
  for (const entry of fileTree) {
    await addToZip(entry);
  }

  // ZIP 파일 생성 옵션 설정
  const options: JSZip.JSZipGeneratorOptions = {
    type: "blob",
    compression: "DEFLATE",
    compressionOptions: {
      level: 9,
    },
  };

  return await zip.generateAsync(options);
};

export const downloadZip = (blob: Blob, filename: string = "download.zip") => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const findNodeByPath = (
  nodes: FileEntry[],
  path: string
): FileEntry | null => {
  for (const node of nodes) {
    if (node.path === path) return node;
    if (node.children) {
      const found = findNodeByPath(node.children, path);
      if (found) return found;
    }
  }
  return null;
};
