import { describe, it, expect } from "vitest";
import { updateFileTreeRecursively } from "./fileCreateUtils";
import { createNewFolder } from "./folderCreateUtils";

import type { FileEntry } from "../../types/fileTree.type";

describe("folder tree utils", () => {
  it("createNewFolder: 폴더 엔트리 객체를 올바르게 생성한다", () => {
    const folder = createNewFolder("myFolder", "/");
    expect(folder).toMatchObject({
      name: "myFolder",
      path: "myFolder",
      isDirectory: true,
      children: [],
    });
  });

  it("updateFileTreeRecursively: 루트 폴더에 새 폴더를 추가한다", () => {
    const root: FileEntry[] = [
      { name: "src", path: "src", isDirectory: true, children: [] },
    ];
    const newFolder = createNewFolder("utils", "src");
    const updated = updateFileTreeRecursively(root, "src", newFolder);

    expect(updated[0].children).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: "utils",
          isDirectory: true,
          children: [],
        }),
      ])
    );
  });
});
