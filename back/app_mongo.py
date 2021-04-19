from flask import Flask, request, send_file
from flask import jsonify
from flask_restful import Api, Resource
from flask_marshmallow import Marshmallow
from dateutil.parser import parse
from datetime import datetime
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
from flask_cors import CORS
import base64
import re
import os      # For File Manipulations like get paths, rename
from flask import Flask, flash, request, redirect, render_template
from werkzeug.utils import secure_filename
from flask_mail import Mail, Message
from os import listdir
from os.path import isfile, join
import smtplib
import boto3
import requests
from botocore.exceptions import ClientError
from dotenv import load_dotenv, find_dotenv
from pymongo import MongoClient
from bson import ObjectId, json_util
import json

load_dotenv(find_dotenv())


s3 = boto3.client('s3', aws_access_key_id=os.environ.get('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.environ.get('AWS_SECRET_ACCESS_KEY'))

app = Flask(__name__, static_folder=os.path.dirname(__file__))
app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024    # 50 Mb limit
mail = Mail(app)  # instantiate the mail class
con = MongoClient(os.environ.get('DB_URL_MONGO'),27017)
db = con.get_database('VoiceContest')

t_users = db.get_collection('users')
t_contests = db.get_collection('contests')
t_voices = db.get_collection('voices')
 
# configuration of mail
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USERNAME'] = 'voice.contest.cloud@gmail.com'
app.config['MAIL_PASSWORD'] = 'Cl0ud123'
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True
mail = Mail(app)
app.config['SECRET_KEY'] = 'super-secret'
# sqlite:///test.db

CORS(app)
ma = Marshmallow(app)
api = Api(app)
jwt = JWTManager(app)
app.config["JWT_SECRET_KEY"] = "this-is-secret-key"

# It will allow below 16MB contents only, you can change it
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024
path = os.getcwd()
# file Upload

ORIGINALS_FOLDER = os.path.join(path, 'originals')
UNPROCESSED_FOLDER = os.path.join(path, 'unprocessed')
PROCESSED_FOLDER = os.path.join(path, 'processed')

if not os.path.isdir(ORIGINALS_FOLDER):
    os.mkdir(ORIGINALS_FOLDER)

app.config['ORIGINALS_FOLDER'] = ORIGINALS_FOLDER
app.config['UNPROCESSED_FOLDER'] = UNPROCESSED_FOLDER
app.config['PROCESSED_FOLDER'] = PROCESSED_FOLDER

ALLOWED_EXTENSIONS = set(['wav', 'mp3', 'ogg'])


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


class Contest_Shema(ma.Schema):
    class Meta:
        fields = ("_id", 'id',"owner_id", "name", "banner_path", "start_date",
                  "finish_date", "payment", "script", "recommendations", "url")


class User_Shema(ma.Schema):
    class Meta:
        fields = ("_id", "username", 'id')


class Voice_Shema(ma.Schema):
    class Meta:
        fields = ("_id", 'id',"related_contest_id", "name", "last_name", "email", "filename",
                  "original_voice_file_path", "transformed_voice_file_path", "observation_message", "post_date", "state")


post_contest_schema = Contest_Shema()
posts_contest_schema = Contest_Shema(many=True)

post_user_schema = User_Shema()
posts_user_schema = User_Shema(many=True)

post_voice_schema = Voice_Shema()
posts_voice_schema = Voice_Shema(many=True)

def parseJSON(x):
    x['_id'] = str(x['_id'])
    return x

@app.route("/auth", methods=["POST"])
def login():
    if request.is_json:
        username = request.json["username"]
        password = request.json["password"]
    else:
        username = request.form["username"]
        password = request.form["password"]

    x = t_users.find_one({"username": username})
    if x and x['password']==password:
        print(post_user_schema.dump(parseJSON(x)))
        access_token = create_access_token(identity=post_user_schema.dump(parseJSON(x)))
        return jsonify(message='Success', access_token=access_token), 201
    else:
        return jsonify(message="Bad Email or Password"), 401

class ResourceListUsers(Resource):
    def get(self):
        ls = []
        for x in t_users.find():
            x['_id'] = str(x['_id'])
            ls.append(x)
        return posts_user_schema.dump(ls)

    def post(self):
        exist_user = t_users.find_one({'username': request.json['username']})
        if exist_user:
            return {"error": "Username already taken, choose another one."}, 400
        print(request)
        t_users.insert_one({
            'username': request.json['username'],
            'password': request.json['password'],
            'id': request.json['id']
        })

        x = t_users.find_one({'username': request.json['username']})
        
        return post_user_schema.dump(parseJSON(x))


class ResourceOneUser(Resource):
    @jwt_required
    def get(self):
        print('entra')
        current_identity = get_jwt_identity()
        print(current_identity)
        user = t_users.find_one({'id': current_identity['id']})
        print(user)
        return post_user_schema.dump(parseJSON(user))

    @jwt_required
    def put(self):
        current_identity = get_jwt_identity()
        query = {'id': current_identity['id']}
        user = {}
        if 'username' in request.json:
            user['username'] = request.json['username']
        if 'password' in request.json:
            user['password'] = request.json['password']

        t_users.update_one(query, {"$set": user})
        return post_user_schema.dump(parseJSON(user))

    @jwt_required
    def delete(self):
        current_identity = get_jwt_identity()
        t_users.delete_one({'id': current_identity['id']})
        return "User deleted"


class ResourseListContests(Resource):
    @jwt_required
    def get(self):
        print('entra contests')
        current_identity = get_jwt_identity()
        print('current_identity',current_identity)
        contests = t_contests.find({'owner_id': current_identity['_id']})
        print('contests', contests)
        ls = []
        for x in contests:
            ls.append(parseJSON(x))
        unorderedListContest = posts_contest_schema.dump(ls)
        # orderedListContest = sorted(SS
        #     unorderedListContest, key=lambda x: x['start_date'])
        return unorderedListContest

    @jwt_required
    def post(self):
        print('posting')
        current_identity = get_jwt_identity()
        print('current_identity',current_identity)
        if 'name' not in request.json:
            return {"error": "Contest name missing"}, 412

        if 'url' not in request.json:
            return {"error": "Contest url missing"}, 412

        if 'banner_path' not in request.json:
            return {"error": "Contest banner missing"}, 412

        if 'payment' not in request.json:
            return {"error": "Contest payment missing"}, 412

        if 'start_date' not in request.json:
            return {"error": "Contest start date missing"}, 412

        if 'finish_date' not in request.json:
            return {"error": "Contest finish date missing"}, 412

        if 'script' not in request.json:
            return {"error": "Contest script missing"}, 412

        if 'recommendations' not in request.json:
            return {"error": "Contest recommendations missing"}, 412
        if 'id' not in request.json:
            return {'error': 'Contest id missing'}, 412
        newContest = {
            'name': request.json['name'],
            'owner_id': str(current_identity['_id']),
            'url': request.json['url'],
            'banner_path': request.json['banner_path'],
            'start_date': request.json['start_date'],
            'finish_date': request.json['finish_date'],
            'payment': request.json['payment'],
            'script': request.json['script'],
            'id': request.json['id'],
            'recommendations': request.json['recommendations']
        }
        x = t_contests.insert_one(newContest)
        newContest['_id'] = x.inserted_id
        return post_contest_schema.dump(parseJSON(newContest))


class ResourseOneContest(Resource):

    def get(self, url_contest):
        contest = t_contests.find_one({'url':url_contest})
        result = post_contest_schema.dump(parseJSON(contest))
        if len(result) == 0:
            return {"error": "Can not find the contest"}, 404
        return result

    @jwt_required
    def put(self, url_contest):
        current_identity = get_jwt_identity()
        u_contest = {}
        if 'name' in request.json:
            u_contest['name'] = request.json['name']
        if 'url' in request.json:
            u_contest['url'] = request.json['url']
        if 'banner_path' in request.json:
            u_contest['banner_path'] = request.json['banner_path']
        if 'start_date' in request.json:
            u_contest['start_date'] = request.json['start_date']
        if 'finish_date' in request.json:
            u_contest['start_date'] = request.json['finish_date']
        if 'payment' in request.json:
            u_contest['payment'] = request.json['payment']
        if 'script' in request.json:
            u_contest['script'] = request.json['script']
        if 'recommendations' in request.json:
            u_contest['recommendations'] = request.json['recommendations']
        query = {'owner_id':current_identity['_id'], 'url':url_contest}
        t_contests.update_one(query, {"$set":u_contest})
        return post_contest_schema.dump(u_contest)

    @jwt_required
    def delete(self, url_contest):
        current_identity = get_jwt_identity()
        t_contests.delete_one({
            'owner_id':current_identity['_id'], 'url':url_contest})
        return "Contest deleted"


class ResourseListVoices(Resource):
    def get(self, id_contest, page=1):
        per_page = 40
        voices = t_voices.find({'related_contest_id':id_contest}).skip(page).limit(per_page)
        ls = []
        for x in voices:
            ls.append(parseJSON(x))
        # "Ordenar por orden de insert en la tabla"
        orderedListVoices = posts_voice_schema.dump(ls)
        # orderedListContest = sorted(
        #     unorderedListVoices, key=lambda x: x['post_date'])
        return orderedListVoices

    def post(self, id_contest, page):

        if 'id' not in request.json:
            return {"error": "Voice id missing"}, 412
        if 'name' not in request.json:
            return {"error": "Voice name missing"}, 412

        if 'last_name' not in request.json:
            return {"error": "Voice last_name missing"}, 412

        if 'email' not in request.json:
            return {"error": "Voice email missing"}, 412

        if 'observation_message' not in request.json:
            return {"error": "Voice observation_message missing"}, 412
        """Falta original_file_path"""

        newVoice = {
            'id': request.json['id'],
            'related_contest_id': id_contest,
            'name':request.json['name'],
            'last_name':request.json['last_name'],
            'email':request.json['email'],
            'observation_message':request.json['observation_message'],
            'post_date':datetime.now(),
            'state':"En proceso"
        }
        x = t_voices.insert_one(newVoice)
        print(x.inserted_id)
        newVoice['_id'] = x.inserted_id
        return post_voice_schema.dump(parseJSON(newVoice))


class ResourseOneVoice(Resource):
    def get(self, id_contest, id_voice):
        voice = t_voices.find_one(
            {'related_contest_id':id_contest, 'id':id_voice})
        result = post_voice_schema.dump(voice)
        if not result:
            result = "Can not find the voice"
        return result

    def put(self, id_contest, id_voice):
        voice = {}

        if 'audio_file' not in request.files:
            return {'error': 'file not found'}
        file = request.files.get('audio_file')
        print(file.filename)
        if file.filename == '':
            flash('No file selected for uploading')
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            prefix = str(id_contest) + "_" + str(id_voice) + "_"
            original_file_path = os.path.join(
                app.config['ORIGINALS_FOLDER'],  prefix + filename)

            unprocessed_file_path = os.path.join(
                app.config['UNPROCESSED_FOLDER'],  prefix + filename)

            transformed_file_path = os.path.join(
                app.config['PROCESSED_FOLDER'], prefix + filename.split(".")[0] + ".mp3")

            voice['original_voice_file_path'] = original_file_path
            voice['transformed_voice_file_path'] = transformed_file_path
            voice['filename'] = prefix + filename
            flash('File successfully uploaded')
        else:
            return {"error": "File format is not acceptable"}, 412
        print(s3)
        s3.upload_fileobj(file, "voicecontest", 'originals/' + voice['filename'])

        t_voices.update_one({
            'related_contest_id':id_contest, 'id':id_voice}, {"$set": voice})
        updated_voice = t_voices.find_one({
            'related_contest_id':id_contest, 'id':id_voice})
        return post_voice_schema.dump(parseJSON(updated_voice))

    def delete(self, id_contest, id_voice):
        voice = t_voices.find_one_and_delete(
            {'related_contest_id':id_contest, 'id':id_voice})
        return post_voice_schema.dump(parseJSON(voice))


class ResourceVoiceUpdater(Resource):
    def get(self):
        voices = t_voices.find({'state':"En proceso"})
        ls = []
        for x in voices:
            x['state'] = "Procesada"
            t_voices.find_one_and_update({'id': x['id']}, x)
            ls.append(parseJSON(x))
        orderedListVoices = posts_voice_schema.dump(ls)
        return orderedListVoices


api.add_resource(ResourceListUsers, '/users')
api.add_resource(ResourceOneUser, '/users')
api.add_resource(ResourseListContests, '/contests')
api.add_resource(ResourseOneContest, '/contests/<string:url_contest>')
api.add_resource(ResourseListVoices,
                 '/contests/<string:id_contest>/voices/<int:page>')
api.add_resource(ResourseOneVoice,
                 '/contests/<string:id_contest>/voices/<string:id_voice>')
api.add_resource(ResourceVoiceUpdater, '/update-processed')

if __name__ == '__main__':
    app.run(debug=True, use_reloader=True)
