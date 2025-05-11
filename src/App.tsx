import styles from "./App.module.css";

import FileUploader from "./components/FileUploader/FileUploader";
import EditorTabs from "./components/EditorTabs/EditorTabs";
import FileTree from "./components/FileTree/FileTree";
import FileViewer from "./components/FileViewer/FileViewer";

import { FileSystemProvider } from "./contexts/FileSystemContext";
import { OpenTabsProvider } from "./contexts/OpenTabsContext";
import { ContextMenuProvider } from "./contexts/ContextMenuContext";
import ContextMenu from "./components/FileTree/ContextMenu";

function App() {
  return (
    <ContextMenuProvider>
      <FileSystemProvider>
        <div className={styles.container}>
          <FileUploader />
          <OpenTabsProvider>
            <div className={styles.content}>
              <FileTree />
              <div className={styles.editor}>
                <EditorTabs />
                <FileViewer />
              </div>
            </div>
            <ContextMenu />
          </OpenTabsProvider>
        </div>
      </FileSystemProvider>
    </ContextMenuProvider>
  );
}

export default App;
