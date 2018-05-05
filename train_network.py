'''
inspired from pyimagesearch tutorial
'''

# set the matplotlib backend so figures can be saved in the background 

import matplotlib
matplotlib.use('Agg')

from keras.preprocessing.image import ImageDataGenerator
from keras.optimizers import Adam
from sklearn.model_selection import train_test_split
from keras.preprocessing import img_to_array
from keras.utils import to_categorical
from dl_arch import LeNet
from imutils import paths 
import matplotlib.pyplot as plt 
import numpy as np 
import argparse, random, cv2, os 

# construct the argument parse and parse the arguments 
ap = argparse.ArgumentParser()
ap.add_argument("-d", "--dataset", required=True, help="path to input data")
ap.add_argument("-m", "--model", required=True, help='path to output model ')
ap.add_argument('-p', '--plot', type=str, default='plot.png', help="path to output accuracy/loss plot")
args = vars(ap.parse_args())

# initialize the number of epochs, learning rate, and batch size 
EPOCHS = 25
INIT_LR = 1e-3
BS = 32

# initialize the data and labels 
print("[INFO] loading images ..."  )
data = []
labels = []

# grab the image paths and randomly shuffle them 
imagePaths = sorted(list(paths.list_images(args['dataset'])))
random.seed(42)
random.shuffle(imagePaths)

# looping over the images to preprocess them 

for imagePath in imagePaths:
    #load the image, preprocess it and then store it into "data"
    image = cv2.imread(imagePath)
    image = cv2.resize(image, (28,28))
    image = img_to_array(image)
    data.append(image)

    # extract the class label from the image path and then update the labels list 
    '''
    LABEL mapping 
    0: trash 
    1: cardboard
    2: glass
    3: metal
    4: paper
    5: plastic
    '''
    label_value = imagePath.split(os.path.sep)[-2]
    label = 0 # trash 
    if label_value == "cardboard":
        label = 1
    elif label_value == "glass":
        label = 2
    elif label_value == "metal":
        label = 3
    elif label_value == "paper":
        label = 4
    if label_value == "plastic":
        label = 5
    
    labels.append(label)

# scaling raw pixel intensities 

data = np.array(data, dtype="float") /255.0 
labels = np.array(labels)

(trainX, testX, trainY, testY) = train_test_split(data, labels, test_size = 0.25, random_state=42)

# converting the labels from integers to vectors 

trainY = to_categorical(trainY, num_classes=6)
testY = to_categorical(testY, num_classes=6)

# construct the image generator for data augmentation 
aug = ImageDataGenerator(rotation_range=30, width_shift_range=0.1, height_shift_range=0.1, shear_range=0.2, zoom_range=0.2, horizontal_flip=True, fill_mode="nearest")

#initialize the model 

print('[INFO] compiling the model ...')
model = LeNet.build(width=28, height=28, depth=3, classes=6)
opt = Adam(lr=INIT_LR, decay=INIT_LR/EPOCHS)
model.compile(loss='categorical_crossentropy', optimizer=opt, metrics=['accuracy'])

#train the network 

print("[INFO] training the network ... ")

