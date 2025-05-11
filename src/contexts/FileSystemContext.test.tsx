import { describe, it, expect } from "vitest";
import { render, act } from "@testing-library/react";
import { FileSystemProvider, useFileSystem } from "./FileSystemContext";

// 테스트용 컴포넌트
function TestComponent() {
  const {
    isCreatingFile,
    setIsCreatingFile,
    selectedFolderPath,
    setSelectedFolderPath,
    fileTree,
    setFileTree,
  } = useFileSystem();

  return (
    <div>
      <button onClick={() => setIsCreatingFile(true)}>파일생성모드</button>
      <button onClick={() => setIsCreatingFile(false)}>파일생성모드해제</button>
      <button onClick={() => setSelectedFolderPath("myFolder")}>
        폴더선택
      </button>
      <button
        onClick={() =>
          setFileTree([
            { name: "a", path: "a", isDirectory: false, content: "" },
          ])
        }
      >
        트리추가
      </button>
      <span data-testid="isCreatingFile">{String(isCreatingFile)}</span>
      <span data-testid="selectedFolderPath">{selectedFolderPath}</span>
      <span data-testid="fileTreeLength">{fileTree.length}</span>
    </div>
  );
}

describe("FileSystemProvider 상태 변화", () => {
  it("isCreatingFile, selectedFolderPath, fileTree 상태가 올바르게 변경된다", () => {
    const { getByText, getByTestId } = render(
      <FileSystemProvider>
        <TestComponent />
      </FileSystemProvider>
    );

    // 초기값 확인
    expect(getByTestId("isCreatingFile").textContent).toBe("false");
    expect(getByTestId("selectedFolderPath").textContent).toBe("/");
    expect(getByTestId("fileTreeLength").textContent).toBe("0");

    // 파일 생성 모드 true
    act(() => {
      getByText("파일생성모드").click();
    });
    expect(getByTestId("isCreatingFile").textContent).toBe("true");

    // 파일 생성 모드 false
    act(() => {
      getByText("파일생성모드해제").click();
    });
    expect(getByTestId("isCreatingFile").textContent).toBe("false");

    // 폴더 선택
    act(() => {
      getByText("폴더선택").click();
    });
    expect(getByTestId("selectedFolderPath").textContent).toBe("myFolder");

    // 트리 추가
    act(() => {
      getByText("트리추가").click();
    });
    expect(getByTestId("fileTreeLength").textContent).toBe("1");
  });
});
