import "./App.module.css";
import FileUploader from "./components/FileUploader/FileUploader";
import styles from "./App.module.css";
import { FileSystemProvider } from "./contexts/FileSystemContext";

function App() {
  return (
    <FileSystemProvider>
      <div className={styles.container}>
        <FileUploader />
      </div>
    </FileSystemProvider>
  );
}

export default App;
