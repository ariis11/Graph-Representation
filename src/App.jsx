import { useState, useEffect } from 'react';

import './App.css';
import GraphRepresentation from './components/GraphRepresentation/GraphRepresentation';

function App() {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const fileContent = event.target.result;
      setFile(JSON.parse(fileContent));
    };

    reader.readAsText(uploadedFile);
  };

  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault();
    };

    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  return (
    <div className="App">
      {!file && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <div>
            <input type="file" accept=".json" onChange={handleFileChange} />
          </div>
        </div>
      )}
      {file && <GraphRepresentation data={file} />}
    </div>
  );
}

export default App;