from flask import Flask, request, jsonify
from flask_cors import CORS  
from tinydb import TinyDB
import os
from make_prediction import model_prediction
from PIL import Image 

app = Flask(__name__)
CORS(app)

@app.route('/')
def hello():
    return "Welcome to the HackQC 2018 server"

@app.route('/garbage', methods=['POST'])
def garbage():
    body = request.get_json()
    lbs = body['lbs']
    deviceID = body['deviceID']
    # TODO: generate timestamp before inserting 
    return jsonify({'lbs' : lbs, 'deviceID': deviceID})

@app.route('/users/<userid>/garbage')
def users(userid):
    return "user is " + str(userid)

@app.route('/images', methods=['POST'])
def images():
    print("reached the endpoint ")
    img = request.files['img']
    name = request.form['name']
    img = Image.open(img)
    img = img.resize((400, 400))
    img.save(os.path.join("./images/", name+".png"))
    label = model_prediction(name)
    return jsonify({"result" : label})

# TODO: create user on the fly if it is a new user 
# TODO: historical value storing per device 
# TODO: multiple devices per user 
# TODO: friends list for users 
# TODO: ResNet50 to train on trash dataset

'''
SCHEMA : 

users table: { 'userid': 12, "friends" : [13,1,4], "devices" : [1,2,3]}
devices table: {'deviceID' : 1, "history" : [{"timestamp" : <standard format>, "garbage_value" : 3.7}, {}, {}]}

''' 

if __name__ == "__main__":
    app.run(threaded=True)