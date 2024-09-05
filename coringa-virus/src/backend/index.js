// backend/index.js
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const { MongoClient, GridFSBucket } = require('mongodb');
const fs = require('fs');

const app = express();

// Conectar ao MongoDB (sem as opções deprecated)
mongoose.connect('mongodb://127.0.0.1:27017/start');

const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    console.log('Arquivo recebido:', req.file);
    const filePath = req.file.path;

    const url = 'mongodb://localhost:27017';
    const dbName = 'start';  // Use o nome correto do banco de dados
    const client = new MongoClient(url);

    await client.connect();
    const db = client.db(dbName);
    const bucket = new GridFSBucket(db);

    const uploadStream = bucket.openUploadStream(req.file.originalname);
    fs.createReadStream(filePath).pipe(uploadStream);

    uploadStream.on('finish', () => {
      console.log('Arquivo carregado com sucesso');
      res.json({ message: 'Arquivo enviado e carregado com sucesso!' });
    });

    uploadStream.on('error', (err) => {
      console.error('Erro ao carregar o arquivo:', err);
      res.status(500).json({ error: 'Erro ao processar o arquivo.' });
    });

  } catch (error) {
    console.error('Erro ao processar a solicitação:', error);
    res.status(500).json({ error: 'Erro ao enviar o arquivo.' });
  }
});

app.listen(3001, () => {
  console.log('Servidor rodando na porta 3001');
});
