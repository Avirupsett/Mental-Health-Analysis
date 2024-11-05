import os
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'
import ydf
import pandas as pd
from flask import Flask, request,jsonify
import tensorflow as tf
import pickle
from keras_preprocessing.sequence import pad_sequences
import re
from textblob import TextBlob

app = Flask(__name__)

# Create a route decorator
@app.route('/')
def test():
    return 'Running Successfully!'

@app.route('/qamodel', methods=['POST'])
def predict():
    if request.method == 'POST':
        data = request.get_json()

        # Load the SavedModel
        loaded = ydf.from_tensorflow_decision_forests("./qaModel")

        data_format=pd.DataFrame.from_dict({
            'Occupation': [data['Occupation']],  # String type, shape should be compatible
            'Gender': [data['Gender']],  # String type, shape should be compatible
            'family_history': [data['family_history']],  # String type, shape should be compatible
            'treatment': [data['treatment']],  # String type, shape should be compatible
            'Days_Indoors': [data['Days_Indoors']],
            'Changes_Habits': [data['Changes_Habits']],  # String type, shape should be compatible
            'Mental_Health_History': [data['Mental_Health_History']],  # String type, shape should be compatible
            'Mood_Swings': [data['Mood_Swings']],  # String type, shape should be compatible
            'Coping_Struggles': [data['Coping_Struggles']],  # String type, shape should be compatible
            'Work_Interest': [data['Work_Interest']],  # String type, shape should be compatible
            'Social_Weakness': [data['Social_Weakness']],  # String type, shape should be compatible
            'mental_health_interview': [data['mental_health_interview']],
            'care_options': [data['care_options']],  # String type, shape should be compatible
        })

        # Extract the predicted value
        predicted_value = loaded.predict(data_format)[0]
        if predicted_value < 0:
            predicted_value = 0
        elif predicted_value > 0:
            predicted_value = (predicted_value/2.2) * 100

        return jsonify({'Stress Level': "{:.2f}".format(predicted_value)})

# Load model and tokenizer
model = tf.keras.models.load_model('./mental_health_model.keras')
with open('./tokenizer.pkl', 'rb') as f:
    tokenizer = pickle.load(f)

def clean_text(text):
    return re.sub(r"[^a-zA-Z\s]", '', text).lower().strip()

def predict_severity(comment):
    comment_seq = tokenizer.texts_to_sequences([clean_text(comment)])
    padded_comment = pad_sequences(comment_seq, maxlen=100, padding='post')
    severity_score = model.predict(padded_comment)[0][0]
    if TextBlob(comment).sentiment.polarity > 0.2:
        severity_percentage = max(0, (severity_score - 0.5) * 100)
    else:
        severity_percentage = severity_score * 100
    return float(severity_percentage)

@app.route('/sentimentmodel', methods=['POST'])
def get_severity():
    request_data = request.get_json()

    avg=0
    severity_scores = []

    # for item in request_data:
    for key, text in request_data.items():
        severity = predict_severity(text)
        avg+=severity
        severity_scores.append(severity)

    # Calculate the median of the severity scores
    # severity = statistics.median(severity_scores)
    severity = avg/len(severity_scores)
    
    return jsonify({"Stress Level": "{:.2f}".format(severity)})

# if __name__ == "__main__":
#     app.run(debug=True)



