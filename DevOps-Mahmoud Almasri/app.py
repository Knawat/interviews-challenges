import os
import subprocess
from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from bson.objectid import ObjectId

#get the username and password of the DB from the bined volume
mongoadmin = os.popen("cat /etc/secret-volume/username").read()
adminpassword = os.popen("cat /etc/secret-volume/password").read()


app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb://{}:{}@mongo:27017/admin".format(mongoadmin, adminpassword)
mongo = PyMongo(app)
db = mongo.db

@app.route('/')
def welcome_message():
    #print the the DB connection string
    return "mongodb://{}:{}@mongo:27017/".format(mongoadmin, adminpassword)

@app.route('/cron-endpoint')
def cron_job():
    return "Hi Cron Job!"

if __name__ == "__main__":
    app.debug = True
    app.run(debug=True,host='0.0.0.0',port=int(os.environ.get('PORT', 8080)))
