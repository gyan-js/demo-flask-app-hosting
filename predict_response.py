import nltk
import tensorflow as tf
from keras.models import load_model
import json
import pickle
import numpy as np
import random
import os
from dotenv import load_dotenv

import get_stem_words

ignore_words = ['?', '!', '.', ',', "'", "'s", "'m", ":", ";"]
load_dotenv()

model_path = os.getenv("PATH_MODEL_FILE")
word_data_path = os.getenv("PATH_WORD_DATA_FILE")
class_data_path = os.getenv("PATH_CLASS_DATA_FILE")
train_path = os.getenv("PATH_TRAIN_DATA_FILE")

model = load_model(model_path)
intents = json.loads(open(train_path).read())
words = pickle.load(open(word_data_path, 'rb'))
classes = pickle.load(open(class_data_path, 'rb'))

def preprocess_user_input(user_input):
    input_token_1 = nltk.word_tokenize(user_input)
    input_token_2 = get_stem_words(input_token_1, ignore_words)
    input_token_2 = sorted(list(set(input_token_2)))

    bag=[]
    bag_of_words = []

    for word in words:
        if word  in input_token_2:
            bag_of_words.append(1)
        else:
            bag_of_words.append(0)
    bag.append(bag_of_words)

    return np.array(bag)

def bot_class_prediction(user_input):
    input = preprocess_user_input(user_input)
    prediction = model.predict(input)
    predicted_class_label = np.argmax(prediction[0])
    return predicted_class_label

def bot_response(user_input):
    predicted_label = bot_class_prediction(user_input)
    predicted_class = classes[predicted_label]

    for intent in intents["intents"]:
        if intent['tag'] == predicted_class:
            bot_response = random.choice(intent['responses'])
            return bot_response





    







