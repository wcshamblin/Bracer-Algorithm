from flask import Flask, render_template, redirect, url_for,request
from flask import make_response
from flask import make_response
from flask import jsonify
from flask_cors import CORS, cross_origin
from json import dumps

from boxbreed import boxbreed, logger_set

logger = logger_set('Flask-CORS')
logger.info("Handler live")


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
        logger.debug("Returning JSON to frontend")
        return(resp)