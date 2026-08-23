import sys
import os
import argparse
import warnings

# Suprimir advertencias secundarias de PyTorch/FP16 en CPU
warnings.filterwarnings("ignore")

def transcribe(audio_path):
    # Intentar transcribir con OpenAI Whisper en español usando el modelo 'small' (más preciso)
    try:
        import whisper
        model = whisper.load_model("small")
        result = model.transcribe(audio_path, language="es", fp16=False)
        if result and "text" in result and result["text"].strip():
            return result["text"].strip()
    except Exception as e_whisper:
        pass

    # Fallback a Moonshine
    try:
        import moonshine
        results = moonshine.transcribe(audio_path, 'moonshine/tiny')
        if isinstance(results, list):
            return " ".join(results)
        return str(results)
    except Exception as e_moonshine:
        return f"[Error al transcribir: {str(e_moonshine)}]"

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Transcribir audio a texto en español")
    parser.add_argument("audio_path", help="Ruta al archivo de audio")
    args = parser.parse_args()

    if not os.path.exists(args.audio_path):
        print(f"Error: El archivo {args.audio_path} no existe.")
        sys.exit(1)

    text = transcribe(args.audio_path)
    print(text)
