from flask import Flask, render_template, redirect, url_for,request
from flask import make_response

app = Flask(__name__)

@app.route("/")
def slash():
    return "Use route /gtlbreed/ or /boxbreed/"

@app.route("/gtlbreed", methods=['GET', 'POST'])
def gtlbreed():
    if request.method == 'GET':
        return("No data to return - need POST")
    if request.method == 'POST':
        # Get data from gtl breed algo
        return("Data")

@app.route('/boxbreed', methods=['GET', 'POST'])
def gtlbreed():
    if request.method == 'GET':
        return("No data to return - need POST")
    if request.method == 'POST':
        # Get data from box breed algo
        return("Data")

app.run(debug = True)