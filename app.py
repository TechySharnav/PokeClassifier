import os
import asyncio
from fastai import *
from fastai.vision import Path, load_learner, open_image, sys
from io import BytesIO
from flask import Flask, jsonify, request
import requests

export_file_name = 'model.pkl'

file_path = Path("pokemons.txt")

with open(file_path) as file:
    classes = file.readlines()

path = Path(__file__).parent

async def setup_learner():
    try:
        learn = load_learner(path, export_file_name)
        return learn
    except RuntimeError as e:
        print(e)

loop = asyncio.get_event_loop()
tasks = [asyncio.ensure_future(setup_learner())]
learn = loop.run_until_complete(asyncio.gather(*tasks))[0]
loop.close()

app = Flask(__name__)


@app.route("/predictPoke", methods=["GET", "POST"])
def predict():
    if request.method == "GET":
        img = request.args.get("link")
        img_bytes = requests.get(img).content
    elif request.method=="POST":
        img = request.files
        img_bytes = img["file"].read()

    image = open_image(BytesIO(img_bytes))
    prediction = learn.predict(image)[0]
    return jsonify({'result': str(prediction)})


if __name__ == "__main__":
    app.run()