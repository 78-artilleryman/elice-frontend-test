import JSZip from "jszip";
import type { FileEntry } from "../types/fileTree.type";
import { detectLanguageFromPath } from "./detectLanguageFromPath";

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
