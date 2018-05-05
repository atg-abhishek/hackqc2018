from keras.preprocessing.image import img_to_array
from keras.models import load_model
import numpy as np 
import argparse, imutils, cv2, operator
from pprint import pprint 


def model_prediction(name):
    image = cv2.imread("./images/"+name+".png")
    RESIZE_SIZE = 56
    image = cv2.resize(image, (RESIZE_SIZE, RESIZE_SIZE))
    image = image.astype("float") / 255.0
    image = img_to_array(image)
    image = np.expand_dims(image, axis=0)
    # loading the model 

    print("[INFO] loading the model ... ")
    model = load_model("test.model")
    
    # classify the input image 

    tup = model.predict(image)[0]
    pprint(tup)
    index, value = max(enumerate(tup), key=operator.itemgetter(1))
    label = "{}: {:.2f}%".format(index, value * 100)
    return label