# 엘리스 프론트엔드 특별 채용 미니 프로젝트

ZIP 파일을 업로드하고 내용을 수정한 후 다시 다운로드할 수 있는 웹 기반 코드 에디터입니다.

## 기술 스택

1. **React & TypeScript**
2. **Vite**
3. **Playwright**
4. **Vitest**

---

## 프로젝트 구조

<img width="992" alt="스크린샷 2025-05-11 오후 7 44 45" src="https://github.com/user-attachments/assets/6a64c0aa-5a49-4542-b128-1a9f809019a4" />

### Contexts

#### 1. FileSystemContext

파일 시스템의 전반적인 상태를 관리합니다.

```typescript
interface FileSystemState {
  fileTree: FileEntry[]; // 전체 파일 트리 구조
  rawFile: File | null; // 업로드된 원본 ZIP 파일
  selectedFolderPath: string; // 현재 선택된 폴더 경로
  isCreatingFile: boolean; // 파일 생성 모드 여부
  isCreatingFolder: boolean; // 폴더 생성 모드 여부
}
```

- ZIP 파일 업로드/다운로드 상태 관리
- 파일 트리 구조 관리
- 파일/폴더 생성, 삭제, 수정 작업 관리

#### 2. OpenTabsContext

에디터에서 열린 파일들의 상태를 관리합니다.

```typescript
interface OpenTabsState {
  openTabs: FileEntry[]; // 열린 탭 목록
  activeTab: string; // 현재 활성화된 탭
}
```

- 에디터에서 열린 파일 탭 관리
- 활성 탭 상태 관리
- 탭 순서 및 탭 작업 관리

#### 3. FileActionMenuContext

파일/폴더 작업을 위한 컨텍스트 메뉴 상태를 관리합니다.

```typescript
interface FileActionMenuState {
  visible: boolean; // 메뉴 표시 여부
  x: number; // 메뉴 X 좌표
  y: number; // 메뉴 Y 좌표
  targetPath: string; // 대상 파일/폴더 경로
  isDirectory: boolean; // 폴더 여부
}
```

- 파일/폴더 컨텍스트 메뉴 상태 관리
- 우클릭 메뉴 위치 및 표시 상태 관리

---

### Components

#### 1. FileUploader

파일 업로드 및 다운로드 UI를 제공합니다.

- ZIP 파일 업로드 (드래그 앤 드롭 지원)
- 파일 선택 다이얼로그
- ZIP 파일 다운로드
- FileSystemContext와 직접 상호작용

#### 2. FileTree & FileTreeItem

파일 시스템을 시각적으로 표현합니다.

```typescript
interface FileTreeItemProps {
  node: FileEntry; // 파일/폴더 노드 정보
}
```

- 파일 트리 구조 시각화
- 폴더 확장/축소 기능
- 파일/폴더 선택 기능
- 컨텍스트 메뉴 연동

#### 3. FileInput

새로운 파일이나 폴더를 생성하기 위한 입력 UI를 제공합니다.

```typescript
interface FileInputProps {
  parentPath: string; // 상위 폴더 경로
  type: "file" | "folder"; // 생성 타입
}
```

- 새 파일/폴더 이름 입력
- 입력 완료 시 파일/폴더 생성
- 외부 클릭 시 자동 닫힘

#### 4. EditorTabs

열린 파일들의 탭을 관리합니다.

- 열린 파일 탭 목록 표시
- 탭 전환 기능
- 탭 닫기 기능
- 활성 탭 표시

#### 5. FileViewer

Monaco Editor 기반의 코드 에디터를 제공합니다.

```typescript
interface FileViewerProps {
  content: string; // 파일 내용
  language: string; // 파일 언어
  path: string; // 파일 경로
}
```

- 코드 편집 기능
- 구문 강조 지원
- 자동 완성 기능
- 파일 수정 및 저장

#### 6. FileActionMenu

파일/폴더 작업을 위한 컨텍스트 메뉴를 제공합니다.

```typescript
interface FileActionMenuProps {
  onCreateFile: () => void;
  onCreateFolder: () => void;
  onDelete: (path: string) => void;
}
```

- 파일/폴더 작업 메뉴 UI
- 생성/삭제 작업 제공
- 위치 기반 동적 렌더링

### 컴포넌트 간 상호작용

#### 1. 상태 공유 및 이벤트 전파

```
FileSystemContext ←→ OpenTabsContext
- 파일 시스템 변경 시 열린 탭 상태 동기화
- 탭에서의 파일 수정이 파일 시스템에 반영

FileActionMenu ←→ FileSystemContext
- 컨텍스트 메뉴 액션이 파일 시스템 상태 변경
- 파일 시스템 상태에 따른 메뉴 옵션 동적 변경
```

#### 2. 성능 최적화

- 컴포넌트 리렌더링 최소화를 위한 메모이제이션 전략
- 대용량 파일 처리를 위한 청크 단위 로딩
- 가상 스크롤을 통한 대규모 파일 트리 최적화

#### 3. 에러 처리 및 복구

- 파일 시스템 작업 실패 시 롤백 메커니즘
- 네트워크 오류 시 자동 재시도
- 사용자 작업 히스토리 관리 및 실행 취소 기능

### 주요 데이터 흐름

1. **파일 업로드 프로세스**

```
FileUploader (ZIP 선택)
→ extractZip()
→ FileSystemContext 업데이트
→ FileTree 렌더링
```

2. **파일 편집 프로세스**

```
FileTree (파일 클릭)
→ OpenTabsContext 업데이트
→ EditorTabs 업데이트
→ FileViewer 렌더링
→ 내용 수정
→ FileSystemContext 업데이트
```

3. **파일/폴더 작업 프로세스**

```
FileTreeItem (우클릭)
→ FileActionMenuContext 업데이트
→ FileActionMenu 표시
→ 작업 선택
→ FileSystemContext 업데이트
→ UI 갱신
```

### Context Provider 계층 구조

```tsx
 // 파일 시스템 상태
<FileSystemProvider>
    // 전역 UI 요소
  <FileActionMenuProvider>
     <...components/>
    // 에디터 탭 상태
    <OpenTabsProvider>
      <...components/>
    </OpenTabsProvider>
  </FileActionMenuProvider>
</FileSystemProvider>

```

## 테스트 구현

### E2E 테스트 (Playwright)

#### 1. ZIP 파일 업로드/다운로드 테스트

```typescript
test(
  "ZIP 파일을 업로드하고, 내부 파일을 수정한 후, 변경사항이 반영된 ZIP 파일을 다운로드"
);
```

- **목적**: 핵심 기능인 ZIP 파일 처리 과정의 전체 플로우 검증
- **검증 항목**:
  - ZIP 파일 업로드 기능
  - 파일 트리 표시 여부
  - 파일 내용 수정 기능
  - 수정된 내용이 포함된 ZIP 파일 다운로드

### 단위 테스트 (Vitest)

#### 1. FileSystem Context 테스트

```typescript
describe("FileSystemProvider 상태 변화");
```

- **목적**: 파일 시스템 상태 관리 로직 검증
- **검증 항목**:
  - 파일 트리 상태 업데이트
  - 선택된 경로 관리
  - 파일/폴더 생성 모드 전환

#### 2. 파일 트리 유틸리티 테스트

```typescript
describe("file tree utils");
```

- **목적**: 파일 트리 조작 함수들의 정확성 검증
- **검증 항목**:
  - 새 파일/폴더 엔트리 생성
  - 트리 구조 업데이트
  - 재귀적 삭제 처리
