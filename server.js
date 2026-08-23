const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const STORAGE_PATH = process.env.STORAGE_PATH || path.join(__dirname, 'storage');

if (!fs.existsSync(STORAGE_PATH)) {
  fs.mkdirSync(STORAGE_PATH, { recursive: true });
}

app.use(express.json());
app.use(express.static('public'));

// Configuración de multer para guardar temporalmente los archivos de audio
const upload = multer({ dest: path.join(__dirname, 'tmp_uploads') });

// Helper para formato de fecha/hora en carpetas YYYY-MM-DD_HH-mm
function getFormattedTimestamp() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const dateStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  const timeStr = `${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;
  return `${dateStr}_${timeStr}`;
}

// Endpoint: Grabar y Procesar Audio
app.post('/api/grabar', upload.single('audio'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No se recibió ningún archivo de audio.' });
  }

  const folderName = getFormattedTimestamp();
  const entryDir = path.join(STORAGE_PATH, folderName);

  if (!fs.existsSync(entryDir)) {
    fs.mkdirSync(entryDir, { recursive: true });
  }

  const audioDestination = path.join(entryDir, 'entrada.wav');

  // Mover archivo subido al directorio final
  fs.rename(req.file.path, audioDestination, (err) => {
    if (err) {
      console.error('Error al mover archivo de audio:', err);
      return res.status(500).json({ error: 'Error al guardar el archivo de audio.' });
    }

    // Ruta al ejecutable de Python del virtualenv si existe
    const venvPython = path.join(__dirname, 'venv', 'bin', 'python3');
    const pythonCmd = fs.existsSync(venvPython) ? venvPython : 'python3';
    const scriptPath = path.join(__dirname, 'transcribe.py');

    // Ejecutar Moonshine para transcripción especificando backend de Torch para Keras
    exec(`KERAS_BACKEND=torch "${pythonCmd}" "${scriptPath}" "${audioDestination}"`, (execErr, stdout, stderr) => {
      let transcripcion = stdout ? stdout.trim() : '';

      if (execErr || !transcripcion) {
        console.warn('Advertencia en transcripción:', stderr || execErr);
        transcripcion = '[Transcripción pendiente o sin audio detectable]';
      }

      // Crear archivo Markdown
      const mdContent = `---
fecha: ${new Date().toISOString()}
carpeta: ${folderName}
---

# 🎙️ Entrada de Bitácora - ${folderName.replace('_', ' ')}

## 📝 Transcripción
${transcripcion}

## 🔊 Audio
- Archivo: \`entrada.wav\`
`;

      const mdPath = path.join(entryDir, 'entrada.md');
      fs.writeFileSync(mdPath, mdContent, 'utf-8');

      res.json({
        success: true,
        id: folderName,
        transcripcion: transcripcion,
        fecha: new Date().toISOString()
      });
    });
  });
});

// Endpoint: Listar Entradas (solo del día actual)
app.get('/api/entradas', (req, res) => {
  try {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const todayPrefix = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;

    const directories = fs.readdirSync(STORAGE_PATH, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory() && dirent.name.startsWith(todayPrefix))
      .map(dirent => dirent.name)
      .sort()
      .reverse();

    const entradas = directories.map(folder => {
      const mdPath = path.join(STORAGE_PATH, folder, 'entrada.md');
      let transcripcionSnippet = '';

      if (fs.existsSync(mdPath)) {
        const content = fs.readFileSync(mdPath, 'utf-8');
        const match = content.match(/## 📝 Transcripción\n([\s\S]*?)(?=\n##|$)/);
        if (match) transcripcionSnippet = match[1].trim();
      }

      return {
        id: folder,
        nombre: folder.replace('_', ' '),
        snippet: transcripcionSnippet.substring(0, 120) + (transcripcionSnippet.length > 120 ? '...' : '')
      };
    });

    res.json(entradas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener entradas de la bitácora.' });
  }
});

const https = require('https');
const http = require('http');

// Endpoint: Servir Archivos de Audio y Markdown
app.use('/storage', express.static(STORAGE_PATH));

const keyPath = path.join(__dirname, 'ssl', 'apache.key');
const crtPath = path.join(__dirname, 'ssl', 'apache.crt');

if (fs.existsSync(keyPath) && fs.existsSync(crtPath)) {
  const options = {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(crtPath)
  };
  https.createServer(options, app).listen(PORT, () => {
    console.log(`🔒 Servidor HTTPS ejecutándose en https://localhost:${PORT}`);
  });
} else {
  http.createServer(app).listen(PORT, () => {
    console.log(`🚀 Servidor HTTP ejecutándose en http://localhost:${PORT}`);
  });
}
