import { describe, it, expect } from "vitest";
import { deleteRecursively } from "./fileDeleteUtils";
import type { FileEntry } from "../../types/fileTree.type";

describe("파일 및 폴더 삭제 테스트", () => {
  it("트리에서 파일을 삭제한다", () => {
    const tree: FileEntry[] = [
      { name: "a", path: "a", isDirectory: false, content: "" },
      { name: "b", path: "b", isDirectory: false, content: "" },
    ];
    const updated = deleteRecursively(tree, "a");
    expect(updated).toEqual([
      { name: "b", path: "b", isDirectory: false, content: "" },
    ]);
  });

  it("트리에서 폴더(및 하위 전체)를 삭제한다", () => {
    const tree: FileEntry[] = [
      {
        name: "src",
        path: "src",
        isDirectory: true,
        children: [
          { name: "a", path: "src/a", isDirectory: false, content: "" },
          {
            name: "components",
            path: "src/components",
            isDirectory: true,
            children: [
              {
                name: "App.tsx",
                path: "src/components/App.tsx",
                isDirectory: false,
                content: "",
              },
            ],
          },
        ],
      },
    ];
    // src/components 폴더 삭제
    const updated = deleteRecursively(tree, "src/components");
    expect(updated[0].children).toEqual([
      { name: "a", path: "src/a", isDirectory: false, content: "" },
    ]);
  });
});
