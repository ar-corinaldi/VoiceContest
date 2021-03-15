from flask import Flask, request, send_file
from flask import jsonify
from flask_restful import Api, Resource
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import relationship
from flask_marshmallow import Marshmallow
from dateutil.parser import parse
from datetime import datetime
from flask_jwt import JWT, jwt_required, current_identity
from werkzeug.security import safe_str_cmp
from flask_cors import CORS
from flask_script import Manager
from flask_migrate import Migrate, MigrateCommand
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

load_dotenv(find_dotenv())


def authenticate(username, password):
    user = User.query.filter_by(username=username).first()
    if user and user.password == password:
        return user


def identity(payload):
    user_id = payload['identity']
    return User.query.filter_by(id=user_id).first()


app = Flask(__name__, static_folder=os.path.dirname(__file__))
app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024    # 50 Mb limit
mail = Mail(app)  # instantiate the mail class

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
print(app.config['ENV'])
if app.config['ENV'] == 'production':
    app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get('DB_URL_PROD')
else:
    app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get('DB_URL_TEST')

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
CORS(app)
db = SQLAlchemy(app)
ma = Marshmallow(app)
api = Api(app)
jwt = JWT(app, authenticate, identity)
migrate = Migrate(app, db)
manager = Manager(app)

manager.add_command('db', MigrateCommand)
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


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(100))
    contests = db.relationship('Contest', backref='owner')


class Contest(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    owner_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    url = db.Column(db.String(100), unique=True)
    banner_path = db.Column(db.String(500))
    start_date = db.Column(db.String(100))
    finish_date = db.Column(db.String(100))
    payment = db.Column(db.String(20))
    script = db.Column(db.String(500))
    recommendations = db.Column(db.String(500))
    voices = db.relationship('Voice', backref='relatedContest')


"""los nombres, los apellidos, el email, el archivo de audio con la voz y un mensaje con las observaciones que el usuario quiera realizar sobre la voz enviada."""


class Voice(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    related_contest_id = db.Column(
        db.Integer, db.ForeignKey('contest.id'), nullable=False)
    name = db.Column(db.String(100))
    last_name = db.Column(db.String(100))
    email = db.Column(db.String(100))
    original_voice_file_path = db.Column(db.String(500))
    transformed_voice_file_path = db.Column(db.String(500))
    observation_message = db.Column(db.String(500))
    post_date = db.Column(db.Date)
    state = db.Column(db.String(100))
    filename = db.Column(db.String(100))


class Contest_Shema(ma.Schema):
    class Meta:
        fields = ("id", "owner_id", "name", "banner_path", "start_date",
                  "finish_date", "payment", "script", "recommendations", "url")


class User_Shema(ma.Schema):
    class Meta:
        fields = ("id", "username")


class Voice_Shema(ma.Schema):
    class Meta:
        fields = ("id", "related_contest_id", "name", "last_name", "email", "filename",
                  "original_voice_file_path", "transformed_voice_file_path", "observation_message", "post_date", "state")


post_contest_schema = Contest_Shema()
posts_contest_schema = Contest_Shema(many=True)

post_user_schema = User_Shema()
posts_user_schema = User_Shema(many=True)

post_voice_schema = Voice_Shema()
posts_voice_schema = Voice_Shema(many=True)


@app.route("/<int:id_contest>/<int:id_voice>/downloadVoiceOriginal")
def downloadVoice(id_contest, id_voice):
    voice = Voice.query.filter_by(
        related_contest_id=id_contest, id=id_voice).first()
    print(voice.original_voice_file_path)
    return send_file(voice.original_voice_file_path, mimetype="audio/mpeg", as_attachment=True, attachment_filename=voice.filename)


@app.route("/<int:id_contest>/<int:id_voice>/downloadVoiceConverted")
def getVoiceConverted(id_contest, id_voice):
    print("ACAAAAA")
    voice = Voice.query.filter_by(
        related_contest_id=id_contest, id=id_voice).first()
    print(voice.filename, "SI")
    extension = voice.filename.split(".")[1]
    print(voice.transformed_voice_file_path, "PRINT 2")
    print(voice.original_voice_file_path.replace(extension, "mp3"))
    return send_file(voice.transformed_voice_file_path, mimetype="audio/mpeg", as_attachment=True, attachment_filename=voice.filename.replace(extension, "mp3"))


@app.route("/<int:id_contest>/getLenVoices")
def getLenVoices(id_contest):
    count = Voice.query.filter_by(related_contest_id=id_contest).all()
    return {"totalVoices": len(count)}


class ResourceListUsers(Resource):
    def get(self):
        users = User.query.all()
        return posts_user_schema.dump(users)

    def post(self):
        signedUser = User.query.filter_by(
            username=request.json['username']).first()
        if signedUser:
            return {"error": "Username already taken, choose another one."}, 400
        newUser = User(
            username=request.json['username'],
            password=request.json['password']
        )
        db.session.add(newUser)
        db.session.commit()
        return post_user_schema.dump(newUser)


class ResourceOneUser(Resource):
    @jwt_required()
    def get(self):
        user = User.query.get_or_404(current_identity.id)
        return post_user_schema.dump(user)

    @jwt_required()
    def put(self):
        user = User.query.get_or_404(current_identity.id)
        if 'username' in request.json:
            user.username = request.json['username']
        if 'password' in request.json:
            user.password = request.json['password']
        db.session.commit()
        return post_user_schema.dump(user)

    @jwt_required()
    def delete(self):
        user = User.query.get_or_404(current_identity.id)
        db.session.delete(user)
        db.session.commit()
        return "User deleted"


class ResourseListContests(Resource):
    @jwt_required()
    def get(self):
        contests = Contest.query.filter(
            Contest.owner_id == current_identity.id)
        unorderedListContest = posts_contest_schema.dump(contests)
        orderedListContest = sorted(
            unorderedListContest, key=lambda x: x['start_date'])
        return orderedListContest

    @jwt_required()
    def post(self):
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

        newContest = Contest(
            name=request.json['name'],
            owner_id=current_identity.id,
            url=request.json['url'],
            banner_path=request.json['banner_path'],
            start_date=request.json['start_date'],
            finish_date=request.json['finish_date'],
            payment=request.json['payment'],
            script=request.json['script'],
            recommendations=request.json['recommendations']
        )
        db.session.add(newContest)
        db.session.commit()
        return post_contest_schema.dump(newContest)


class ResourseOneContest(Resource):

    def get(self, url_contest):
        contest = Contest.query.filter_by(url=url_contest).first()
        result = post_contest_schema.dump(contest)
        if len(result) == 0:
            return {"error": "Can not find the contest"}, 404
        return result

    @jwt_required()
    def put(self, url_contest):
        contest = Contest.query.filter_by(
            owner_id=current_identity.id, url=url_contest).first()
        if 'name' in request.json:
            contest.name = request.json['name']
        if 'url' in request.json:
            contest.url = request.json['url']
        if 'banner_path' in request.json:
            contest.banner_path = request.json['banner_path']
        if 'start_date' in request.json:
            contest.start_date = request.json['start_date']
        if 'finish_date' in request.json:
            contest.start_date = request.json['finish_date']
        if 'payment' in request.json:
            contest.payment = request.json['payment']
        if 'script' in request.json:
            contest.script = request.json['script']
        if 'recommendations' in request.json:
            contest.recommendations = request.json['recommendations']
        db.session.commit()
        return post_contest_schema.dump(contest)

    @jwt_required()
    def delete(self, url_contest):
        contest = Contest.query.filter_by(
            owner_id=current_identity.id, url=url_contest).first()
        db.session.delete(contest)
        db.session.commit()
        return "Contest deleted"


class ResourseListVoices(Resource):
    def get(self, id_contest, page=1):
        per_page = 40
        voices = Voice.query.filter_by(related_contest_id=id_contest).order_by(
            Voice.post_date.asc()).paginate(page, per_page, error_out=False)
        # "Ordenar por orden de insert en la tabla"
        orderedListVoices = posts_voice_schema.dump(voices.items)
        # orderedListContest = sorted(
        #     unorderedListVoices, key=lambda x: x['post_date'])
        return orderedListVoices

    def post(self, id_contest, page):

        if 'name' not in request.json:
            return {"error": "Voice name missing"}, 412

        if 'last_name' not in request.json:
            return {"error": "Voice last_name missing"}, 412

        if 'email' not in request.json:
            return {"error": "Voice email missing"}, 412

        if 'observation_message' not in request.json:
            return {"error": "Voice observation_message missing"}, 412
        """Falta original_file_path"""
        newVoice = Voice(
            related_contest_id=id_contest,
            name=request.json['name'],
            last_name=request.json['last_name'],
            email=request.json['email'],
            observation_message=request.json['observation_message'],
            post_date=datetime.now(),
            state="En proceso"
        )
        db.session.add(newVoice)
        db.session.commit()
        return post_voice_schema.dump(newVoice)


class ResourseOneVoice(Resource):
    def get(self, id_contest, id_voice):
        voice = Voice.query.filter_by(
            related_contest_id=id_contest, id=id_voice).first()
        result = post_voice_schema.dump(voice)
        if len(result) == 0:
            result = "Can not find the voice"
        return result

    def put(self, id_contest, id_voice):
        print(id_contest, id_voice)
        voice = Voice.query.filter_by(
            related_contest_id=id_contest, id=id_voice).first()

        if 'audio_file' not in request.files:
            return {'error': 'file not found'}
        file = request.files.get('audio_file')
        print(file)
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

            print(original_file_path)
            print(transformed_file_path)
            file.save(original_file_path)
            file.save(unprocessed_file_path)
            # file.save(transformed_file_path)
            voice.original_voice_file_path = original_file_path
            voice.transformed_voice_file_path = transformed_file_path
            voice.filename = prefix + filename
            flash('File successfully uploaded')
        else:
            return {"error": "File format is not acceptable"}, 412

        db.session.commit()
        return post_voice_schema.dump(voice)

    def delete(self, id_contest, id_voice):
        voice = Voice.query.filter_by(
            related_contest_id=id_contest, id=id_voice).first()
        db.session.delete(voice)
        db.session.commit()
        return post_voice_schema.dump(voice)


class ResourceVoiceUpdater(Resource):
    def get(self):
        voices = Voice.query.filter_by(state="En proceso").all()
        orderedListVoices = posts_voice_schema.dump(voices.items)
        return orderedListVoices


api.add_resource(ResourceListUsers, '/users')
api.add_resource(ResourceOneUser, '/users')
api.add_resource(ResourseListContests, '/contests')
api.add_resource(ResourseOneContest, '/contests/<string:url_contest>')
api.add_resource(ResourseListVoices,
                 '/contests/<int:id_contest>/voices/<int:page>')
api.add_resource(ResourseOneVoice,
                 '/contests/<int:id_contest>/voices/<int:id_voice>')
api.add_resource(ResourceVoiceUpdater, '/update-processed')

if __name__ == '__main__':
    db.create_all()
    # manager.run()
    app.run(debug=True, use_reloader=True)
