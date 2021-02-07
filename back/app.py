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
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
app.config['SECRET_KEY'] = 'super-secret'

db = SQLAlchemy(app)

ma = Marshmallow(app)

api = Api(app)

#Contest: url, name, banner, start_date y end_date, payment, script/text, recommendations y voice_list.
class Contest(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    owner_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    url = db.Column(db.String(100), unique=True)
    bannerPath = db.Column(db.String(500))
    startDate = db.Column( db.Date)
    finishDate = db.Column( db.Date)
    payment = db.Column(db.Integer)
    script = db.Column(db.String(500))
    recommendations = db.Column(db.String(500))

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(100))
    contests = db.relationship('Contest', backref='owner')

class Contest_Shema(ma.Schema):
    class Meta:
        fields = ("id", "owner_id", "bannerPath", "startDate", "finishDate", "payment", "script", "recommendations")
class User_Shema(ma.Schema):
    class Meta:
        fields = ("id", "username", "password") 

post_contest_schema = Contest_Shema()
posts_contest_schema = Contest_Shema(many = True)

post_user_schema = User_Shema()
posts_user_schema = User_Shema(many = True)

def authenticate(username, password):
    user = User.query.filter_by(username=username).first()
    if user and user.password==password:
        return user

def identity(payload):
    user_id = payload['identity']
    return User.query.filter_by(id=user_id).first()

jwt = JWT(app, authenticate, identity)

class ResourceListUsers(Resource):
    def get(self):
        users = User.query.all()
        return posts_user_schema.dump(users)

api.add_resource(ResourceListUsers, '/users')

if __name__ == '__main__':
    app.run(debug=True)

