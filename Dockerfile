# Imagen base con Node.js y Python3 / FFmpeg para el procesamiento de voz
FROM node:22-slim

# Instalar FFmpeg, Python3 y dependencias de compilación para PyTorch/Whisper
RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    python3 \
    python3-pip \
    python3-venv \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copiar archivos de dependencias de Node
COPY package*.json ./
RUN npm install --omit=dev

# Crear entorno virtual de Python e instalar Whisper y Torch CPU
RUN python3 -m venv venv && \
    ./venv/bin/pip install --no-cache-dir torch --index-url https://download.pytorch.org/whl/cpu && \
    ./venv/bin/pip install --no-cache-dir openai-whisper useful-moonshine keras einops soundfile librosa

# Copiar el código fuente de la aplicación
COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
