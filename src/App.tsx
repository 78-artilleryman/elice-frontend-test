import "./App.module.css";
import FileUploader from "./components/FileUploader/FileUploader";
import styles from "./App.module.css";

function App() {
  return (
    <div className={styles.container}>
      <FileUploader />
    </div>
  );
}

export default App;
