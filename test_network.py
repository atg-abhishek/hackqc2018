'''
inspired from pyimagesearch tutorial
'''

from keras.preprocessing.image import img_to_array
from keras.models import load_model
import numpy as np 
import argparse, imutils, cv2, operator
from pprint import pprint 

# construct the command line arguments 

ap = argparse.ArgumentParser()
ap.add_argument("-m", "--model", required=True, help="path to the trained model")
ap.add_argument("-i", "--image", required=True, help="path to the input image")
args = vars(ap.parse_args())

# loading the image 

image = cv2.imread(args['image'])
orig = image.copy()

# preprocess the image for classification 

RESIZE_SIZE = 56
image = cv2.resize(image, (RESIZE_SIZE, RESIZE_SIZE))
image = image.astype("float") / 255.0
image = img_to_array(image)
image = np.expand_dims(image, axis=0)

# loading the model 

print("[INFO] loading the model ... ")
model = load_model(args['model'])

# classify the input image 

tup = model.predict(image)[0]
pprint(tup)
index, value = max(enumerate(tup), key=operator.itemgetter(1))
label = "{}: {:.2f}%".format(index, value * 100)

# draw the label in the image 

output = imutils.resize(orig, width=400)
cv2.putText(output, label, (10, 25),  cv2.FONT_HERSHEY_SIMPLEX,0.7, (0, 255, 0), 2)

# show the output image 

cv2.imshow('Output', output)
cv2.waitKey(0)