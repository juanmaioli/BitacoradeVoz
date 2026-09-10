# 🎙️ Bitácora de Voz (Btcr)

Una aplicación web minimalista y accesible construida con **Node.js**, **Express**, **ffmpeg** y **Whisper (Python)** que te permite grabar entradas de voz directamente desde el navegador (escritorio y dispositivos móviles) y convertirlas en notas en formato **Markdown** escritas en español.

---

## 🌟 Características

- 🎙️ **Grabación Web Intuitiva:** Botón circular de gran tamaño (140px) y accesible para iniciar/detener la grabación.
- 📱 **Soporte Móvil & HTTPS:** Funciona en navegadores móviles (Chrome Android, Safari iOS) a través de HTTPS seguro y detección dinámica de formatos (`webm`, `mp4`, `ogg`).
- 🔄 **Conversión de Audio con FFmpeg:** Conversión automática del audio capturado a formato estándar **WAV PCM 16kHz mono**.
- 🤖 **Transcripción Multilingüe en Español:** Reconocimiento de voz local preciso en español impulsado por **OpenAI Whisper (modelo small)**.
- 📝 **Plantillas Personalizables:** Soporte para plantillas Markdown externas (como `Transcripción.md`) configurables mediante `TEMPLATE_PATH`.
- ✅ **Control de Estado de Notas:** Checkbox interactivo en la interfaz para marcar/desmarcar notas como `Nueva` o `Revisada` con sincronización en tiempo real en los archivos Markdown.
- ⏱️ **Múltiples Notas por Minuto:** Archivos nombrados con precisión de segundos (`YYYYMMDD_HHMMSS.md` y `YYYYMMDD_HHMMSS.wav`).
- 📁 **Organización por Fecha:** Estructura jerárquica en `storage/YYYY/MM/DD/`.
- 📖 **Vista Compacta:** Muestra las notas del día actual con reproductor de audio integrado (`▶` / `⏸`) y sticky footer pegado al fondo.

---

## ⚙️ Requisitos Previos

- **Docker** y **Docker Compose** instalados (o bien Node.js v18+, FFmpeg y Python 3 en local).
- Certificados SSL opcionales en `./ssl/apache.key` y `./ssl/apache.crt` (para soporte HTTPS).

---

## 🐳 Despliegue con Docker Compose

1. **Compilar e Iniciar el Contenedor:**
   ```bash
   docker compose up -d --build
   ```

2. **Detener el Servicio:**
   ```bash
   docker compose down
   ```

---

## 🚀 Instalación Local (Sin Docker)

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
   TEMPLATE_PATH=/home/juan/Documentos/Notas/templates/Transcripción.md
   ```

4. **Ejecutar la aplicación:**
   ```bash
   node server.js
   ```

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
