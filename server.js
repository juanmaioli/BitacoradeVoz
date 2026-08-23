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

// Helper para datos de fecha/hora: YYYY/MM/DD y prefijo YYYYMMDD_HHMM
function getDatePathInfo() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const year = `${now.getFullYear()}`;
  const month = pad(now.getMonth() + 1);
  const day = pad(now.getDate());
  const hours = pad(now.getHours());
  const minutes = pad(now.getMinutes());
  
  const relFolder = path.join(year, month, day);
  const filename = `${year}${month}${day}_${hours}${minutes}`;
  return { relFolder, filename, year, month, day, hours, minutes };
}

// Endpoint: Grabar y Procesar Audio
app.post('/api/grabar', upload.single('audio'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No se recibió ningún archivo de audio.' });
  }

  const { relFolder, filename, hours, minutes } = getDatePathInfo();
  const targetDir = path.join(STORAGE_PATH, relFolder);

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const tempUploadPath = req.file.path;
  const audioDestination = path.join(targetDir, `${filename}.wav`);
  const mdDestination = path.join(targetDir, `${filename}.md`);
  const relAudioPath = path.join(relFolder, `${filename}.wav`);
  const relMdPath = path.join(relFolder, `${filename}.md`);

  // Convertir el audio grabado (webm/mp4/ogg) a WAV PCM de 16kHz con ffmpeg
  const ffmpegCmd = `ffmpeg -y -i "${tempUploadPath}" -ar 16000 -ac 1 -c:a pcm_s16le "${audioDestination}"`;

  exec(ffmpegCmd, (ffmpegErr) => {
    // Eliminar archivo temporal
    if (fs.existsSync(tempUploadPath)) {
      fs.unlinkSync(tempUploadPath);
    }

    if (ffmpegErr) {
      console.error('Error al convertir audio con ffmpeg:', ffmpegErr);
      return res.status(500).json({ error: 'Error al procesar el formato de audio.' });
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
archivo: ${filename}
---

# 🎙️ Entrada de Bitácora - ${hours}:${minutes}

## 📝 Transcripción
${transcripcion}

## 🔊 Audio
- Archivo: \`${filename}.wav\`
`;

      fs.writeFileSync(mdDestination, mdContent, 'utf-8');

      res.json({
        success: true,
        id: filename,
        relAudioPath: relAudioPath,
        relMdPath: relMdPath,
        transcripcion: transcripcion,
        fecha: new Date().toISOString()
      });
    });
  });
});

// Endpoint: Listar Entradas (solo del día actual YYYY/MM/DD)
app.get('/api/entradas', (req, res) => {
  try {
    const { relFolder } = getDatePathInfo();
    const todayDir = path.join(STORAGE_PATH, relFolder);

    if (!fs.existsSync(todayDir)) {
      return res.json([]);
    }

    const files = fs.readdirSync(todayDir)
      .filter(file => file.endsWith('.md'))
      .sort()
      .reverse();

    const entradas = files.map(file => {
      const baseName = file.replace('.md', '');
      const relMdPath = path.join(relFolder, `${baseName}.md`);
      const relAudioPath = path.join(relFolder, `${baseName}.wav`);
      
      const partes = baseName.split('_');
      const timePart = partes[1] || '';
      const horaFormateada = timePart.length >= 4 ? `${timePart.substring(0, 2)}:${timePart.substring(2, 4)}` : baseName;

      return {
        id: baseName,
        hora: horaFormateada,
        relMdPath: relMdPath,
        relAudioPath: relAudioPath
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
