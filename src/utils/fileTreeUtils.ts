import JSZip from "jszip";
import type { FileEntry } from "../types/fileTree.type";
import { detectLanguageFromPath } from "./detectLanguageFromPath";

// 파일 트리 및 ZIP 파일 처리를 위한 유틸리티 함수들
const sortFileTree = (tree: FileEntry[]): FileEntry[] => {
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

const isValidPath = (path: string, entry: JSZip.JSZipObject): boolean => {
  return !(entry.dir || path.includes("__MACOSX") || path.startsWith("."));
};

const createFileEntry = async (
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

const splitPath = (path: string): string[] => {
  return path.split("/").filter(Boolean);
};

// ZIP 파일을 파싱하여 파일 트리 구조로 변환
export const extractZip = async (file: File): Promise<FileEntry[]> => {
  // ZIP 파일 로드
  const zip = await JSZip.loadAsync(file);
  const tree: FileEntry[] = [];
  const paths = Object.keys(zip.files).sort();

  for (const relativePath of paths) {
    const zipEntry = zip.files[relativePath];

    // 유효하지 않은 경로(디렉토리, 숨김 파일 등)는 건너뛰기
    if (!isValidPath(relativePath, zipEntry)) {
      continue;
    }

    // 경로를 부분으로 분할하여 트리 구조 생성
    const parts = splitPath(relativePath);
    let current = tree;

    // 각 경로 부분에 대해 트리 노드 생성 또는 업데이트
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isLast = i === parts.length - 1;
      const currentPath = parts.slice(0, i + 1).join("/");
      let existing = current.find((node) => node.name === part);

      // 새로운 노드 생성
      if (!existing) {
        existing = await createFileEntry(currentPath, isLast, zipEntry);
        current.push(existing);
      }

      // 디렉토리인 경우 하위 레벨로 이동
      if (!isLast && existing.children) {
        current = existing.children;
      }
    }
  }

  // 디렉토리가 먼저 오고, 같은 타입끼리는 이름순으로 정렬
  return sortFileTree(tree);
};
