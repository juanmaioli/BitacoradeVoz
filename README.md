# 🎙️ Bitácora de Voz a Texto (Btcr)

Una aplicación web intuitiva construida con **Node.js**, **Express** y **Moonshine (Python)** que te permite grabar notas de voz desde el navegador y convertirlas automáticamente en transcripciones en formato **Markdown**, guardando el audio y la nota en un directorio configurado.

---

## 🌟 Características
- 🎙️ **Grabación directa:** Captura de voz desde el navegador web.
- 🤖 **Transcripción local:** Procesamiento de voz a texto con el modelo Moonshine.
- 📁 **Organización por Carpetas:** Cada entrada se almacena individualmente según su fecha y hora (`YYYY-MM-DD_HH-mm`).
- 📝 **Formato Markdown:** Transcripciones legibles estructuradas en `.md`.
- 🎧 **Reproductor Integrado:** Escuchá tus grabaciones previas desde la misma interfaz.

---

## ⚙️ Requisitos Previos
- **Node.js** v18 o superior.
- **Python 3** con `pip` y entorno virtual `venv`.

---

## 🚀 Instalación y Configuración

1. **Clonar e instalar dependencias de Node.js:**
   ```bash
   npm install
   ```

2. **Configurar el entorno de Python para Moonshine:**
   ```bash
   python3 -m venv venv
   ./venv/bin/pip install useful-moonshine
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

Abrí tu navegador e ingresá a [http://localhost:3000](http://localhost:3000).

---

## 📁 Estructura del Directorio Guardado

```text
storage/
└── 2026-08-23_18-30-00/
    ├── entrada.wav
    └── entrada.md
```
