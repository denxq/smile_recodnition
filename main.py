import numpy
from flask import Flask, render_template
from flask_socketio import SocketIO

from net import *

import base64, glob
from io import BytesIO

app = Flask(__name__)


socket = SocketIO(app, cors_allowed_origins='*')

class_net = Net(_x_train=x_train, _y_train=y_train, image_size=img_size, epochs=1, names=names)
class_net.build_net()


@app.route('/', methods=["GET"])
def index():
    return render_template('index.html')

@socket.on('download')
def download(data_image):

    list_of_files = glob.glob('datas/*')
    image_data, emoji = data_image['image'].replace('data:image/png;base64,', ''), data_image['emoji']

    _len = len(list_of_files)

    with open(f'datas/smile_{_len}_{emoji}.jpg', 'wb') as f:
        f.write(base64.b64decode(image_data))


@socket.on('predict')
def predict(dict):

    image_data = base64.b64decode(dict["image"].replace("data:image/png;base64,", ""))

    bytes_data = BytesIO(image_data)

    img = img_to_array(Image.open(bytes_data)) / 255.

    prediction = class_net.model.predict(numpy.array([img]))[0][0]

    socket.emit('predict', {'prediction': str(round(prediction * 100, 2))})


@socket.on('train')
def train():
    class_net.train()


if __name__ == "__main__":
    app.run(debug=True)
