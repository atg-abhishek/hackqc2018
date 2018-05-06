# from keras.applications import ResNet50
# from keras.models import load_model
# from keras.preprocessing.image import img_to_array
# from keras.applications import imagenet_utils
# from PIL import Image 
from flask import Flask, request, jsonify 
from flask_cors import CORS
from tinydb import TinyDB, Query
# import io, cv2 
# import numpy as np 
from pprint import pprint 

app = Flask(__name__)
CORS(app)
db = TinyDB('db.json')
users = db.table('users')
devices = db.table('devices')
User_Query = Query()
Device_Query = Query()
# model = None 

# def engage_model():
#     global model 
#     model = load_model("lenet.model")

# def prepare_image(image, target):
#     # resize the image and preprocess it 
#     image = cv2.imdecode(image, cv2.IMREAD_UNCHANGED)
#     image = cv2.resize(image, target)
#     image = image.astype("float") / 255.0
#     image = img_to_array(image)
#     image = np.expand_dims(image, axis=0)

#     return image 

# @app.route('/predict', methods=['POST'])
# def predict():
#     data = {'success' : False}
    
#     if request.method == 'POST':
#         if request.files.get('img'):
#             filestr = request.files['img'].read()
#             #convert string data to numpy array
#             npimg = np.fromstring(filestr, np.uint8)
#             image = prepare_image(npimg, (56, 56))

#             tup = model.predict(image)[0]

#             data['success'] = True 
        
#     return jsonify({"results" : tup.tolist()})

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

@app.route('/users/register', methods=['POST'])
def register_user():
    body = request.get_json()
    name = body['name']
    el = users.insert({'name' : name, 'friends' : [], 'devices' : []})
    users.update({'userid' : el.doc_id}, User_Query.name == name)
    return jsonify({"userid" : el.doc_id})


@app.route('/devices/register', methods=['POST'])
def register_device():
    body = request.get_json()
    name = body['name']
    el = devices.insert({'name' : name, "history" : []})
    devices.update({'deviceID' : el.doc_id} , Device_Query.name == name)
    return jsonify({"deviceID" : el.doc_id})

@app.route('/devices/<deviceID>/garbage', methods=["POST"])
def add_garbage(deviceID):
    return ""

@app.route('/users/<userid>/friends', methods=['POST'])
def add_friend(userid):
    body = request.get_json()
    friendid = body['friendid']
    el = users.search(User_Query.userid == userid)[0]
    lst = el['friends']
    lst.append(friendid)
    users.update({'friends' : lst}, User_Query.userid == userid)
    return jsonify({"result" : "success"})

@app.route('/users/<userid>/friends')
def return_friends(userid):
    lst = users.search(User_Query.userid == userid)[0]['friends']
    return jsonify({'result' : lst })

@app.route('/users/<userid>/devices', methods=['POST'])
def add_device(userid):
    body = request.get_json()
    deviceID = body['deviceID']
    el = users.search(User_Query.userid == userid)[0]
    lst = el['devices']
    lst.append(deviceID)
    users.update({'devices' : lst}, User_Query.userid == userid)
    return jsonify({"result" : "success"})

@app.route('/users/<userid>/devices')
def return_devices(userid):
    lst = users.search(User_Query.userid == userid)[0]['devices']
    return jsonify({'result' : lst })


'''
SCHEMA : 

users table: {'name' : 'asd', 'userid': 12, "friends" : [13,1,4], "devices" : [1,2,3]}
devices table: {'name' : "asd" ,'deviceID' : 1, "history" : [{"timestamp" : <standard format>, "garbage_value" : 3.7}, {}, {}]}

''' 

if __name__ == "__main__":
    print("Starting the server ... ")
    # engage_model()
    app.run()