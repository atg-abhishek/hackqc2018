'''
inspired from pyimagesearch tutorial
'''

from keras.models import Sequential
from keras.layers.convolutional import Conv2D
from keras.layers.convolutional import MaxPooling2D
from keras.layers.core import Activation
from keras.layers.core import Flatten 
from keras.layers.core import Dense 
from keras.layers.core import Dropout
from keras import backend as K 

class LeNet_modified:
    @staticmethod
    def build(width, height, depth, classes):
        # initialize the model 
        model = Sequential()
        inputShape = (height, width, depth) #channels_last convention for the TF backend
        
        # if we're using channels first, update the input shape 
        if K.image_data_format() == 'channels_first':
            inputShape = (depth, height, width)
        
        #first set of CONV, RELU, POOL layers

        model.add(Conv2D(20, (5,5), padding="same", input_shape = inputShape))
        model.add(Activation('relu'))
        model.add(MaxPooling2D(pool_size=(2,2),strides=(2,2) ))

        #second set of CONV, RELU, POOl layers 

        model.add(Conv2D(50, (5,5), padding='same'))
        model.add(Activation('relu'))
        model.add(MaxPooling2D(pool_size=(2,2), strides=(2,2)))

        #third set of CONV, RELU and POOL layers 

        model.add(Conv2D(100, (5,5), padding='same'))
        model.add(Activation('relu'))
        model.add(MaxPooling2D(pool_size=(2,2), strides=(2,2)))

        #fourth set of CONV, RELU and POOL layers 

        model.add(Conv2D(200, (5,5), padding='same'))
        model.add(Activation('relu'))
        model.add(MaxPooling2D(pool_size=(2,2), strides=(2,2)))

        # first set of FC layer => RELU 

        model.add(Flatten())
        model.add(Dense(500))
        model.add(Activation("relu"))

        # second set of FC layer => RELU

        model.add(Dense(500))
        model.add(Activation("relu"))

        #softmax classifier 

        model.add(Dense(classes))
        model.add(Activation('softmax'))

        #return the constructed model 

        return model 

class LeNet():
    @staticmethod
    def build(width, height, depth, classes):
        model = Sequential()
        inputShape = (height, width, depth) #channels_last convention for the TF backend
        
        # if we're using channels first, update the input shape 
        if K.image_data_format() == 'channels_first':
            inputShape = (depth, height, width)
        
        model.add(Conv2D(10, (3,3), input_shape=inputShape))
        model.add(Activation("relu"))
        model.add(MaxPooling2D(pool_size=(2,2)))

        # model.add(Conv2D(32, (3,3)))
        # model.add(Activation("relu"))
        # model.add(MaxPooling2D(pool_size=(2,2)))

        # model.add(Conv2D(64, (3,3)))
        # model.add(Activation("relu"))
        # model.add(MaxPooling2D(pool_size=(2,2)))

        model.add(Flatten())
        model.add(Dense(10))
        model.add(Activation("relu"))
        # model.add(Dropout(0.5))
        model.add(Dense(classes))
        model.add(Activation("softmax"))

        return model 

class TopModel():
    @staticmethod
    def build(width, height, depth, classes):
        inputShape = (height, width, depth)
        model = Sequential()
        model.add(Flatten(input_shape=inputShape))
        model.add(Dense(256, activation='relu'))
        model.add(Dropout(0.5))
        model.add(Dense(classes, activation='softmax'))

        return model