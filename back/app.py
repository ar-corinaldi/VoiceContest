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


class Contest_Shema(ma.Schema):
    class Meta:
        fields = ("id", "owner_id", "name", "bannerPath", "startDate",
                  "finishDate", "payment", "script", "recommendations")


class User_Shema(ma.Schema):
    class Meta:
        fields = ("id", "username")


post_contest_schema = Contest_Shema()
posts_contest_schema = Contest_Shema(many=True)

post_user_schema = User_Shema()
posts_user_schema = User_Shema(many=True)


class ResourceListUsers(Resource):
    def get(self):
        users = User.query.all()
        return posts_user_schema.dump(users)

    def post(self):
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
    def get(self, userId):
        user = User.query.get_or_404(userId)
        return post_user_schema.dump(user)

    def put(self, userId):
        user = User.query.get_or_404(userId)
        if 'username' in request.json:
            user.username = request.json['username']
        if 'password' in request.json:
            user.password = request.json['password']
        db.session.commit()
        return post_user_schema.dump(user)

    def delete(self, userId):
        user = User.query.get_or_404(userId)
        db.session.delete(user)
        db.session.commit()
        return '', 204


class ResourseListContests(Resource):
    @jwt_required()
    def get(self, userId):
        contests = Contest.query.filter(Contest.owner_id == userId)
        unorderedListContest = posts_contest_schema.dump(contests)
        orderedListContest = sorted(
            unorderedListContest, key=lambda x: x['startDate'])
        return orderedListContest

    @jwt_required()
    def post(self, userId):
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
            owner_id=userId,
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


api.add_resource(ResourceListUsers, '/users')
api.add_resource(ResourceOneUser, '/users/<int:userId>')
api.add_resource(ResourseListContests, '/users/<int:userId>/contests')

if __name__ == '__main__':
    db.create_all()
    app.run(debug=True, use_reloader=True)
