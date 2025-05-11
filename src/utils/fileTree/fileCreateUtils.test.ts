import { describe, it, expect } from "vitest";
import { createNewFile, updateFileTreeRecursively } from "./fileCreateUtils";

import type { FileEntry } from "../../types/fileTree.type";

describe("file tree utils", () => {
  it("createNewFile: 파일 엔트리 객체를 올바르게 생성한다", () => {
    const file = createNewFile("test.txt", "/");
    expect(file).toMatchObject({
      name: "test.txt",
      path: "test.txt",
      isDirectory: false,
      content: expect.any(String),
    });
  });

  it("updateFileTreeRecursively: 트리의 루트에 파일을 추가한다", () => {
    const root: FileEntry[] = [
      { name: "src", path: "src", isDirectory: true, children: [] },
    ];
    const newFile = createNewFile("index.js", "src");
    const updated = updateFileTreeRecursively(root, "src", newFile);

    expect(updated[0].children).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "index.js", isDirectory: false }),
      ])
    );
  });

  it("updateFileTreeRecursively: 중첩 폴더에도 파일을 추가한다", () => {
    const root: FileEntry[] = [
      {
        name: "src",
        path: "src",
        isDirectory: true,
        children: [
          {
            name: "components",
            path: "src/components",
            isDirectory: true,
            children: [],
          },
        ],
      },
    ];
    const newFile = createNewFile("App.tsx", "src/components");
    const updated = updateFileTreeRecursively(root, "src/components", newFile);

    expect(updated[0].children?.[0].children).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "App.tsx", isDirectory: false }),
      ])
    );
  });
});
