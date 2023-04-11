from flask import Flask, render_template, request, jsonify
from model_prediction import *
from dotenv import load_dotenv
import os
import pymongo
from predict_response import bot_response
app = Flask(__name__)
text=""
predicted_emotion=""
predicted_emotion_img_url=""

load_dotenv()

mongo_connection = os.getenv("CONNECT_TO_MONGO_CLIENT")
client = pymongo.MongoClient(mongo_connection)

db = client["test"]
collection = db["testtable"]

@app.route("/")
def home():
    entries = show_entry()
    return render_template("index.html", entries=entries)
    

@app.route("/predict-emotion", methods=["POST"])
def predict_emotion():
    input_text = request.json.get("text")
    if not input_text:
        return jsonify({
            "status": "error",
            "message": "Please enter some text to predict emotion!"
        }), 400
    else:
        predicted_emotion, predicted_emotion_img_url = predict(input_text)                         
        return jsonify({
            "data": {
                "predicted_emotion": predicted_emotion,
                "predicted_emotion_img_url": predicted_emotion_img_url
            },
            "status": "success"
        }), 200
        
@app.route("/save-entry", methods=["POST"])

def save_entry():
    data_entry_path = os.getenv("PATH_TO_DATA_ENTRY")
    date = request.json.get("date")
    emotion = request.json.get("emotion")
    save_text = request.json.get("text")
    emotion_url = request.json.get("emotion_url")
    save_text = save_text.replace("\n", "")

    entry = f'"{date}","{save_text}","{emotion}","{emotion_url}"\n'


    with open(data_entry_path, 'a') as f:
        f.write(entry)
    return jsonify("Success")

@app.route("/bot-response", methods=["POST"])   

def bot():
    input_text = request.json.get("user_bot_input_text")
    bot_res = bot_response(input_text)

    response = {
        "bot_response": bot_res
    }

    return jsonify(response)



if __name__ == "__main__":
    app.run(debug=True)
