import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from keras.preprocessing.image import img_to_array
from keras.models import Sequential
from keras.layers import Conv2D, Dense, Flatten, MaxPool2D
from keras.utils import to_categorical
from keras.optimizers import Adam
import cv2, random, os
from imutils import paths
import numpy as np
from sklearn.model_selection import train_test_split
import simplejson as json

'''

Build model 
Preprocess images
generate labels  
Separate into training and validation images 
Train model 
evaluate model 
Save model 

in a separate file: 
run inference  


'''

def build_model(width, height, depth, classes):
    print("Building the model ... ")
    model = Sequential()
    inputShape = (height, width, depth)

    model.add(Conv2D(32, (3,3), padding='same', input_shape=inputShape, activation='relu'))
    model.add(MaxPool2D(pool_size=(2,2), strides=(2,2)))

    model.add(Flatten())
    model.add(Dense(500, activation='relu'))
    model.add(Dense(classes, activation='softmax'))

    return model 

def preprocess_images(dataset_path, resize_param):
    print("Processing the images ... ")
    data = []
    labels = []
    images = sorted(list(paths.list_images(dataset_path)))
    random.seed(42)
    random.shuffle(images)
    RESIZE_PARAM = resize_param
    TARGET = (RESIZE_PARAM, RESIZE_PARAM)
    for imagePath in images:
        image = cv2.imread(imagePath)
        image = cv2.resize(image, TARGET)
        image = img_to_array(image)
        data.append(image)

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

    data = np.array(data, dtype="float") /255.0 
    labels = np.array(labels)
    return (data, labels)

def prepare_train_test(data, labels, classes, test_size):
    print("Preparing the train and test split ... ")
    (trainX, testX, trainY, testY) = train_test_split(data, labels, test_size = test_size, random_state=42)
    trainY = to_categorical(trainY, num_classes=classes)
    testY = to_categorical(testY, num_classes=classes)

    return (trainX, trainY, testX, testY)

def compile_model(model, classes, resize_param, init_lr, epochs):
    print("Compiling the model ... ")
    INIT_LR = init_lr
    EPOCHS = epochs
    RESIZE_PARAM = resize_param
    opt = Adam(lr=INIT_LR, decay=INIT_LR/EPOCHS)
    model.compile(loss='categorical_crossentropy', optimizer=opt, metrics=['accuracy'])

    return model 

def evaluate_and_save_model(model, model_path, trainX, trainY, testX, testY, batch_size, epochs):
    print("Evaluating the model ... ")
    H = model.fit(trainX, trainY, batch_size=batch_size, epochs=epochs, validation_data=(testX, testY), verbose=1)
    print("Saving the model ... ")
    model.save(model_path)

    return H

def visualize(H, plot_path, epochs):
    plt.style.use('ggplot')
    plt.figure()
    N = epochs
    plt.plot(np.arange(0,N), H.history['loss'], label='train_loss')
    plt.plot(np.arange(0,N), H.history['val_loss'], label='val_loss')
    plt.plot(np.arange(0,N), H.history['acc'], label='accuracy')
    plt.plot(np.arange(0,N), H.history['val_acc'], label='val_accuracy')
    plt.title("Training and Validation Loss for Different kinds of trash")
    plt.xlabel('# of Epochs')
    plt.ylabel("Loss/Accuracy")
    plt.legend(loc='lower left')
    plt.savefig(plot_path)

TRIAL_NUMBER = 1
if not os.path.exists("info/Trial"+str(TRIAL_NUMBER)):
    os.makedirs("info/Trial"+str(TRIAL_NUMBER))
BASEPATH = "info/Trial"+str(TRIAL_NUMBER)+"/"
hyperparams = {"resize_param" : 28, "classes" : 6, "learning_rate" : 1e-3, "epochs" : 20, "batch_size" : 16, "test_size" : 0.25}

with open(BASEPATH+"hyperparams"+str(TRIAL_NUMBER)+".json", 'w') as outfile:
    json.dump(hyperparams, outfile)

model = build_model(hyperparams['resize_param'], hyperparams['resize_param'], 3, hyperparams['classes'])

(data, labels) = preprocess_images("dataset/dataset-resized", hyperparams['resize_param'])

(trainX, trainY, testX, testY) = prepare_train_test(data, labels, hyperparams['classes'], hyperparams['test_size'])

model = compile_model(model, hyperparams['classes'], hyperparams['resize_param'], hyperparams['learning_rate'] , hyperparams['epochs'])

H = evaluate_and_save_model(model, BASEPATH+"hello_"+str(TRIAL_NUMBER)+".model", trainX, trainY, testX, testY, hyperparams['batch_size'] , hyperparams['epochs'])

visualize(H, BASEPATH+"plot_hello_" + str(TRIAL_NUMBER) + ".png", hyperparams['epochs'])



