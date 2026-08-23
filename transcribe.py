import sys
import os
import argparse

def transcribe(audio_path):
    try:
        import moonshine
        results = moonshine.transcribe(audio_path, 'moonshine/tiny')
        if isinstance(results, list):
            return " ".join(results)
        return str(results)
    except Exception as e:
        return f"[Error al transcribir con Moonshine: {str(e)}]"

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Transcribir audio a texto usando Moonshine")
    parser.add_argument("audio_path", help="Ruta al archivo de audio")
    args = parser.parse_args()

    if not os.path.exists(args.audio_path):
        print(f"Error: El archivo {args.audio_path} no existe.")
        sys.exit(1)

    text = transcribe(args.audio_path)
    print(text)
