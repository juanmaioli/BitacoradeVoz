# 🎙️ Bitácora de Voz (Btcr)

Una aplicación web minimalista y accesible construida con **Node.js**, **Express**, **ffmpeg** y **Whisper (Python)** que te permite grabar entradas de voz directamente desde el navegador (escritorio y dispositivos móviles) y convertirlas en notas en formato **Markdown** escritas en español.

---

## 🌟 Características

- 🎙️ **Grabación Web Intuitiva:** Botón circular de gran tamaño (140px) y accesible para iniciar/detener la grabación.
- 📱 **Soporte Móvil & HTTPS:** Funciona en navegadores móviles (Chrome Android, Safari iOS) a través de HTTPS seguro y detección dinámica de formatos (`webm`, `mp4`, `ogg`).
- 🔄 **Conversión de Audio con FFmpeg:** Conversión automática del audio capturado a formato estándar **WAV PCM 16kHz mono**.
- 🤖 **Transcripción Multilingüe en Español:** Reconocimiento de voz local preciso en español impulsado por **OpenAI Whisper (modelo small)**.
- ⏱️ **Múltiples Notas por Minuto:** Archivos nombrados con precisión de segundos (`YYYYMMDD_HHMMSS.md` y `YYYYMMDD_HHMMSS.wav`).
- 📁 **Organización por Fecha:** Estructura jerárquica en `storage/YYYY/MM/DD/`.
- 📖 **Vista Compacta:** Muestra las notas del día actual con reproductor de audio integrado (`▶` / `⏸`) y sticky footer pegado al fondo.

---

## ⚙️ Requisitos Previos

- **Node.js** v18 o superior.
- **FFmpeg** instalado en el sistema (`sudo apt install ffmpeg`).
- **Python 3** con entorno virtual `venv`.
- Certificados SSL en `./ssl/apache.key` y `./ssl/apache.crt` (para soporte HTTPS).

---

## 🚀 Instalación y Configuración

1. **Instalar dependencias de Node.js:**
   ```bash
   npm install
   ```

2. **Configurar el entorno virtual de Python e instalar Whisper:**
   ```bash
   python3 -m venv venv
   ./venv/bin/pip install openai-whisper useful-moonshine keras einops soundfile librosa torch --index-url https://download.pytorch.org/whl/cpu
   ```

3. **Variables de Entorno (`.env`):**
   Crear un archivo `.env` en la raíz del proyecto:
   ```env
   PORT=3000
   STORAGE_PATH=/ruta/a/tu/directorio_configurado
   ```

---

## 🏁 Modo de Uso

Iniciá el servidor web:
```bash
node server.js
```

Accedé desde tu navegador:
- **Desde la computadora:** [https://localhost:3000](https://localhost:3000)
- **Desde el celular (misma red Wi-Fi):** `https://<IP_DE_TU_COMPUTADORA>:3000`

---

## 📁 Estructura del Directorio Guardado

```text
storage/
└── 2026/
    └── 08/
        └── 23/
            ├── 20260823_194215.wav
            └── 20260823_194215.md
```
