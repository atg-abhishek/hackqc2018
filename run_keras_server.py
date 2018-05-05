from keras.applications import ResNet50
from keras.models import load_model
from keras.preprocessing.image import img_to_array
from keras.applications import imagenet_utils
from PIL import Image 
from flask import Flask, request, jsonify 
from flask_cors import CORS
import io, cv2 
import numpy as np 
from pprint import pprint 

app = Flask(__name__)
CORS(app)
model = None 

def engage_model():
    global model 
    model = load_model("test.model")

def prepare_image(image, target):
    # resize the image and preprocess it 
    image = cv2.imdecode(image, cv2.IMREAD_UNCHANGED)
    image = cv2.resize(image, target)
    image = image.astype("float") / 255.0
    image = img_to_array(image)
    image = np.expand_dims(image, axis=0)

    return image 

@app.route('/predict', methods=['POST'])
def predict():
    data = {'success' : False}
    
    if request.method == 'POST':
        if request.files.get('img'):
            filestr = request.files['img'].read()
            #convert string data to numpy array
            npimg = np.fromstring(filestr, np.uint8)
            image = prepare_image(npimg, (56, 56))

            tup = model.predict(image)[0]

            data['success'] = True 
        
    return jsonify({"results" : tup.tolist()})

if __name__ == "__main__":
    print("Loading Keras model and starting the server ... ")
    engage_model()
    app.run()