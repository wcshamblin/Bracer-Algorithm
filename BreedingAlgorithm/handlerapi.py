from flask import Flask, render_template, redirect, url_for,request
from flask import make_response
from flask import make_response
from flask import jsonify
from flask_cors import CORS, cross_origin
from json import dumps

from boxbreed import boxbreed

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

# POSTs must have Content-Type: application/json header

@app.route("/")
@cross_origin()
def slash():
    return "Use route /gtlbreed/ or /boxbreed/"

@app.route("/gtlbreed/", methods=['GET', 'POST'])
@cross_origin()
def gtlroute():
    if request.method == 'GET':
        return("No data to return - need POST")
    if request.method == 'POST':
        # Get data from gtl breed algo
        return("Data")

@app.route('/boxbreed/', methods=['GET', 'POST'])
@cross_origin()
def boxroute():
    if request.method == 'GET':
        return("No data to return - need POST")
    if request.method == 'POST':
        # Get data from box breed algo
        data = jsonify(boxbreed(request.json))
        resp = make_response(data)
        resp.mimetype = "application/json"
        return(resp)
app.run(host='0.0.0.0', port=5001, debug=False)