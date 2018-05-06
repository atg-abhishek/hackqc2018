import numpy as np 
from keras.preprocessing.image import ImageDataGenerator
from keras.models import Sequential
from keras.layers import Flatten, Dense, Dropout
from keras import applications
from pprint import pprint 

img_width, img_height = 150, 150

top_model_weights_path = 'bottleneck_fc_model.h5'
train_data_dir = "dataset-resized/training"
validation_data_dir = "dataset-resized/validation"
nb_train_samples = 2000
nb_validation_samples = 800
epochs = 50
batch_size = 16

def save_bottleneck_features():
    datagen = ImageDataGenerator(rescale=1./255)
    model = applications.VGG16(include_top=False, weights='imagenet')

    generator = datagen.flow_from_directory(train_data_dir, target_size=(img_width
    , img_height), batch_size=batch_size, class_mode='categorical', shuffle=False)
    bottleneck_features_train = model.predict_generator(generator, nb_train_samples // batch_size)
    np.save(open('bottleneck_features_train.npy', 'wb'), bottleneck_features_train)

    generator = datagen.flow_from_directory(validation_data_dir, target_size=(img_width
    , img_height), batch_size=batch_size, class_mode='categorical', shuffle=False)
    bottleneck_features_validation = model.predict_generator(generator, nb_validation_samples // batch_size)
    np.save(open('bottleneck_features_validation.npy', 'wb'), bottleneck_features_validation)

def train_top_model():
    train_data = np.load(open("bottleneck_features_train.npy", 'rb'))
    train_labels = np.array([0] * (nb_train_samples // 2) + [1] * (nb_train_samples // 2))

    validation_data = np.load(open('bottleneck_features_validation.npy','rb'))
    validation_labels = np.array([0] * (nb_validation_samples // 2) + [1] * (nb_validation_samples // 2))

    model = Sequential()
    model.add(Flatten(input_shape=train_data.shape[1:]))
    model.add(Dense(256, activation='relu'))
    model.add(Dropout(0.5))
    model.add(Dense(6, activation='softmax'))

    model.compile(optimizer='rmsprop',
                  loss='categorical_crossentropy', metrics=['accuracy'])

    pprint(train_labels)
    model.fit(train_data, train_labels, epochs=epochs, batch_size=batch_size, validation_data=(validation_data, validation_labels))
    model.save_weights(top_model_weights_path)

save_bottleneck_features()
# train_top_model()