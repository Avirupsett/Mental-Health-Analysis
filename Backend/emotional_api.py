from flask import Flask, request, jsonify
from transformers import pipeline
import soundfile as sf
import numpy as np

app = Flask(__name__)

# Load the emotion recognition pipeline
emotion_recognizer = pipeline("audio-classification", model="ehcalabres/wav2vec2-lg-xlsr-en-speech-emotion-recognition")

@app.route('/predict_emotion', methods=['POST'])
def predict_emotion():
    if 'audio' not in request.files:
        return jsonify({'error': 'No audio file provided'}), 400

    audio_file = request.files['audio']
    try:
        # Read the audio file
        audio_data, sampling_rate = sf.read(audio_file)

        # Ensure that the audio data is a numpy array.
        audio_data = np.array(audio_data)

        # Perform emotion recognition
        result = emotion_recognizer(audio_data)

        return jsonify(result), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)