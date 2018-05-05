from flask import Flask, request, jsonify 
from tinydb import TinyDB
import keras

app = Flask(__name__)

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
    app.run(debug=True)