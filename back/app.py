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
    print(username)
    print(password)
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
    bannerPath = db.Column(db.String(500))
    startDate = db.Column(db.Date)
    finishDate = db.Column(db.Date)
    payment = db.Column(db.Integer)
    script = db.Column(db.String(500))
    recommendations = db.Column(db.String(500))
    voices = db.relationship('Voice', backref='relatedContest')

"""los nombres, los apellidos, el email, el archivo de audio con la voz y un mensaje con las observaciones que el usuario quiera realizar sobre la voz enviada."""
class Voice(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    relatedContest_id = db.Column(db.Integer, db.ForeignKey('contest.id'), nullable=False)
    name = db.Column(db.String(100))
    lastName = db.Column(db.String(100))
    email = db.Column(db.String(100))
    voiceFilePath = db.Column(db.String(500))
    observationMessage = db.Column(db.String(500))


class Contest_Shema(ma.Schema):
    class Meta:
        fields = ("id", "owner_id", "name", "bannerPath", "startDate",
                  "finishDate", "payment", "script", "recommendations")


class User_Shema(ma.Schema):
    class Meta:
        fields = ("id", "username")

class Voice_Shema(ma.Schema):
    class Meta:
        fields = ("id", "relatedContest_id", "name", "lastName", "email",
                  "voiceFilePath", "observationMessage")
                  
post_contest_schema = Contest_Shema()
posts_contest_schema = Contest_Shema(many=True)

post_user_schema = User_Shema()
posts_user_schema = User_Shema(many=True)


class ResourceListUsers(Resource):
    def get(self):
        users = User.query.all()
        return posts_user_schema.dump(users)

    def post(self):
        print("Registro de usuario")
        signedUser = User.query.filter_by(
            username=request.json['username']).first()
        if signedUser:
            return jsonify({"error": "usuario ya existente"})
        newUser = User(
            username=request.json['username'],
            password=request.json['password']
        )
        db.session.add(newUser)
        db.session.commit()
        return post_user_schema.dump(newUser)


class ResourceOneUser(Resource):
    def get(self):
        user = User.query.get_or_404(current_identity.id)
        return post_user_schema.dump(user)

    def put(self):
        user = User.query.get_or_404(current_identity.id)
        if 'username' in request.json:
            user.username = request.json['username']
        if 'password' in request.json:
            user.password = request.json['password']
        db.session.commit()
        return post_user_schema.dump(user)

    def delete(self):
        user = User.query.get_or_404(current_identity.id)
        db.session.delete(user)
        db.session.commit()
        return '', 204


class ResourseListContests(Resource):
    @jwt_required()
    def get(self):
        contests = Contest.query.filter(Contest.owner_id == current_identity.id)
        unorderedListContest = posts_contest_schema.dump(contests)
        orderedListContest = sorted(
            unorderedListContest, key=lambda x: x['startDate'])
        return orderedListContest

    @jwt_required()
    def post(self):
        if 'name' not in request.json:
            return {"error": "Contest name missing"}, 412

        if 'url' not in request.json:
            return {"error": "Contest url missing"}, 412

        if 'bannerPath' not in request.json:
            return {"error": "Contest banner missing"}, 412

        if 'payment' not in request.json:
            return {"error": "Contest payment missing"}, 412

        if 'startDate' not in request.json:
            return {"error": "Contest start date missing"}, 412

        if 'finishDate' not in request.json:
            return {"error": "Contest finish date missing"}, 412

        if parse(request.json['startDate']).date() <= parse(request.json['finishDate']).date():
            pass
        else:
            return {"error": "Contest start date is later than the finish date"}, 412

        if 'script' not in request.json:
            return {"error": "Contest script missing"}, 412

        if 'recommendations' not in request.json:
            return {"error": "Contest recommendations missing"}, 412

        newContest = Contest(
            name=request.json['name'],
            owner_id=current_identity.id,
            url=request.json['url'],
            bannerPath=request.json['bannerPath'],
            startDate=parse(request.json['startDate']).date(),
            finishDate=parse(request.json['finishDate']).date(),
            payment=request.json['payment'],
            script=request.json['script'],
            recommendations=request.json['recommendations']
        )
        db.session.add(newContest)
        db.session.commit()
        return post_contest_schema.dump(newContest)

class ResourseOneContest(Resource):
    
    def get(self,contestId):
        contest = Contest.query.filter_by(owner_id = current_identity.id, id=contestId).first()
        result = post_contest_schema.dump(contest)
        if len(result)==0:
            result = "Can not find the contest"
        return result

    @jwt_required()
    def put(self,contestId):
        contest = Contest.query.filter_by(owner_id = current_identity.id, id=contestId).first()
        if 'name' in request.json:
            contest.name = request.json['name']
        if 'url' in request.json:
            contest.url = request.json['url']
        if 'bannerPath' in request.json:
            contest.bannerPath = request.json['bannerPath']
        if 'startDate' in request.json:
            contest.startDate = datetime.datetime.strptime(request.json['startDate'], '%Y-%m-%d %H:%M:%S.%f').date()
        if 'finishDate' in request.json:
            contest.finishDate = datetime.datetime.strptime(request.json['finishDate'], '%Y-%m-%d %H:%M:%S.%f').date()
        if 'payment' in request.json:
            contest.payment = request.json['payment']
        if 'script' in request.json:
            contest.script = request.json['script'] 
        if 'recommendations' in request.json:
            contest.recommendations = request.json['recommendations']
        db.session.commit()
        return post_contest_schema.dump(evento)

    def delete(self,id_evento):
        contest = Contest.query.filter_by(owner_id = current_identity.id, id=id_evento).first()
        db.session.delete(contest)
        db.session.commit()
        return "Contest deleted"  

api.add_resource(ResourceListUsers, '/users')
api.add_resource(ResourceOneUser, '/users')
api.add_resource(ResourseListContests, '/contests')
api.add_resource(ResourseOneContest, '/contests/<int:id_contest>')

if __name__ == '__main__':
    db.create_all()
    app.run(debug=True, use_reloader=True)
