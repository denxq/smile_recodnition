import random
from os.path import exists

from keras.layers import Dense, Conv2D, MaxPooling2D, Flatten
from keras.models import Sequential, load_model
from keras.preprocessing.image import img_to_array

import numpy as np
from PIL import Image
import glob


names = [name for name in glob.glob("datas/*")]
random.shuffle(names)

x_train = np.array([img_to_array(Image.open(name)) / 255. for name in names])
y_train = np.array([float(name.split("_")[2].replace(".jpg", "")) for name in names])

y_train = y_train.reshape((len(y_train), 1))

img_size = 32

class Net():

    def __init__(self, image_size, _x_train, _y_train, epochs, names):
        self.model = Sequential()
        self.image_size = image_size

        self.names = names

        self.x_train = _x_train
        self.y_train = _y_train

        self.epochs = epochs

    def build_net(self):
        if not exists("model_data/model.h5"):
            self.model.add(Conv2D(filters=32, kernel_size=3, input_shape=(self.image_size, self.image_size, 4), activation='relu'))
            self.model.add(MaxPooling2D(2, 2))

            self.model.add(Conv2D(filters=32, kernel_size=3, activation='relu'))
            self.model.add(MaxPooling2D(2, 2))

            self.model.add(Flatten())

            self.model.add(Dense(1152, activation='relu'))
            self.model.add(Dense(1, activation='sigmoid'))

            self.model.compile(loss='binary_crossentropy', optimizer='adam', metrics=['accuracy'])

            self.model.fit(self.x_train, self.y_train, epochs=self.epochs, batch_size=16)
            self.model.save("model_data/model.h5", overwrite=True, include_optimizer=True)

        else:
            self.model = load_model("model_data/model.h5")

    def train(self):

        random.shuffle(self.names)

        __x_train = np.array([img_to_array(Image.open(name)) / 255. for name in self.names])
        __y_train = np.array([float(name.split("_")[2].replace(".jpg", "")) for name in self.names])

        self.model.fit(__x_train, __y_train, epochs=self.epochs, batch_size=16)
        self.model.save("model_data/model.h5", overwrite=True, include_optimizer=True)
