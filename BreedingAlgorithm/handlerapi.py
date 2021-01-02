from flask import Flask, render_template, redirect, url_for,request
from flask import make_response
from json import dumps

from boxbreed import boxbreed

app = Flask(__name__)

# POSTs must have Content-Type: application/json header

@app.route("/")
def slash():
    return "Use route /gtlbreed/ or /boxbreed/"

@app.route("/gtlbreed/", methods=['GET', 'POST'])
def gtlroute():
    if request.method == 'GET':
        return("No data to return - need POST")
    if request.method == 'POST':
        # Get data from gtl breed algo
        return("Data")

@app.route('/boxbreed/', methods=['GET', 'POST'])
def boxroute():
    if request.method == 'GET':
        return("No data to return - need POST")
    if request.method == 'POST':
        # Get data from box breed algo
        return(boxbreed(request.json))

app.run(debug=True)