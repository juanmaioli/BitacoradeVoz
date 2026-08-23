# 🎙️ Bitácora de Voz a Texto (Btcr)

Una aplicación web minimalista y accesible construida con **Node.js**, **Express** y **Moonshine (Python)** que te permite grabar entradas de voz directamente desde el navegador (escritorio y móviles) y convertirlas automáticamente en notas en formato **Markdown**, organizadas por fecha.

---

## 🌟 Características

- 🎙️ **Grabación Web Simplificada:** Botón circular accesible e intuitivo para iniciar/detener la grabación.
- 📱 **Soporte Móvil & HTTPS:** Compatibilidad con navegadores móviles (Chrome Android, Safari iOS) mediante detección dinámica de formatos (`webm`, `mp4`) y servidor seguro HTTPS (usando certificados de `./ssl`).
- 🤖 **Transcripción Local:** Procesamiento de voz a texto autónomo con el modelo Moonshine en Python.
- 📁 **Organización por Fecha:** Estructura jerárquica de archivos guardados en `directorio_configurado/YYYY/MM/DD/YYYYMMDD_HHMM.md` y `YYYYMMDD_HHMM.wav`.
- 📖 **Vista Compacta del Día:** Visualización limpia centrada en las notas del día actual con enlaces directos al archivo `.md` y reproductor de audio integrado (`▶` / `⏸`).

---

## ⚙️ Requisitos Previos

- **Node.js** v18 o superior.
- **Python 3** con entorno virtual `venv`.
- Certificados SSL en `./ssl/apache.key` y `./ssl/apache.crt` (para soporte HTTPS en móviles).

---

## 🚀 Instalación y Configuración

1. **Instalar dependencias de Node.js:**
   ```bash
   npm install
   ```

2. **Configurar el entorno virtual de Python e instalar Moonshine:**
   ```bash
   python3 -m venv venv
   ./venv/bin/pip install useful-moonshine keras einops soundfile librosa torch --index-url https://download.pytorch.org/whl/cpu
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
            ├── 20260823_1906.wav
            └── 20260823_1906.md
```
