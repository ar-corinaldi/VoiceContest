from flask import Flask, request
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


def authenticate(username, password):
    user = User.query.filter_by(username=username).first()
    if user and user.password == password:
        return user


def identity(payload):
    user_id = payload['identity']
    return User.query.filter_by(id=user_id).first()


app = Flask(__name__, static_folder='../client/public')
app.config['SECRET_KEY'] = 'super-secret'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
CORS(app)
db = SQLAlchemy(app)
ma = Marshmallow(app)
api = Api(app)
jwt = JWT(app, authenticate, identity)


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
    voice_file_ath = db.Column(db.String(500))
    observation_message = db.Column(db.String(500))


class Contest_Shema(ma.Schema):
    class Meta:
        fields = ("id", "owner_id", "name", "banner_path", "start_date",
                  "finish_date", "payment", "script", "recommendations", "url")


class User_Shema(ma.Schema):
    class Meta:
        fields = ("id", "username")


class Voice_Shema(ma.Schema):
    class Meta:
        fields = ("id", "related_contest_id", "name", "last_name", "email",
                  "voice_file_path", "observation_message")


post_contest_schema = Contest_Shema()
posts_contest_schema = Contest_Shema(many=True)

post_user_schema = User_Shema()
posts_user_schema = User_Shema(many=True)

post_voice_schema = Voice_Shema()
posts_voice_schema = Voice_Shema(many=True)


class ResourceListUsers(Resource):
    def get(self):
        users = User.query.all()
        return posts_user_schema.dump(users)

    def post(self):
        signedUser = User.query.filter_by(
            username=request.json['username']).first()
        if signedUser:
            return jsonify({"error": "Username already taken, choose another one."})
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
        return '', 204


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
            result = "Can not find the contest"
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
            contest.start_date = datetime.strptime(
                request.json['start_date'], '%Y-%m-%d %H:%M:%S.%f').date()
        if 'finish_date' in request.json:
            contest.finish_date = datetime.strptime(
                request.json['finish_date'], '%Y-%m-%d %H:%M:%S.%f').date()
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
    def get(self, id_contest):
        voices = Voice.query.filter(Voice.related_contest_id == id_contest)
        "Ordenar por orden de insert en la tabla"
        unorderedListVoices = posts_voice_schema.dump(voices)
        """
        orderedListContest = sorted(
            unorderedListContest, key=lambda x: x['start_date'])
            """
        return unorderedListVoices

    def post(self, id_contest):
        if 'name' not in request.json:
            return {"error": "Voice name missing"}, 412

        if 'last_name' not in request.json:
            return {"error": "Voice last_name missing"}, 412

        if 'email' not in request.json:
            return {"error": "Voice email missing"}, 412

        if 'voiceFilePath' not in request.json:
            return {"error": "Voice voiceFilePath missing"}, 412

        if 'observation_message' not in request.json:
            return {"error": "Voice observation_message missing"}, 412

        newVoice = Voice(
            related_contest_id=id_contest,
            name=request.json['name'],
            last_name=request.json['last_name'],
            email=request.json['email'],
            voiceFilePath=request.json['voiceFilePath'],
            observation_message=request.json['observation_message']
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
        voice = Voice.query.filter_by(
            related_contest_id=id_contest, id=id_voice).first()
        if 'name' in request.json:
            voice.name = request.json['name']
        if 'last_name' in request.json:
            voice.last_name = request.json['last_name']
        if 'email' in request.json:
            voice.email = request.json['email']
        if 'voiceFilePath' in request.json:
            voice.voiceFilePath = request.json['voiceFilePath']
        if 'observation_message' in request.json:
            voice.observation_message = request.json['observation_message']
        db.session.commit()
        return post_voice_schema.dump(voice)

    def delete(self, id_contest, id_voice):
        voice = Voice.query.filter_by(
            related_contest_id=id_contest, id=id_voice).first()
        db.session.delete(voice)
        db.session.commit()
        return "Voice deleted"


api.add_resource(ResourceListUsers, '/users')
api.add_resource(ResourceOneUser, '/users')
api.add_resource(ResourseListContests, '/contests')
api.add_resource(ResourseOneContest, '/contests/<string:url_contest>')
api.add_resource(ResourseListVoices, '/contests/<int:id_contest>/voices')
api.add_resource(ResourseOneVoice,
                 '/contests/<int:id_contest>/voices/<int:id_voice>')

if __name__ == '__main__':
    db.create_all()
    app.run(debug=True, use_reloader=True)
