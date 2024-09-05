import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    console.log('Arquivo selecionado:', selectedFile);

    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile);
      setFileError('');
    } else {
      setFile(null);
      setFileError('Por favor, selecione um arquivo CSV válido.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setFileError('Por favor, selecione um arquivo CSV.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      console.log('Enviando arquivo para o backend...');
      const response = await axios.post('http://localhost:3001/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Resposta do backend:', response.data);
      setMessage(response.data.message || response.data.error);
      setFile(null);
    } catch (error) {
      console.error('Erro ao enviar o arquivo:', error.response ? error.response.data : error.message);
      setMessage('Erro ao enviar o arquivo.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Upload de Arquivo CSV</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="fileInput">Selecione o arquivo CSV:</label>
          <input
            id="fileInput"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
          />

          {fileError && <p style={{ color: 'red' }}>{fileError}</p>}
        </div>
        <button type="submit">Enviar Arquivo</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default App;
